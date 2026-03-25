import React from 'react';
import { Application } from '../../types';
import { STATUS_WORKFLOW, PRIORITY_OPTIONS, SOURCE_OPTIONS } from '../../constants';
import { useApplicationStore } from '../../store/useApplicationStore';
import { useUIStore } from '../../store/useUIStore';

const today = new Date().toISOString().split('T')[0];

const emptyForm: Omit<Application, 'id' | 'createdAt' | 'updatedAt'> = {
  dateApplied: today,
  company: '',
  role: '',
  jobUrl: '',
  source: 'LinkedIn',
  status: 'Applied',
  priority: 'Medium',
  hrName: '',
  hrContact: '',
  nextAction: '',
  nextActionDate: '',
  salaryRange: '',
  location: '',
  notes: '',
  jobDescription: '',
};

export default function ApplicationForm() {
  const { applicationModal, closeApplicationModal } = useUIStore();
  const { addApplication, updateApplication } = useApplicationStore();

  const { mode, data } = applicationModal;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Omit<Application, 'id' | 'createdAt' | 'updatedAt'> = {
      company: fd.get('company') as string,
      role: fd.get('role') as string,
      dateApplied: fd.get('dateApplied') as string,
      source: fd.get('source') as string,
      status: fd.get('status') as Application['status'],
      priority: fd.get('priority') as Application['priority'],
      hrName: fd.get('hrName') as string,
      hrContact: fd.get('hrContact') as string,
      jobUrl: fd.get('jobUrl') as string,
      salaryRange: fd.get('salaryRange') as string,
      location: fd.get('location') as string,
      nextAction: fd.get('nextAction') as string,
      nextActionDate: fd.get('nextActionDate') as string,
      notes: fd.get('notes') as string,
      jobDescription: fd.get('jobDescription') as string,
    };

    if (mode === 'edit' && data) {
      updateApplication(data.id, values);
    } else {
      addApplication(values);
    }
    closeApplicationModal();
  };

  const dv = mode === 'edit' && data ? data : emptyForm;

  const field = (label: string, name: keyof typeof dv, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={dv[name] as string}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const select = (label: string, name: keyof typeof dv, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        defaultValue={dv[name] as string}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field('Company *', 'company', 'text', 'e.g. Stripe')}
        {field('Role *', 'role', 'text', 'e.g. Senior Engineer')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('Date Applied', 'dateApplied', 'date')}
        {select('Source', 'source', SOURCE_OPTIONS)}
      </div>
      {field('Job URL', 'jobUrl', 'url', 'https://...')}
      <div className="grid grid-cols-2 gap-4">
        {select('Status', 'status', STATUS_WORKFLOW)}
        {select('Priority', 'priority', PRIORITY_OPTIONS)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('HR / Recruiter Name', 'hrName', 'text')}
        {field('HR Contact (Email / Phone)', 'hrContact', 'text')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('Salary Range', 'salaryRange', 'text', 'e.g. $120k–$150k')}
        {field('Location', 'location', 'text', 'e.g. Remote, SF')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('Next Action', 'nextAction', 'text', 'e.g. Send follow-up')}
        {field('Next Action Date', 'nextActionDate', 'date')}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          defaultValue={dv.notes}
          rows={2}
          placeholder="Key notes about this application..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
          <span className="text-gray-400 font-normal ml-1">(paste the full JD so it&apos;s saved before the posting goes down)</span>
        </label>
        <textarea
          name="jobDescription"
          defaultValue={dv.jobDescription}
          rows={4}
          placeholder="Paste the full job description here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={closeApplicationModal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {mode === 'edit' ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  );
}
