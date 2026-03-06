import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteHeader } from './components/site-header';
import { SiteFooter } from './components/site-footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import Login from './pages/Login';
import StaffDashboard from './pages/StaffDashboard';
import AdminGenreManagement from './pages/AdminGenreManagement';
import StoryDetail from './pages/StoryDetail';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUserManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff/import"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/genres"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <AdminGenreManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            {/* Add more routes as you build them */}
            <Route path="/genres" element={<div className="container mx-auto px-4 py-20"><h2>Trang Thể Loại đang phát triển...</h2></div>} />
            <Route path="/premium" element={<div className="container mx-auto px-4 py-20"><h2>Trang Premium đang phát triển...</h2></div>} />
          </Routes>
        </main>
        <SiteFooter />

        {/* Floating Chatbot Button Placeholder */}
        <div className="chatbot-trigger glass">
          <span>💬</span>
        </div>
      </div>
    </Router>
  );
}


export default App;
