import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import Login from './pages/Login';
import StaffDashboard from './pages/StaffDashboard';
import ChatBox from './components/ChatBox';
import SupportChat from './components/SupportChat';
import AdminSupportPanel from './pages/AdminSupportPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminUserManagement />} />
          <Route path="/staff" element={<AdminDashboard />} />
          <Route path="/staff/import" element={<StaffDashboard />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes as you build them */}
          <Route path="/genres" element={<div className="container" style={{ paddingTop: '100px' }}><h2>Trang Thể Loại đang phát triển...</h2></div>} />
          <Route path="/premium" element={<div className="container" style={{ paddingTop: '100px' }}><h2>Trang Premium đang phát triển...</h2></div>} />
          <Route path="/support" element={<SupportChat />} />
          <Route path="/admin/support" element={<AdminSupportPanel />} />
        </Routes>

        {/* Floating Chatbot */}
        <ChatBox />
      </div>
    </Router>
  );
}

export default App;
