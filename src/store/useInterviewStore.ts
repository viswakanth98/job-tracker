import { create } from 'zustand';
import { InterviewRound } from '../types';
import { storage } from '../lib/storage';
import { generateId } from '../lib/utils';

const KEY = 'jt_interviews';

const SEED: InterviewRound[] = [
  {
    id: 'i1', applicationId: '1', round: 'Phone Screen',
    dateTime: '2024-03-10T14:00', interviewer: 'Sarah Chen', format: 'Phone',
    topics: 'General background, role expectations, team structure',
    selfRating: 8, outcome: 'Passed', feedback: 'Good communication, move to technical round',
    takeaways: 'Research Stripe payment infra more', followUpSent: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'i2', applicationId: '1', round: 'Technical Round 1',
    dateTime: '2024-03-17T15:00', interviewer: 'Alex Kumar', format: 'Video',
    topics: 'React, TypeScript, state management, system design basics',
    selfRating: 7, outcome: 'Passed', feedback: 'Strong on React, could improve on system design',
    takeaways: 'Study distributed systems, practice HLD', followUpSent: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

interface InterviewStore {
  interviews: InterviewRound[];
  addInterview: (data: Omit<InterviewRound, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInterview: (id: string, data: Partial<InterviewRound>) => void;
  deleteInterview: (id: string) => void;
  deleteByApplicationId: (applicationId: string) => void;
  getByApplicationId: (applicationId: string) => InterviewRound[];
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  interviews: storage.get<InterviewRound[]>(KEY) ?? SEED,

  addInterview: (data) => {
    const id = generateId();
    const now = new Date().toISOString();
    const next = [...get().interviews, { ...data, id, createdAt: now, updatedAt: now }];
    storage.set(KEY, next);
    set({ interviews: next });
  },

  updateInterview: (id, data) => {
    const next = get().interviews.map((i) =>
      i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i
    );
    storage.set(KEY, next);
    set({ interviews: next });
  },

  deleteInterview: (id) => {
    const next = get().interviews.filter((i) => i.id !== id);
    storage.set(KEY, next);
    set({ interviews: next });
  },

  deleteByApplicationId: (applicationId) => {
    const next = get().interviews.filter((i) => i.applicationId !== applicationId);
    storage.set(KEY, next);
    set({ interviews: next });
  },

  getByApplicationId: (applicationId) =>
    get().interviews.filter((i) => i.applicationId === applicationId),
}));
