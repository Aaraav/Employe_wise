import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from './ui/aurora-background';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://reqres.in/api/users?page=${page}`);

      if (!response.ok) throw new Error('Failed to fetch users. Try again later.');

      const data = await response.json();
      setUsers(data.data);
      setTotalPages(data.total_pages);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://reqres.in/api/users/${editingUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUsers(users.map(user => (user.id === editingUser ? { ...user, ...formData } : user)));
        setEditingUser(null);
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, { method: 'DELETE' });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <AuroraBackground />
      </div>

      <div className="relative z-10 w-full max-w-5xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-wide text-white">Users Dashboard</h1>
          <button onClick={handleLogout} className="bg-indigo-500 text-white px-5 py-2 rounded-lg transition hover:bg-indigo-600">
            Logout
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-300">Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {users.map(user => (
              <div key={user.id} className="bg-white bg-opacity-10 backdrop-blur-lg p-6 shadow-lg rounded-xl flex flex-col items-center transition hover:scale-105">
                <img src={user.avatar} alt={user.first_name} className="rounded-full w-24 h-24 border-2 border-gray-200 shadow-lg" />
                <h2 className="text-xl font-semibold mt-3 text-grey">{user.first_name} {user.last_name}</h2>
                <p className="text-gray-300">{user.email}</p>
                <div className="mt-4 flex space-x-3">
                  <button 
                    onClick={() => handleEdit(user)} 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-5 py-2 rounded-lg transition shadow-md hover:shadow-lg hover:from-purple-500 hover:to-blue-400"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="bg-gradient-to-r from-pink-400 to-indigo-500 text-white px-5 py-2 rounded-lg transition shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-pink-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 space-x-6">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg font-semibold text-white">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg transition hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 flex z-100  justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                className="p-3  border rounded-lg w-full text-white"
                required
              />
              <input
                type="text"
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                className="p-3 border rounded-lg w-full text-white"
                required
              />
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="p-3 border rounded-lg w-full text-white"
                required
              />
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2 bg-gray-500 text-white rounded-lg transition hover:bg-gray-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded-lg transition hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
