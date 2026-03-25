export type ApplicationStatus =
  | 'Bookmarked'
  | 'Applied'
  | 'Shortlisted'
  | 'Phone Screen'
  | 'Interviewing'
  | 'Offer'
  | 'Accepted'
  | 'Rejected'
  | 'Ghosted'
  | 'Withdrawn';

export type Priority = 'Low' | 'Medium' | 'High';
export type InterviewFormat = 'Phone' | 'Video' | 'On-site' | 'Technical' | 'Panel' | 'HR Screen';
export type InterviewOutcome = 'Passed' | 'Failed' | 'Pending' | 'No Feedback';

export interface Application {
  id: string;
  dateApplied: string;
  company: string;
  role: string;
  jobUrl: string;
  source: string;
  status: ApplicationStatus;
  priority: Priority;
  hrName: string;
  hrContact: string;
  nextAction: string;
  nextActionDate: string;
  salaryRange: string;
  location: string;
  notes: string;
  jobDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteEntry {
  id: string;
  applicationId: string;
  text: string;
  createdAt: string;
}

export interface InterviewRound {
  id: string;
  applicationId: string;
  round: string;
  dateTime: string;
  interviewer: string;
  format: InterviewFormat;
  topics: string;
  selfRating: number;
  outcome: InterviewOutcome;
  feedback: string;
  takeaways: string;
  followUpSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  linkedin: string;
  howConnected: string;
  lastContacted: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
