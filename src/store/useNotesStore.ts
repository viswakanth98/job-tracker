import { create } from 'zustand';
import { NoteEntry } from '../types';
import { storage } from '../lib/storage';
import { generateId } from '../lib/utils';

const KEY = 'jt_notes';

interface NotesStore {
  notes: NoteEntry[];
  addNote: (applicationId: string, text: string) => void;
  deleteNote: (id: string) => void;
  deleteByApplicationId: (applicationId: string) => void;
  getByApplicationId: (applicationId: string) => NoteEntry[];
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: storage.get<NoteEntry[]>(KEY) ?? [],

  addNote: (applicationId, text) => {
    const note: NoteEntry = {
      id: generateId(),
      applicationId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [note, ...get().notes];
    storage.set(KEY, next);
    set({ notes: next });
  },

  deleteNote: (id) => {
    const next = get().notes.filter((n) => n.id !== id);
    storage.set(KEY, next);
    set({ notes: next });
  },

  deleteByApplicationId: (applicationId) => {
    const next = get().notes.filter((n) => n.applicationId !== applicationId);
    storage.set(KEY, next);
    set({ notes: next });
  },

  getByApplicationId: (applicationId) =>
    get().notes.filter((n) => n.applicationId === applicationId),
}));
