interface UserTableProps {
    users: Array<{ id: string; email: string; role: string }>;
    updateUserRole: (userId: string, role: string) => void;
  }
  
  const UserTable = ({ users, updateUserRole }: UserTableProps) => {
    return (
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
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
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
    );
  };
  
  export default UserTable;
  