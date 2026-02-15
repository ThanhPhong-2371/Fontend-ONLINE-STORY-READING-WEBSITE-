import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes as you build them */}
          <Route path="/genres" element={<div className="container" style={{ paddingTop: '100px' }}><h2>Trang Thể Loại đang phát triển...</h2></div>} />
          <Route path="/premium" element={<div className="container" style={{ paddingTop: '100px' }}><h2>Trang Premium đang phát triển...</h2></div>} />
          <Route path="/login" element={<div className="container" style={{ paddingTop: '100px' }}><h2>Trang Đăng Nhập đang phát triển...</h2></div>} />
        </Routes>

        {/* Floating Chatbot Button Placeholder */}
        <div className="chatbot-trigger glass">
          <span>💬</span>
        </div>
      </div>
    </Router>
  );
}

export default App;
