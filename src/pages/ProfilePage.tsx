import React, { useState } from 'react';
import { useUserStore, getAvatarColor } from '../store/useUserStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { UserProfile } from '../types';
import PageHeader from '../components/layout/PageHeader';
import { Save, Briefcase, Phone, Mail, Linkedin, Target, DollarSign, Clock, Link, Star, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { users, activeUserId, updateProfile } = useUserStore();
  const { applications } = useApplicationStore();
  const { interviews } = useInterviewStore();
  const [saved, setSaved] = useState(false);

  const profile = users.find((u) => u.id === activeUserId) ?? users[0];

  const userApps = applications.filter((a) => a.userId === activeUserId);
  const userAppIds = new Set(userApps.map((a) => a.id));
  const userInterviews = interviews.filter((i) => userAppIds.has(i.applicationId));

  const quickStats = [
    { label: 'Applications', value: userApps.length, color: 'bg-blue-50 text-blue-700' },
    {
      label: 'Active',
      value: userApps.filter((a) => !['Rejected', 'Ghosted', 'Withdrawn', 'Accepted'].includes(a.status)).length,
      color: 'bg-violet-50 text-violet-700',
    },
    {
      label: 'Interviews',
      value: userInterviews.length,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Offers',
      value: userApps.filter((a) => ['Offer', 'Accepted'].includes(a.status)).length,
      color: 'bg-green-50 text-green-700',
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<Omit<UserProfile, 'id' | 'updatedAt'>> = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      linkedin: fd.get('linkedin') as string,
      targetRole: fd.get('targetRole') as string,
      targetCompanies: fd.get('targetCompanies') as string,
      targetSalary: fd.get('targetSalary') as string,
      noticePeriod: fd.get('noticePeriod') as string,
      resumeLink: fd.get('resumeLink') as string,
      skills: fd.get('skills') as string,
      yearsOfExperience: fd.get('yearsOfExperience') as string,
    };
    updateProfile(activeUserId, data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (
    label: string,
    name: keyof UserProfile,
    type = 'text',
    placeholder = '',
    icon?: React.ReactNode
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        )}
        <input
          type={type}
          name={name}
          defaultValue={profile[name] as string}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-9' : 'px-3'} pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your job search profile and goals"
      />

      {/* User card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 ${getAvatarColor(profile.id)} rounded-2xl flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-white font-bold text-2xl">
              {profile.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            {profile.targetRole && (
              <p className="text-gray-500 text-sm mt-0.5">Looking for: {profile.targetRole}</p>
            )}
            {profile.email && (
              <p className="text-gray-400 text-xs mt-0.5">{profile.email}</p>
            )}
          </div>
          {/* Quick stats */}
          <div className="ml-auto hidden md:flex gap-3">
            {quickStats.map(({ label, value, color }) => (
              <div key={label} className={`flex flex-col items-center px-4 py-2 rounded-lg ${color}`}>
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile quick stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 md:hidden">
          {quickStats.map(({ label, value, color }) => (
            <div key={label} className={`flex flex-col items-center px-2 py-2 rounded-lg ${color}`}>
              <span className="text-xl font-bold">{value}</span>
              <span className="text-[10px] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <Mail size={13} className="text-blue-600" />
            </div>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Full Name', 'name', 'text', 'Your name')}
            {field('Email', 'email', 'email', 'your@email.com', <Mail size={14} />)}
            {field('Phone', 'phone', 'tel', '+1 (555) 000-0000', <Phone size={14} />)}
            {field('LinkedIn URL', 'linkedin', 'text', 'linkedin.com/in/yourname', <Linkedin size={14} />)}
          </div>
        </div>

        {/* Job Search Goals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-100 rounded flex items-center justify-center">
              <Target size={13} className="text-violet-600" />
            </div>
            Job Search Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Target Role', 'targetRole', 'text', 'e.g. Senior Frontend Engineer', <Briefcase size={14} />)}
            {field('Target Salary', 'targetSalary', 'text', 'e.g. $150k–$200k', <DollarSign size={14} />)}
            {field('Notice Period / Availability', 'noticePeriod', 'text', 'e.g. 2 weeks, Immediate', <Clock size={14} />)}
            {field('Years of Experience', 'yearsOfExperience', 'text', 'e.g. 5', <Star size={14} />)}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Companies
              <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="targetCompanies"
              defaultValue={profile.targetCompanies}
              placeholder="e.g. Stripe, Linear, Notion, Figma"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {profile.targetCompanies && (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.targetCompanies.split(',').map((c) => c.trim()).filter(Boolean).map((c) => (
                  <span key={c} className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills & Resume */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <CheckCircle size={13} className="text-green-600" />
            </div>
            Skills & Resume
          </h3>
          <div className="space-y-4">
            {field('Resume / Portfolio Link', 'resumeLink', 'url', 'https://...', <Link size={14} />)}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Skills
                <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
              </label>
              <textarea
                name="skills"
                defaultValue={profile.skills}
                rows={2}
                placeholder="e.g. React, TypeScript, Node.js, System Design, AWS"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {profile.skills && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span key={s} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg font-medium">
              <CheckCircle size={14} />
              Profile saved!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={15} />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
