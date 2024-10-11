import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const AdminHeader = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);

 
      axios.get(`http://localhost:8080/admin/api/users/${decoded.id_user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setUserImage(response.data.image_user); //  image
        })
        .catch(error => {
          console.error('Error fetching user image:', error);
        });
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    props.history.push('/login');
  };

  return (
<header className="bg-gradient-to-r to-[#abcfdb] from-[#FFFF] p-2 shadow flex justify-between items-center">




      <div className="flex items-center">

      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600">
          <FaBell />
        </button>
        <div className="relative">
          <button
            className="w-10 h-10 rounded-full overflow-hidden"
            onClick={toggleDropdown}
          >
            <img
              src={userImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 text-sm">
              {/* <span className="block px-4 py-2 text-gray-800">
                {user ? user.username : 'Guest'}
              </span> */}
              <button
                className="block w-full text-left px-3 py-1.5 text-gray-800 hover:bg-gray-100"
                onClick={() => props.history.push('/admin/profile')}
              >
                Thông tin
              </button>
              <button
                className="block w-full text-left px-3 py-1.5 text-gray-800 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default withRouter(AdminHeader);
