import { create } from 'zustand';
import { Contact } from '../types';
import { storage } from '../lib/storage';
import { generateId } from '../lib/utils';

const KEY = 'jt_contacts';

const SEED: Contact[] = [
  {
    id: 'c1', name: 'Sarah Chen', company: 'Stripe', role: 'Engineering Recruiter',
    email: 'sarah@stripe.com', linkedin: 'linkedin.com/in/sarahchen',
    howConnected: 'LinkedIn', lastContacted: '2024-03-10',
    notes: 'Very responsive, check in every 2 weeks.',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'c2', name: 'Mike Torres', company: 'Linear', role: 'Head of Talent',
    email: 'mike@linear.app', linkedin: 'linkedin.com/in/miketorres',
    howConnected: 'Referral', lastContacted: '2024-03-18',
    notes: 'Extended offer on March 18. Decision needed by March 25.',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

interface ContactStore {
  contacts: Contact[];
  addContact: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: storage.get<Contact[]>(KEY) ?? SEED,

  addContact: (data) => {
    const id = generateId();
    const now = new Date().toISOString();
    const next = [...get().contacts, { ...data, id, createdAt: now, updatedAt: now }];
    storage.set(KEY, next);
    set({ contacts: next });
  },

  updateContact: (id, data) => {
    const next = get().contacts.map((c) =>
      c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
    );
    storage.set(KEY, next);
    set({ contacts: next });
  },

  deleteContact: (id) => {
    const next = get().contacts.filter((c) => c.id !== id);
    storage.set(KEY, next);
    set({ contacts: next });
  },
}));
