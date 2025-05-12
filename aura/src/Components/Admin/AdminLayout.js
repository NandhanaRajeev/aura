import React from 'react';
import AdminNavbar from './AdminNavbar'; 
import AdminSidebar from './AdminSidebar'; 
import AdminFooter from './AdminFooter';  
import './AdminLayout.css'; 
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-body">
        <AdminSidebar />
        <div className="admin-content">

          <Outlet />
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
