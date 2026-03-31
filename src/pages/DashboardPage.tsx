import { useMemo } from 'react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { useUserStore, getAvatarColor } from '../store/useUserStore';
import { ApplicationStatus } from '../types';
import { STATUS_COLORS, STATUS_WORKFLOW } from '../constants';
import { Briefcase, TrendingUp, MessageSquare, Award } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { formatDate } from '../lib/utils';

export default function DashboardPage() {
  const { applications } = useApplicationStore();
  const { interviews } = useInterviewStore();
  const { activeUserId, getActiveUser } = useUserStore();

  const activeUser = getActiveUser();

  // Filter to active user only
  const userApplications = useMemo(
    () => applications.filter((a) => a.userId === activeUserId),
    [applications, activeUserId]
  );

  const userAppIds = useMemo(
    () => new Set(userApplications.map((a) => a.id)),
    [userApplications]
  );

  const stats = useMemo(() => {
    const active = userApplications.filter((a) =>
      !['Rejected', 'Ghosted', 'Withdrawn', 'Accepted'].includes(a.status)
    );
    const interviewing = userApplications.filter((a) =>
      ['Phone Screen', 'Interviewing'].includes(a.status)
    );
    const offers = userApplications.filter((a) => ['Offer', 'Accepted'].includes(a.status));
    return { total: userApplications.length, active: active.length, interviewing: interviewing.length, offers: offers.length };
  }, [userApplications]);

  const statusBreakdown = useMemo(() => {
    const counts: Partial<Record<ApplicationStatus, number>> = {};
    userApplications.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    });
    return STATUS_WORKFLOW.filter((s) => counts[s]).map((s) => ({ status: s, count: counts[s]! }));
  }, [userApplications]);

  const recent = useMemo(() =>
    [...userApplications].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    [userApplications]
  );

  const upcomingInterviews = useMemo(() =>
    [...interviews]
      .filter((i) => i.outcome === 'Pending' && i.dateTime && userAppIds.has(i.applicationId))
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
      .slice(0, 5),
    [interviews, userAppIds]
  );

  const cards = [
    { label: 'Total Applied', value: stats.total, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Active Pipeline', value: stats.active, icon: TrendingUp, color: 'bg-violet-500' },
    { label: 'Interviewing', value: stats.interviewing, icon: MessageSquare, color: 'bg-amber-500' },
    { label: 'Offers', value: stats.offers, icon: Award, color: 'bg-green-500' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`${activeUser.name}'s job search at a glance`}
        action={
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getAvatarColor(activeUser.id)}`}>
            <span className="text-white font-bold text-sm">{activeUser.name.slice(0, 2).toUpperCase()}</span>
            <span className="text-white text-sm font-medium">{activeUser.name}</span>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">{label}</span>
              <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
                <Icon size={16} className="text-white" />
              </div>
            </div>
            <span className="text-3xl font-bold text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pipeline breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Pipeline Breakdown</h2>
          {statusBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {statusBreakdown.map(({ status, count }) => (
                <div key={status} className="flex items-center gap-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium w-28 justify-center ${STATUS_COLORS[status]}`}>
                    {status}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(count / userApplications.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming interviews */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
          {upcomingInterviews.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming interviews.</p>
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((i) => {
                const app = userApplications.find((a) => a.id === i.applicationId);
                return (
                  <div key={i.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{app?.company} — {i.round}</p>
                      <p className="text-xs text-gray-500">{i.dateTime ? new Date(i.dateTime).toLocaleString() : '—'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Applications</h2>
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((a) => (
              <div key={a.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold text-sm">{a.company[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{a.company} — {a.role}</p>
                  <p className="text-xs text-gray-500">Applied {formatDate(a.dateApplied)}</p>
                </div>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
