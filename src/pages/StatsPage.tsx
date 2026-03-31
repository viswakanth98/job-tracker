import { useMemo } from 'react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { useUserStore } from '../store/useUserStore';
import { STATUS_COLORS } from '../constants';
import PageHeader from '../components/layout/PageHeader';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';

export default function StatsPage() {
  const { applications: allApplications } = useApplicationStore();
  const { interviews: allInterviews } = useInterviewStore();
  const { activeUserId } = useUserStore();

  // Scope everything to the active user
  const applications = useMemo(
    () => allApplications.filter((a) => a.userId === activeUserId),
    [allApplications, activeUserId]
  );

  const userAppIds = useMemo(() => new Set(applications.map((a) => a.id)), [applications]);

  const interviews = useMemo(
    () => allInterviews.filter((i) => userAppIds.has(i.applicationId)),
    [allInterviews, userAppIds]
  );

  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status !== 'Bookmarked').length;
    const responded = applications.filter((a) =>
      ['Shortlisted', 'Phone Screen', 'Interviewing', 'Offer', 'Accepted', 'Rejected'].includes(a.status)
    ).length;
    const interviewed = applications.filter((a) =>
      ['Phone Screen', 'Interviewing', 'Offer', 'Accepted'].includes(a.status)
    ).length;
    const offers = applications.filter((a) => ['Offer', 'Accepted'].includes(a.status)).length;
    const accepted = applications.filter((a) => a.status === 'Accepted').length;
    const rejected = applications.filter((a) => ['Rejected', 'Ghosted'].includes(a.status)).length;

    const responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0;
    const interviewRate = applied > 0 ? Math.round((interviewed / applied) * 100) : 0;
    const offerRate = applied > 0 ? Math.round((offers / applied) * 100) : 0;
    const totalRounds = interviews.length;

    return {
      total, applied, responded, interviewed, offers, accepted, rejected,
      responseRate, interviewRate, offerRate, totalRounds,
    };
  }, [applications, interviews]);

  // Source performance
  const sourceStats = useMemo(() => {
    const map: Record<string, { total: number; interviewed: number; offers: number }> = {};
    applications.forEach((a) => {
      const s = a.source || 'Unknown';
      if (!map[s]) map[s] = { total: 0, interviewed: 0, offers: 0 };
      map[s].total++;
      if (['Phone Screen', 'Interviewing', 'Offer', 'Accepted'].includes(a.status)) map[s].interviewed++;
      if (['Offer', 'Accepted'].includes(a.status)) map[s].offers++;
    });
    return Object.entries(map)
      .map(([source, data]) => ({
        source,
        ...data,
        interviewRate: data.total > 0 ? Math.round((data.interviewed / data.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [applications]);

  // Applications grouped by month (last 8 months)
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    for (let i = 7; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      months[key] = 0;
    }
    applications.forEach((a) => {
      if (!a.dateApplied) return;
      const key = a.dateApplied.slice(0, 7);
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [applications]);

  const maxMonthly = Math.max(...monthlyData.map((w) => w.count), 1);

  // Offers for comparison
  const offerApps = applications.filter((a) => ['Offer', 'Accepted'].includes(a.status));

  const summaryCards = [
    {
      label: 'Response Rate',
      value: `${stats.responseRate}%`,
      sub: `${stats.responded} of ${stats.applied} apps`,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      label: 'Interview Rate',
      value: `${stats.interviewRate}%`,
      sub: `${stats.interviewed} reached interview stage`,
      icon: Target,
      color: 'bg-violet-500',
    },
    {
      label: 'Offer Rate',
      value: `${stats.offerRate}%`,
      sub: `${stats.offers} offer${stats.offers !== 1 ? 's' : ''} received`,
      icon: Award,
      color: 'bg-amber-500',
    },
    {
      label: 'Interview Rounds',
      value: stats.totalRounds,
      sub: `Across ${stats.interviewed} companies`,
      icon: Zap,
      color: 'bg-green-500',
    },
  ];

  const funnel = [
    { label: 'Total Tracked', count: stats.total, color: 'bg-gray-300' },
    { label: 'Applied', count: stats.applied, color: 'bg-blue-400' },
    { label: 'Got Response', count: stats.responded, color: 'bg-cyan-400' },
    { label: 'Reached Interview', count: stats.interviewed, color: 'bg-violet-400' },
    { label: 'Got Offer', count: stats.offers, color: 'bg-amber-400' },
    { label: 'Accepted', count: stats.accepted, color: 'bg-green-400' },
  ];

  return (
    <div>
      <PageHeader title="Insights" subtitle="Understand your job search performance" />

      {applications.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100 mb-6">
          <p className="text-gray-400">Add some applications to see your stats.</p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">{label}</span>
              <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon size={15} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
            <div className="text-xs text-gray-400">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Conversion funnel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5">Conversion Funnel</h2>
          {applications.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {funnel.map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{label}</span>
                    <span className="font-bold text-gray-800">{count}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${color} transition-all duration-500`}
                      style={{
                        width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly bar chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5">Applications by Month</h2>
          {applications.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="flex items-end gap-2 h-36 mt-2">
              {monthlyData.map(({ month, count }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-700 font-semibold" style={{ minHeight: '16px' }}>
                    {count > 0 ? count : ''}
                  </span>
                  <div
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${(count / maxMonthly) * 100}%`,
                      minHeight: count > 0 ? '4px' : '0',
                    }}
                  />
                  <span className="text-[10px] text-gray-400 truncate w-full text-center">
                    {month.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Source performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Source Performance</h2>
        {sourceStats.length === 0 ? (
          <p className="text-gray-400 text-sm">No data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applied</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Interviews</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Offers</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Interview Rate</th>
                </tr>
              </thead>
              <tbody>
                {sourceStats.map(({ source, total, interviewed, offers, interviewRate }) => (
                  <tr key={source} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-800">{source}</td>
                    <td className="py-3 text-right text-gray-600">{total}</td>
                    <td className="py-3 text-right text-gray-600">{interviewed}</td>
                    <td className="py-3 text-right text-gray-600">{offers}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-1.5 bg-blue-500 rounded-full"
                            style={{ width: `${interviewRate}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-semibold w-8 text-right ${
                            interviewRate >= 50
                              ? 'text-green-600'
                              : interviewRate >= 25
                              ? 'text-yellow-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {interviewRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Offer comparison — only shown when there are offers */}
      {offerApps.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-gray-900">Offer Comparison</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {offerApps.length} offer{offerApps.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Salary</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</th>
                </tr>
              </thead>
              <tbody>
                {offerApps.map((a) => (
                  <tr
                    key={a.id}
                    className={`border-b border-gray-50 ${a.status === 'Accepted' ? 'bg-green-50' : ''}`}
                  >
                    <td className="py-3 font-semibold text-gray-900">{a.company}</td>
                    <td className="py-3 text-gray-600">{a.role}</td>
                    <td className="py-3 text-green-700 font-semibold">{a.salaryRange || '—'}</td>
                    <td className="py-3 text-gray-600">{a.location || '—'}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs max-w-xs truncate">{a.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
