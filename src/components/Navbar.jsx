import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, User, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar glass">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <BookOpen size={32} className="logo-icon" />
                    <span>Nhom8 Story</span>
                </Link>

                <div className="nav-search">
                    <Search size={20} className="search-icon" />
                    <input type="text" placeholder="Tìm kiếm truyện..." />
                </div>

                <div className="nav-links">
                    <Link to="/genres">Thể loại</Link>
                    <Link to="/premium" className="premium-link">Premium</Link>
                    <Link to="/login" className="login-btn">
                        <User size={20} />
                        <span>Đăng nhập</span>
                    </Link>
                    <button className="mobile-menu">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
