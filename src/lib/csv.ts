import { Application } from '../types';
import { STATUS_WORKFLOW, SOURCE_OPTIONS } from '../constants';

const HEADERS: (keyof Omit<Application, 'id' | 'createdAt' | 'updatedAt'>)[] = [
  'company', 'role', 'dateApplied', 'source', 'status', 'priority',
  'hrName', 'hrContact', 'jobUrl', 'salaryRange', 'location',
  'nextAction', 'nextActionDate', 'notes', 'jobDescription',
];

function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export const exportApplicationsToCSV = (applications: Application[]): void => {
  const rows = [
    HEADERS.join(','),
    ...applications.map((a) =>
      HEADERS.map((h) => escapeCSV(String(a[h] ?? ''))).join(',')
    ),
  ];

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `job-tracker-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseApplicationsFromCSV = (
  text: string
): Array<Omit<Application, 'id' | 'createdAt' | 'updatedAt'>> => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const today = new Date().toISOString().split('T')[0];

  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = (values[i] ?? '').trim();
      });

      return {
        userId: row.userId || '',
        company: row.company || 'Unknown',
        role: row.role || 'Unknown',
        dateApplied: row.dateApplied || today,
        source: SOURCE_OPTIONS.includes(row.source) ? row.source : 'Other',
        status: (STATUS_WORKFLOW as string[]).includes(row.status)
          ? (row.status as Application['status'])
          : 'Applied',
        priority: (['Low', 'Medium', 'High'] as string[]).includes(row.priority)
          ? (row.priority as Application['priority'])
          : 'Medium',
        hrName: row.hrName || '',
        hrContact: row.hrContact || '',
        jobUrl: row.jobUrl || '',
        salaryRange: row.salaryRange || '',
        location: row.location || '',
        nextAction: row.nextAction || '',
        nextActionDate: row.nextActionDate || '',
        notes: row.notes || '',
        jobDescription: row.jobDescription || '',
      };
    });
};
