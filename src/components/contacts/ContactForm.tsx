import React from 'react';
import { Contact } from '../../types';
import { useContactStore } from '../../store/useContactStore';
import { useUIStore } from '../../store/useUIStore';

const CONNECTION_OPTIONS = ['LinkedIn', 'Referral', 'Email', 'Event', 'Cold Outreach', 'Other'];

const empty: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', company: '', role: '', email: '', linkedin: '',
  howConnected: 'LinkedIn', lastContacted: '', notes: '',
};

export default function ContactForm() {
  const { contactModal, closeContactModal } = useUIStore();
  const { addContact, updateContact } = useContactStore();
  const { mode, data } = contactModal;

  const defaults = mode === 'edit' && data ? data : empty;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = Object.fromEntries(fd.entries()) as Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
    if (mode === 'edit' && data) {
      updateContact(data.id, values);
    } else {
      addContact(values);
    }
    closeContactModal();
  };

  const f = (label: string, name: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} defaultValue={defaults[name as keyof typeof defaults] as string}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {f('Name *', 'name', 'text', 'Full name')}
        {f('Company', 'company', 'text', 'Company name')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {f('Role / Title', 'role', 'text', 'e.g. Engineering Recruiter')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How Connected</label>
          <select name="howConnected" defaultValue={defaults.howConnected}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CONNECTION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {f('Email', 'email', 'email', 'name@company.com')}
        {f('LinkedIn URL', 'linkedin', 'text', 'linkedin.com/in/...')}
      </div>
      {f('Last Contacted', 'lastContacted', 'date')}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea name="notes" defaultValue={defaults.notes} rows={3}
          placeholder="Key context, follow-up reminders..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={closeContactModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {mode === 'edit' ? 'Save Changes' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}
