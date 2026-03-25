import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, ExternalLink } from 'lucide-react';
import { useContactStore } from '../store/useContactStore';
import { useUIStore } from '../store/useUIStore';
import { Contact } from '../types';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/ui/Modal';
import ContactForm from '../components/contacts/ContactForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../lib/utils';

export default function ContactsPage() {
  const { contacts, deleteContact } = useContactStore();
  const { contactModal, openAddContact, openEditContact, closeContactModal } = useUIStore();
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    contacts.filter((c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [contacts, search]
  );

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} contacts`}
        action={
          <button
            onClick={openAddContact}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Contact
          </button>
        }
      />

      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400">No contacts yet. Add recruiters and connections!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{c.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.role || 'Unknown role'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditContact(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {c.company && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{c.company}</span>
                  <span className="text-xs text-gray-400">{c.howConnected}</span>
                </div>
              )}

              <div className="space-y-1.5 mb-3">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail size={12} />
                    {c.email}
                  </a>
                )}
                {c.linkedin && (
                  <a href={c.linkedin.startsWith('http') ? c.linkedin : `https://${c.linkedin}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors">
                    <ExternalLink size={12} />
                    {c.linkedin}
                  </a>
                )}
              </div>

              {c.lastContacted && (
                <p className="text-xs text-gray-400">Last contacted: {formatDate(c.lastContacted)}</p>
              )}

              {c.notes && (
                <p className="text-xs text-gray-600 mt-2 bg-gray-50 px-3 py-2 rounded-lg line-clamp-2">{c.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={contactModal.open}
        onClose={closeContactModal}
        title={contactModal.mode === 'edit' ? 'Edit Contact' : 'Add Contact'}
        size="md"
      >
        <ContactForm />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Delete contact "${deleteTarget?.name}"?`}
        onConfirm={() => { if (deleteTarget) { deleteContact(deleteTarget.id); setDeleteTarget(null); } }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
