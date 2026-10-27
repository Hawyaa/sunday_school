import React, { useState } from 'react';
import {
  IconUsers,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconSearch,
} from './AdminIcons';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Section Admin' | 'Editor' | 'Auditor';
  section: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

export function AdminUsersView() {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Abebe Kebede',
      email: 'abebe.k@abunemedia.org',
      role: 'Super Admin',
      section: 'All Modules',
      status: 'Active',
      lastActive: 'Just now',
    },
    {
      id: '2',
      name: 'Tigist Mengistu',
      email: 'tigist.m@abunemedia.org',
      role: 'Section Admin',
      section: 'Announcements',
      status: 'Active',
      lastActive: '2 hours ago',
    },
    {
      id: '3',
      name: 'Daniel Kassaye',
      email: 'daniel.k@abunemedia.org',
      role: 'Section Admin',
      section: 'Events',
      status: 'Active',
      lastActive: '1 day ago',
    },
    {
      id: '4',
      name: 'Yonas Berhanu',
      email: 'yonas.b@abunemedia.org',
      role: 'Section Admin',
      section: 'Mezmur',
      status: 'Active',
      lastActive: '3 hours ago',
    },
    {
      id: '5',
      name: 'Deacon Ermias',
      email: 'ermias.d@abunemedia.org',
      role: 'Section Admin',
      section: 'Teachings',
      status: 'Active',
      lastActive: 'Yesterday',
    },
    {
      id: '6',
      name: 'Selam Wolde',
      email: 'selam.w@abunemedia.org',
      role: 'Section Admin',
      section: 'Gallery',
      status: 'Invited',
      lastActive: 'Pending accept',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'Super Admin' | 'Section Admin' | 'Editor' | 'Auditor'>('Section Admin');
  const [formSection, setFormSection] = useState('Mezmur');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Section Admin');
    setFormSection('Mezmur');
    setShowModal(true);
  };

  const handleEdit = (u: AdminUser) => {
    setEditingUserId(u.id);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormSection(u.section);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this administrator?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (editingUserId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? { ...u, name: formName, email: formEmail, role: formRole, section: formSection }
            : u
        )
      );
    } else {
      const newUser: AdminUser = {
        id: `user-${Date.now()}`,
        name: formName,
        email: formEmail,
        role: formRole,
        section: formSection,
        status: 'Invited',
        lastActive: 'Invited today',
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header action bar */}
      <div className="bg-white p-4 rounded-xl border border-[#EAE6DF] shadow-[0_2px_8px_rgba(15,27,62,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7C88A8]">
            <IconSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search admins by name, email, or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-[#FAF9F6]/50"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <IconPlus className="w-3.5 h-3.5" />
          <span>+ Add Administrator</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#EAE6DF] shadow-[0_2px_8px_rgba(15,27,62,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2A354F]">
            <thead className="bg-[#FAF7F2] text-[#6B7897] font-semibold text-[11px] uppercase tracking-wider border-b border-[#EAE6DF]">
              <tr>
                <th className="py-3.5 px-6">USER</th>
                <th className="py-3.5 px-6">ROLE</th>
                <th className="py-3.5 px-6">ASSIGNED SECTION</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6">LAST ACTIVE</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#111C38] text-[#C8952F] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {u.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F1B3E]">{u.name}</div>
                        <div className="text-[11px] text-[#7C88A8]">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        u.role === 'Super Admin'
                          ? 'bg-[#FAF4E6] text-[#A27B2C] border border-[#E9D9B2]'
                          : 'bg-[#F1F4F9] text-[#4A5568]'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-medium text-[#2A354F]">
                    {u.section}
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        u.status === 'Active'
                          ? 'bg-[#E6F4EA] text-[#137333]'
                          : 'bg-[#EEF0FA] text-[#3B5998]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'Active' ? 'bg-[#137333]' : 'bg-[#3B5998]'
                        }`}
                      ></span>
                      {u.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-[#7C88A8]">
                    {u.lastActive}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
                      title="Edit"
                    >
                      <IconEdit className="w-3.5 h-3.5" />
                    </button>
                    {u.role !== 'Super Admin' && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors"
                        title="Delete"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EAE6DF] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl font-bold text-[#0F1B3E] mb-1">
              {editingUserId ? 'Edit Administrator' : 'Add New Administrator'}
            </h3>
            <p className="text-xs text-[#6B7897] mb-5">
              Assign role privileges and section access permissions.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Deacon Ermias"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="admin@abunemedia.org"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) =>
                    setFormRole(e.target.value as 'Super Admin' | 'Section Admin' | 'Editor' | 'Auditor')
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Section Admin">Section Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Assigned Section
                </label>
                <select
                  value={formSection}
                  onChange={(e) => setFormSection(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                >
                  <option value="All Modules">All Modules (Full Access)</option>
                  <option value="Announcements">Announcements</option>
                  <option value="Events">Events</option>
                  <option value="Reports">Reports</option>
                  <option value="Mezmur">Mezmur</option>
                  <option value="Teachings">Teachings</option>
                  <option value="Gallery">Gallery</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#D5D0C7] text-xs font-semibold text-[#5A6479] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold transition-colors"
                >
                  Save Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
