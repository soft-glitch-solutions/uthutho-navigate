import React from 'react';

interface User {
  id: string;
  email: string;
  role: string;
}

interface UsersPageProps {
  users: User[];
  onRoleChange: (userId: string, role: string) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, onRoleChange }) => {
  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-foreground">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border">
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className="bg-background text-foreground p-2 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
