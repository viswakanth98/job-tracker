import { useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, ExternalLink, Edit2, Trash2, MessageSquare,
  LayoutGrid, List, Download, Upload, AlertCircle,
} from 'lucide-react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { useNotesStore } from '../store/useNotesStore';
import { useUIStore } from '../store/useUIStore';
import { Application, ApplicationStatus } from '../types';
import { STATUS_WORKFLOW, STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/ui/Modal';
import ApplicationForm from '../components/applications/ApplicationForm';
import KanbanView from '../components/applications/KanbanView';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../lib/utils';
import { exportApplicationsToCSV, parseApplicationsFromCSV } from '../lib/csv';

function isOverdue(app: Application): boolean {
  if (!app.nextActionDate) return false;
  if (['Rejected', 'Ghosted', 'Withdrawn', 'Accepted'].includes(app.status)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(app.nextActionDate) < today;
}

export default function ApplicationsPage() {
  const { applications, deleteApplication, updateApplication, addApplication } = useApplicationStore();
  const { deleteByApplicationId, getByApplicationId } = useInterviewStore();
  const { deleteByApplicationId: deleteNotesByApp } = useNotesStore();
  const {
    applicationModal, openAddApplication, openEditApplication, closeApplicationModal,
    activeStatusFilter, setStatusFilter, searchQuery, setSearchQuery,
    kanbanView, setKanbanView,
  } = useUIStore();

  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    deleteNotesByApp(deleteTarget.id);
    deleteApplication(deleteTarget.id);
    setDeleteTarget(null);
  };

  const statusCounts = useMemo(() => {
    const c: Partial<Record<ApplicationStatus | 'All', number>> = { All: applications.length };
    applications.forEach((a) => { c[a.status] = (c[a.status] ?? 0) + 1; });
    return c;
  }, [applications]);

  const overdueCount = useMemo(
    () => applications.filter(isOverdue).length,
    [applications]
  );

  const handleExport = () => {
    if (applications.length === 0) return;
    exportApplicationsToCSV(applications);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = parseApplicationsFromCSV(text);

    if (rows.length === 0) {
      setImportMsg('No valid rows found in the CSV file.');
    } else {
      rows.forEach((r) => addApplication(r));
      setImportMsg(`Imported ${rows.length} application${rows.length !== 1 ? 's' : ''} successfully.`);
    }

    // Reset input so same file can be re-imported if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setImportMsg(null), 4000);
  };

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle={`${applications.length} total · ${filtered.length} showing${overdueCount > 0 ? ` · ${overdueCount} overdue` : ''}`}
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

      {/* Toolbar: view toggle + export/import */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setKanbanView(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              !kanbanView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Table view"
          >
            <List size={14} />
            Table
          </button>
          <button
            onClick={() => setKanbanView(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              kanbanView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Kanban view"
          >
            <LayoutGrid size={14} />
            Kanban
          </button>
        </div>

        <div className="flex items-center gap-2">
          {importMsg && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-medium">
              {importMsg}
            </span>
          )}
          <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <Upload size={13} />
            Import CSV
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportFile}
            />
          </label>
          <button
            onClick={handleExport}
            disabled={applications.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search & Status filters */}
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

      {/* Overdue banner */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-700">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>
            <strong>{overdueCount}</strong> application{overdueCount !== 1 ? 's have' : ' has'} overdue follow-up actions. Rows are highlighted below.
          </span>
        </div>
      )}

      {/* Kanban or Table view */}
      {kanbanView ? (
        <KanbanView
          applications={filtered}
          onEdit={openEditApplication}
          onDelete={setDeleteTarget}
        />
      ) : (
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
                    const overdue = isOverdue(app);
                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          overdue ? 'border-l-4 border-l-red-400' : ''
                        }`}
                      >
                        {/* Company / Role */}
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            {overdue && (
                              <span title={`Follow-up overdue since ${formatDate(app.nextActionDate)}`}>
                                <AlertCircle
                                  size={14}
                                  className="text-red-500 flex-shrink-0 mt-0.5"
                                /></span>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900">{app.company}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{app.role}</div>
                              {app.salaryRange && (
                                <div className="text-xs text-green-600 mt-0.5">{app.salaryRange}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Inline status select — looks like a badge, saves on click */}
                        <td className="px-4 py-3">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateApplication(app.id, {
                                status: e.target.value as ApplicationStatus,
                              })
                            }
                            className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer border-0 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${STATUS_COLORS[app.status]}`}
                          >
                            {STATUS_WORKFLOW.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[app.priority]}`}
                          >
                            {app.priority}
                          </span>
                        </td>

                        {/* Applied date */}
                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                          {formatDate(app.dateApplied)}
                        </td>

                        {/* Next action */}
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {app.nextAction && (
                            <div>
                              <div className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                                {app.nextAction}
                              </div>
                              {app.nextActionDate && (
                                <div className={`text-xs ${overdue ? 'text-red-400' : 'text-gray-400'}`}>
                                  {formatDate(app.nextActionDate)}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">
                          {app.location || '—'}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/applications/${app.id}/interviews`}
                              className="p-1.5 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors relative"
                              title="View Interview Rounds"
                            >
                              <MessageSquare size={15} />
                              {interviewCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                  {interviewCount}
                                </span>
                              )}
                            </Link>
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Open Job URL"
                              >
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
      )}

      <Modal
        isOpen={applicationModal.open}
        onClose={closeApplicationModal}
        title={applicationModal.mode === 'edit' ? 'Edit Application' : 'Add New Application'}
      >
        <ApplicationForm />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Delete application to ${deleteTarget?.company} — ${deleteTarget?.role}? This will also delete all interview records and notes.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
