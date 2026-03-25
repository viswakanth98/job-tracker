import { create } from 'zustand';
import { Application, InterviewRound, Contact, ApplicationStatus } from '../types';

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  applicationModal: { open: boolean; mode: 'add' | 'edit'; data: Application | null };
  openAddApplication: () => void;
  openEditApplication: (data: Application) => void;
  closeApplicationModal: () => void;

  interviewModal: { open: boolean; mode: 'add' | 'edit'; data: InterviewRound | null };
  openAddInterview: () => void;
  openEditInterview: (data: InterviewRound) => void;
  closeInterviewModal: () => void;

  contactModal: { open: boolean; mode: 'add' | 'edit'; data: Contact | null };
  openAddContact: () => void;
  openEditContact: (data: Contact) => void;
  closeContactModal: () => void;

  activeStatusFilter: ApplicationStatus | 'All';
  setStatusFilter: (status: ApplicationStatus | 'All') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  applicationModal: { open: false, mode: 'add', data: null },
  openAddApplication: () => set({ applicationModal: { open: true, mode: 'add', data: null } }),
  openEditApplication: (data) => set({ applicationModal: { open: true, mode: 'edit', data } }),
  closeApplicationModal: () => set({ applicationModal: { open: false, mode: 'add', data: null } }),

  interviewModal: { open: false, mode: 'add', data: null },
  openAddInterview: () => set({ interviewModal: { open: true, mode: 'add', data: null } }),
  openEditInterview: (data) => set({ interviewModal: { open: true, mode: 'edit', data } }),
  closeInterviewModal: () => set({ interviewModal: { open: false, mode: 'add', data: null } }),

  contactModal: { open: false, mode: 'add', data: null },
  openAddContact: () => set({ contactModal: { open: true, mode: 'add', data: null } }),
  openEditContact: (data) => set({ contactModal: { open: true, mode: 'edit', data } }),
  closeContactModal: () => set({ contactModal: { open: false, mode: 'add', data: null } }),

  activeStatusFilter: 'All',
  setStatusFilter: (status) => set({ activeStatusFilter: status }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
