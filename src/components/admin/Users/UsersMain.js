import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for search
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const itemsPerPage = 10; // Number of users to show per page

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, users]);

  const fetchUsers = () => {
    const token = localStorage.getItem('jwtToken');
    axios
      .get('http://localhost:8080/admin/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const filtered = response.data.filter(user => user.role?.id === 2); // Filter users by role
        setUsers(filtered);
        setFilteredUsers(filtered);
      })
      .catch(() => setErrorMessage('Có lỗi xảy ra khi tải danh sách người dùng!'));
  };

  const handleStatusChange = (userId, currentStatus) => {
    const token = localStorage.getItem('jwtToken');
    
    axios
      .put(
        `http://localhost:8080/admin/api/users/status/${userId}`,
        { status_user: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(response => {
        const updatedUser = response.data;
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status_user: updatedUser.status_user } : user
        ));
      })
      .catch(error => {
        console.error('Error updating status:', error);
        setErrorMessage('Có lỗi xảy ra khi cập nhật trạng thái!');
      });
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Quản Lý Khách Hàng</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {/* User Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Ảnh</th>
            <th className="py-2 px-4 border-b">Tên người dùng</th>
            <th className="py-2 px-4 border-b">Họ và tên</th>
            <th className="py-2 px-4 border-b">Trạng thái</th>
            <th className="py-2 px-4 border-b">Chỉnh sửa</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map(user => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b text-center">
                  <img
                    src={user.image_user || 'default-image-url.jpg'}
                    alt={user.username}
                    className="w-12 h-12 object-cover rounded-full mx-auto"
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">{user.username}</td>
                <td className="py-2 px-4 border-b text-center">{user.fullName}</td>
                <td className="py-2 px-4 border-b text-center">
                  {user.status_user ? 'Hoạt động' : 'Không hoạt động'}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleStatusChange(user.id, user.status_user)}
                    className={`px-4 py-2 rounded ${
                      user.status_user ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {user.status_user ? 'Vô hiệu hóa' : 'Kích hoạt'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">Không có người dùng nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Hiển thị {currentUsers.length} trong tổng số {filteredUsers.length} khách hàng
        </div>
        <div className="flex items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-l ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            &lt;
          </button>
          {[...Array(totalPages).keys()].map(num => (
            <button
              key={num + 1}
              onClick={() => handlePageChange(num + 1)}
              className={`px-3 py-1 ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {num + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-r ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            &gt;
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
