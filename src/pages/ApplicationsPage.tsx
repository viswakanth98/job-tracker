import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ExternalLink, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { useUIStore } from '../store/useUIStore';
import { Application, ApplicationStatus } from '../types';
import { STATUS_WORKFLOW, PRIORITY_COLORS } from '../constants';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/ui/Modal';
import ApplicationForm from '../components/applications/ApplicationForm';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../lib/utils';

export default function ApplicationsPage() {
  const { applications, deleteApplication } = useApplicationStore();
  const { deleteByApplicationId, getByApplicationId } = useInterviewStore();
  const {
    applicationModal, openAddApplication, openEditApplication, closeApplicationModal,
    activeStatusFilter, setStatusFilter, searchQuery, setSearchQuery,
  } = useUIStore();

  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  const filtered = useMemo(() =>
    applications
      .filter((a) => activeStatusFilter === 'All' || a.status === activeStatusFilter)
      .filter((a) =>
        !searchQuery ||
        a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [applications, activeStatusFilter, searchQuery]
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteByApplicationId(deleteTarget.id);
    deleteApplication(deleteTarget.id);
    setDeleteTarget(null);
  };

  const statusCounts = useMemo(() => {
    const c: Partial<Record<ApplicationStatus | 'All', number>> = { All: applications.length };
    applications.forEach((a) => { c[a.status] = (c[a.status] ?? 0) + 1; });
    return c;
  }, [applications]);

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle={`${applications.length} total · ${filtered.length} showing`}
        action={
          <button
            onClick={openAddApplication}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Application
          </button>
        }
      />

      {/* Search & Filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['All', ...STATUS_WORKFLOW] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeStatusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s} {statusCounts[s] !== undefined ? `(${statusCounts[s]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company / Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Applied</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Next Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No applications found. Add one to get started!
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const interviewCount = getByApplicationId(app.id).length;
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{app.company}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{app.role}</div>
                        {app.salaryRange && <div className="text-xs text-green-600 mt-0.5">{app.salaryRange}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[app.priority]}`}>
                          {app.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{formatDate(app.dateApplied)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {app.nextAction && (
                          <div>
                            <div className="text-gray-700 text-xs">{app.nextAction}</div>
                            {app.nextActionDate && (
                              <div className="text-gray-400 text-xs">{formatDate(app.nextActionDate)}</div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{app.location || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/applications/${app.id}/interviews`}
                            className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors relative"
                            title="View Interviews"
                          >
                            <MessageSquare size={15} />
                            {interviewCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {interviewCount}
                              </span>
                            )}
                          </Link>
                          {app.jobUrl && (
                            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Open Job URL">
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button
                            onClick={() => openEditApplication(app)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(app)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={applicationModal.open}
        onClose={closeApplicationModal}
        title={applicationModal.mode === 'edit' ? 'Edit Application' : 'Add New Application'}
      >
        <ApplicationForm />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Delete application to ${deleteTarget?.company} — ${deleteTarget?.role}? This will also delete all interview records.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
