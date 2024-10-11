import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar'; 
import Header from '../Header/Header'; 
import Footer from '../Footer/Footer'; 
import '../../assets/modal.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen text-gray-700">
      {/* Sidebar */}
      <div className={`fixed h-screen bg-white shadow-md transition-transform duration-300 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64 md:translate-x-0`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 bg-gradient-to-r from-[#E3F2FD] to-[#dad1d1]">

        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content  */}
        <main className="p-6 flex-grow overflow-auto">
          {children}
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
