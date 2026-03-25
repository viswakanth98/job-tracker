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
};

export default function ApplicationForm() {
  const { applicationModal, closeApplicationModal } = useUIStore();
  const { addApplication, updateApplication } = useApplicationStore();

  const { mode, data } = applicationModal;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const values = Object.fromEntries(fd.entries()) as Omit<Application, 'id' | 'createdAt' | 'updatedAt'>;

    if (mode === 'edit' && data) {
      updateApplication(data.id, values);
    } else {
      addApplication(values);
    }
    closeApplicationModal();
  };

  const defaultValues = mode === 'edit' && data ? data : emptyForm;

  const field = (label: string, name: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValues[name as keyof typeof defaultValues] as string}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const select = (label: string, name: string, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        defaultValue={defaultValues[name as keyof typeof defaultValues] as string}
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
          defaultValue={defaultValues.notes}
          rows={3}
          placeholder="Any relevant notes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={closeApplicationModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {mode === 'edit' ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  );
}
