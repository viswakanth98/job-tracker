import { create } from 'zustand';
import { UserProfile } from '../types';
import { storage } from '../lib/storage';

const USERS_KEY = 'jt_users';
const ACTIVE_KEY = 'jt_active_user';

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'viswa',
    name: 'Viswa',
    email: '',
    phone: '',
    linkedin: '',
    targetRole: '',
    targetCompanies: '',
    targetSalary: '',
    noticePeriod: '',
    resumeLink: '',
    skills: '',
    yearsOfExperience: '',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'vyshu',
    name: 'Vyshu',
    email: '',
    phone: '',
    linkedin: '',
    targetRole: '',
    targetCompanies: '',
    targetSalary: '',
    noticePeriod: '',
    resumeLink: '',
    skills: '',
    yearsOfExperience: '',
    updatedAt: new Date().toISOString(),
  },
];

export const AVATAR_COLORS: Record<string, string> = {
  viswa: 'bg-blue-500',
  vyshu: 'bg-violet-500',
};

export const getAvatarColor = (id: string) => AVATAR_COLORS[id] ?? 'bg-gray-500';

interface UserStore {
  users: UserProfile[];
  activeUserId: string;
  setActiveUser: (id: string) => void;
  updateProfile: (id: string, data: Partial<Omit<UserProfile, 'id' | 'updatedAt'>>) => void;
  getActiveUser: () => UserProfile;
  getUserById: (id: string) => UserProfile | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: storage.get<UserProfile[]>(USERS_KEY) ?? DEFAULT_USERS,
  activeUserId: storage.get<string>(ACTIVE_KEY) ?? 'viswa',

  setActiveUser: (id) => {
    storage.set(ACTIVE_KEY, id);
    set({ activeUserId: id });
  },

  updateProfile: (id, data) => {
    const next = get().users.map((u) =>
      u.id === id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u
    );
    storage.set(USERS_KEY, next);
    set({ users: next });
  },

  getActiveUser: () => {
    const { users, activeUserId } = get();
    return users.find((u) => u.id === activeUserId) ?? users[0];
  },

  getUserById: (id) => get().users.find((u) => u.id === id),
}));
