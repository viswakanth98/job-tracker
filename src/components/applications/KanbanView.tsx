import { Link } from 'react-router-dom';
import { Edit2, Trash2, MessageSquare, AlertCircle, ExternalLink } from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { STATUS_WORKFLOW, STATUS_COLORS, PRIORITY_COLORS } from '../../constants';
import { useInterviewStore } from '../../store/useInterviewStore';
import { formatDate } from '../../lib/utils';

function isOverdue(app: Application): boolean {
  if (!app.nextActionDate) return false;
  if (['Rejected', 'Ghosted', 'Withdrawn', 'Accepted'].includes(app.status)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(app.nextActionDate) < today;
}

interface Props {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

export default function KanbanView({ applications, onEdit, onDelete }: Props) {
  const { getByApplicationId } = useInterviewStore();

  // Only render columns that have at least one application, preserving workflow order
  const activeColumns = STATUS_WORKFLOW.filter((s) =>
    applications.some((a) => a.status === s)
  );

  if (activeColumns.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
        <p className="text-gray-400">No applications match the current filter.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start">
      {activeColumns.map((status) => {
        const columnApps = applications.filter((a) => a.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-68" style={{ width: '272px' }}>
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
              >
                {status}
              </span>
              <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                {columnApps.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {columnApps.map((app) => {
                const interviewCount = getByApplicationId(app.id).length;
                const overdue = isOverdue(app);

                return (
                  <div
                    key={app.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border transition-shadow hover:shadow-md ${
                      overdue ? 'border-l-4 border-l-red-400 border-t border-r border-b border-gray-100' : 'border border-gray-100'
                    }`}
                  >
                    {overdue && (
                      <div className="flex items-center gap-1.5 text-red-500 text-xs mb-2 font-medium">
                        <AlertCircle size={12} />
                        Action overdue · {formatDate(app.nextActionDate)}
                      </div>
                    )}

                    <div className="font-semibold text-gray-900 text-sm leading-snug">{app.company}</div>
                    <div className="text-xs text-gray-500 mt-0.5 mb-2 leading-snug">{app.role}</div>

                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[app.priority]}`}
                      >
                        {app.priority}
                      </span>
                      {app.salaryRange && (
                        <span className="text-xs text-green-600 font-medium">{app.salaryRange}</span>
                      )}
                      {app.location && (
                        <span className="text-xs text-gray-400">{app.location}</span>
                      )}
                    </div>

                    {app.nextAction && !overdue && (
                      <div className="text-xs text-gray-400 mb-2 truncate">
                        ↳ {app.nextAction}
                        {app.nextActionDate && ` · ${formatDate(app.nextActionDate)}`}
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 mt-1">
                      <Link
                        to={`/applications/${app.id}/interviews`}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-colors"
                        title="View interview rounds"
                      >
                        <MessageSquare size={12} />
                        {interviewCount > 0
                          ? `${interviewCount} round${interviewCount > 1 ? 's' : ''}`
                          : 'No rounds'}
                      </Link>
                      <div className="flex gap-0.5">
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Open job URL"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          onClick={() => onEdit(app)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(app)}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { isOverdue };
export type { ApplicationStatus };
