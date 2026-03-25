import { useState, useRef, KeyboardEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus, ArrowLeft, Edit2, Trash2, CheckCircle, Clock,
  StickyNote, Send, X, FileText, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { useNotesStore } from '../store/useNotesStore';
import { useUIStore } from '../store/useUIStore';
import { InterviewRound } from '../types';
import Modal from '../components/ui/Modal';
import InterviewForm from '../components/interviews/InterviewForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';

const OUTCOME_COLORS: Record<string, string> = {
  Passed: 'bg-green-100 text-green-700',
  Failed: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  'No Feedback': 'bg-gray-100 text-gray-600',
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function InterviewLogPage() {
  const { applicationId = '' } = useParams();
  const { getByApplicationId, deleteInterview } = useInterviewStore();
  const { getById } = useApplicationStore();
  const { addNote, deleteNote, getByApplicationId: getNotesByApp } = useNotesStore();
  const { interviewModal, openAddInterview, openEditInterview, closeInterviewModal } = useUIStore();

  const [deleteTarget, setDeleteTarget] = useState<InterviewRound | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [showJD, setShowJD] = useState(false);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  const application = getById(applicationId);
  const interviews = getByApplicationId(applicationId).sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime)
  );
  const appNotes = getNotesByApp(applicationId).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    addNote(applicationId, noteInput.trim());
    setNoteInput('');
    noteInputRef.current?.focus();
  };

  const handleNoteKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Applications
        </Link>

        {application ? (
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{application.company}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-gray-600">{application.role}</span>
                <StatusBadge status={application.status} />
                {application.salaryRange && (
                  <span className="text-sm text-green-600 font-medium">{application.salaryRange}</span>
                )}
              </div>
              {application.hrName && (
                <p className="text-sm text-gray-500 mt-1">
                  HR: {application.hrName}
                  {application.hrContact && ` · ${application.hrContact}`}
                </p>
              )}
            </div>
            <button
              onClick={openAddInterview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Round
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Application not found.</p>
        )}
      </div>

      {/* Job Description (collapsible) */}
      {application?.jobDescription && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <button
            onClick={() => setShowJD((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText size={15} className="text-gray-400" />
              Job Description
            </div>
            {showJD ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </button>
          {showJD && (
            <div className="px-5 pb-5 border-t border-gray-100">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mt-4 font-sans">
                {application.jobDescription}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Interview rounds */}
      {interviews.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100 mb-6">
          <p className="text-gray-400 mb-2">No interview rounds logged yet.</p>
          <button onClick={openAddInterview} className="text-blue-600 text-sm hover:underline">
            + Add the first round
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {interviews.map((iv) => (
            <div key={iv.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{iv.round}</h3>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${OUTCOME_COLORS[iv.outcome]}`}
                    >
                      {iv.outcome}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {iv.format}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                    {iv.dateTime && <span>{new Date(iv.dateTime).toLocaleString()}</span>}
                    {iv.interviewer && <span>· {iv.interviewer}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditInterview(iv)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(iv)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Self rating bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Self Rating</span>
                  <span className="font-semibold text-gray-800">{iv.selfRating}/10</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      iv.selfRating >= 8
                        ? 'bg-green-400'
                        : iv.selfRating >= 5
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                    style={{ width: `${iv.selfRating * 10}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {iv.topics && (
                  <div>
                    <span className="font-medium text-gray-700">Topics: </span>
                    <span className="text-gray-600">{iv.topics}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  {iv.followUpSent ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <Clock size={14} className="text-gray-400" />
                  )}
                  <span className="text-gray-600">
                    {iv.followUpSent ? 'Follow-up sent' : 'Follow-up not sent'}
                  </span>
                </div>
                {iv.feedback && (
                  <div className="md:col-span-2">
                    <p className="font-medium text-gray-700 mb-1">Feedback Received</p>
                    <p className="text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">{iv.feedback}</p>
                  </div>
                )}
                {iv.takeaways && (
                  <div className="md:col-span-2">
                    <p className="font-medium text-gray-700 mb-1">My Takeaways</p>
                    <p className="text-gray-600 bg-amber-50 px-3 py-2 rounded-lg">{iv.takeaways}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <StickyNote size={15} className="text-gray-400" />
          <h2 className="font-semibold text-gray-900">Activity Notes</h2>
          <span className="text-xs text-gray-400 ml-1">
            — timestamped log for this application
          </span>
        </div>

        {/* Add note input */}
        <div className="px-6 py-4 border-b border-gray-50">
          <textarea
            ref={noteInputRef}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={handleNoteKeyDown}
            placeholder="Add a note... (Cmd+Enter to save)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddNote}
              disabled={!noteInput.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={12} />
              Save Note
            </button>
          </div>
        </div>

        {/* Notes list */}
        {appNotes.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">
            No notes yet. Add your first note above.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appNotes.map((note) => (
              <div key={note.id} className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 group transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-300 flex-shrink-0 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(note.createdAt)}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                  title="Delete note"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={interviewModal.open}
        onClose={closeInterviewModal}
        title={interviewModal.mode === 'edit' ? 'Edit Interview Round' : 'Add Interview Round'}
      >
        <InterviewForm applicationId={applicationId} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Delete "${deleteTarget?.round}" round? This cannot be undone.`}
        onConfirm={() => {
          if (deleteTarget) {
            deleteInterview(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
