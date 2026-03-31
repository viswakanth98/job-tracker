import { create } from 'zustand';
import { Application } from '../types';
import { storage } from '../lib/storage';
import { generateId } from '../lib/utils';

const KEY = 'jt_applications';

const SEED: Application[] = [
  {
    id: '1', userId: 'viswa', dateApplied: '2024-03-01', company: 'Stripe', role: 'Senior Frontend Engineer',
    jobUrl: 'https://stripe.com/jobs', source: 'LinkedIn', status: 'Interviewing',
    priority: 'High', hrName: 'Sarah Chen', hrContact: 'sarah@stripe.com',
    nextAction: 'Prepare system design', nextActionDate: '2024-03-20',
    salaryRange: '$150k–$180k', location: 'Remote',
    notes: 'Great company culture, strong referral from John.',
    jobDescription: 'We are looking for a Senior Frontend Engineer to join our Payments team. You will build the next generation of payment UIs using React, TypeScript, and modern web standards.',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '2', userId: 'viswa', dateApplied: '2024-03-05', company: 'Notion', role: 'Product Engineer',
    jobUrl: 'https://notion.so/jobs', source: 'Company Site', status: 'Applied',
    priority: 'Medium', hrName: '', hrContact: '',
    nextAction: 'Follow up if no response by March 15', nextActionDate: '2024-03-15',
    salaryRange: '$130k–$160k', location: 'San Francisco, CA',
    notes: '',
    jobDescription: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '3', userId: 'viswa', dateApplied: '2024-02-20', company: 'Linear', role: 'Software Engineer',
    jobUrl: 'https://linear.app/jobs', source: 'Referral', status: 'Offer',
    priority: 'High', hrName: 'Mike Torres', hrContact: 'mike@linear.app',
    nextAction: 'Negotiate offer', nextActionDate: '2024-03-22',
    salaryRange: '$160k–$190k', location: 'Remote',
    notes: 'Offer received! $170k base + equity.',
    jobDescription: 'Build the tools that engineers love. Work on a small, focused team to design and implement core product features.',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '4', userId: 'vyshu', dateApplied: '2024-03-08', company: 'Figma', role: 'UX Engineer',
    jobUrl: 'https://figma.com/jobs', source: 'LinkedIn', status: 'Applied',
    priority: 'High', hrName: 'Priya Nair', hrContact: 'priya@figma.com',
    nextAction: 'Send portfolio link', nextActionDate: '2024-03-18',
    salaryRange: '$140k–$170k', location: 'Remote',
    notes: 'Applied via LinkedIn. Great design culture.',
    jobDescription: 'Join the Figma product team to build interfaces that millions of designers use daily.',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: '5', userId: 'vyshu', dateApplied: '2024-03-12', company: 'Vercel', role: 'Frontend Engineer',
    jobUrl: 'https://vercel.com/careers', source: 'Referral', status: 'Shortlisted',
    priority: 'Medium', hrName: 'James Liu', hrContact: 'james@vercel.com',
    nextAction: 'Prepare for phone screen', nextActionDate: '2024-03-25',
    salaryRange: '$130k–$160k', location: 'Remote',
    notes: 'Referred by college friend. Shortlisted after resume review.',
    jobDescription: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

interface ApplicationStore {
  applications: Application[];
  addApplication: (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateApplication: (id: string, data: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  getById: (id: string) => Application | undefined;
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  // Migrate old records that don't have userId by defaulting to 'viswa'
  applications: (storage.get<Application[]>(KEY) ?? SEED).map((a) => ({
    ...a,
    userId: a.userId ?? 'viswa',
  })),

  addApplication: (data) => {
    const id = generateId();
    const now = new Date().toISOString();
    const next = [...get().applications, { ...data, id, createdAt: now, updatedAt: now }];
    storage.set(KEY, next);
    set({ applications: next });
    return id;
  },

  updateApplication: (id, data) => {
    const next = get().applications.map((a) =>
      a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
    );
    storage.set(KEY, next);
    set({ applications: next });
  },

  deleteApplication: (id) => {
    const next = get().applications.filter((a) => a.id !== id);
    storage.set(KEY, next);
    set({ applications: next });
  },

  getById: (id) => get().applications.find((a) => a.id === id),
}));
