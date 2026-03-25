import React from 'react';
import { InterviewRound } from '../../types';
import { INTERVIEW_FORMATS, INTERVIEW_OUTCOMES } from '../../constants';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useUIStore } from '../../store/useUIStore';

interface Props {
  applicationId: string;
}

const empty: Omit<InterviewRound, 'id' | 'createdAt' | 'updatedAt'> = {
  applicationId: '',
  round: '',
  dateTime: '',
  interviewer: '',
  format: 'Video',
  topics: '',
  selfRating: 7,
  outcome: 'Pending',
  feedback: '',
  takeaways: '',
  followUpSent: false,
};

export default function InterviewForm({ applicationId }: Props) {
  const { interviewModal, closeInterviewModal } = useUIStore();
  const { addInterview, updateInterview } = useInterviewStore();
  const { mode, data } = interviewModal;

  const defaults = mode === 'edit' && data ? data : { ...empty, applicationId };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      applicationId,
      round: fd.get('round') as string,
      dateTime: fd.get('dateTime') as string,
      interviewer: fd.get('interviewer') as string,
      format: fd.get('format') as InterviewRound['format'],
      topics: fd.get('topics') as string,
      selfRating: Number(fd.get('selfRating')),
      outcome: fd.get('outcome') as InterviewRound['outcome'],
      feedback: fd.get('feedback') as string,
      takeaways: fd.get('takeaways') as string,
      followUpSent: fd.get('followUpSent') === 'on',
    };

    if (mode === 'edit' && data) {
      updateInterview(data.id, values);
    } else {
      addInterview(values);
    }
    closeInterviewModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Round *</label>
          <input name="round" defaultValue={defaults.round} placeholder="e.g. Technical Round 1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <select name="format" defaultValue={defaults.format}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {INTERVIEW_FORMATS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date &amp; Time</label>
          <input type="datetime-local" name="dateTime" defaultValue={defaults.dateTime}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
          <input name="interviewer" defaultValue={defaults.interviewer} placeholder="Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Topics Covered</label>
        <input name="topics" defaultValue={defaults.topics} placeholder="e.g. DSA, React, System Design"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Self Rating (1–10): <span className="text-blue-600 font-semibold">{defaults.selfRating}</span></label>
          <input type="range" name="selfRating" min="1" max="10" defaultValue={defaults.selfRating}
            className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
          <select name="outcome" defaultValue={defaults.outcome}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {INTERVIEW_OUTCOMES.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Received</label>
        <textarea name="feedback" defaultValue={defaults.feedback} rows={2}
          placeholder="What they said..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">My Takeaways</label>
        <textarea name="takeaways" defaultValue={defaults.takeaways} rows={2}
          placeholder="What to improve next time..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="followUpSent" id="followUpSent" defaultChecked={defaults.followUpSent}
          className="rounded" />
        <label htmlFor="followUpSent" className="text-sm text-gray-700">Follow-up thank you sent</label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={closeInterviewModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {mode === 'edit' ? 'Save Changes' : 'Add Round'}
        </button>
      </div>
    </form>
  );
}
