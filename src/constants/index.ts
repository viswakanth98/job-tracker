import { ApplicationStatus, Priority, InterviewFormat, InterviewOutcome } from '../types';

export const STATUS_WORKFLOW: ApplicationStatus[] = [
  'Bookmarked', 'Applied', 'Shortlisted', 'Phone Screen',
  'Interviewing', 'Offer', 'Accepted', 'Rejected', 'Ghosted', 'Withdrawn',
];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Bookmarked: 'bg-slate-100 text-slate-700',
  Applied: 'bg-blue-100 text-blue-700',
  Shortlisted: 'bg-cyan-100 text-cyan-700',
  'Phone Screen': 'bg-indigo-100 text-indigo-700',
  Interviewing: 'bg-violet-100 text-violet-700',
  Offer: 'bg-amber-100 text-amber-700',
  Accepted: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Ghosted: 'bg-gray-100 text-gray-500',
  Withdrawn: 'bg-orange-100 text-orange-700',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: 'bg-green-50 text-green-600',
  Medium: 'bg-yellow-50 text-yellow-600',
  High: 'bg-red-50 text-red-600',
};

export const PRIORITY_OPTIONS: Priority[] = ['Low', 'Medium', 'High'];

export const SOURCE_OPTIONS = [
  'LinkedIn', 'Referral', 'Company Site', 'Recruiter', 'Job Board', 'Other',
];

export const INTERVIEW_FORMATS: InterviewFormat[] = [
  'Phone', 'Video', 'On-site', 'Technical', 'Panel', 'HR Screen',
];

export const INTERVIEW_OUTCOMES: InterviewOutcome[] = [
  'Passed', 'Failed', 'Pending', 'No Feedback',
];
