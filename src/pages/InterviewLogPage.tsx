import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { useApplicationStore } from '../store/useApplicationStore';
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

export default function InterviewLogPage() {
  const { applicationId = '' } = useParams();
  const { getByApplicationId, deleteInterview } = useInterviewStore();
  const { getById } = useApplicationStore();
  const { interviewModal, openAddInterview, openEditInterview, closeInterviewModal } = useUIStore();
  const [deleteTarget, setDeleteTarget] = useState<InterviewRound | null>(null);

  const application = getById(applicationId);
  const interviews = getByApplicationId(applicationId).sort((a, b) => a.dateTime.localeCompare(b.dateTime));

  return (
    <div>
      <div className="mb-6">
        <Link to="/applications" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors">
          <ArrowLeft size={14} />
          Back to Applications
        </Link>
        {application ? (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{application.company}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-gray-600">{application.role}</span>
                <StatusBadge status={application.status} />
              </div>
              {application.hrName && (
                <p className="text-sm text-gray-500 mt-1">HR: {application.hrName} {application.hrContact && `· ${application.hrContact}`}</p>
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

      {interviews.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400 mb-3">No interview rounds logged yet.</p>
          <button onClick={openAddInterview}
            className="text-blue-600 text-sm hover:underline">
            + Add the first round
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((iv) => (
            <div key={iv.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{iv.round}</h3>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${OUTCOME_COLORS[iv.outcome]}`}>
                      {iv.outcome}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{iv.format}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {iv.dateTime && <span>{new Date(iv.dateTime).toLocaleString()}</span>}
                    {iv.interviewer && <span>· {iv.interviewer}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditInterview(iv)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(iv)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
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
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-2 rounded-full ${iv.selfRating >= 8 ? 'bg-green-400' : iv.selfRating >= 5 ? 'bg-yellow-400' : 'bg-red-400'}`}
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
                  {iv.followUpSent
                    ? <CheckCircle size={14} className="text-green-500" />
                    : <Clock size={14} className="text-gray-400" />
                  }
                  <span className="text-gray-600">{iv.followUpSent ? 'Follow-up sent' : 'Follow-up not sent'}</span>
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
        onConfirm={() => { if (deleteTarget) { deleteInterview(deleteTarget.id); setDeleteTarget(null); } }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
