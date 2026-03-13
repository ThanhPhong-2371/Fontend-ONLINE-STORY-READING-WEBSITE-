import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';
import { User, Lock, Mail, Type, Image as ImageIcon } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        avatar: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        if (e.target.name === 'avatar') {
            setFormData({ ...formData, avatar: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const res = await authService.login({
                    username: formData.username,
                    password: formData.password
                });
                localStorage.setItem('token', res.data.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    id: res.data.id,
                    username: res.data.username,
                    avatar: res.data.avatar,
                    roles: res.data.roles
                }));
                window.location.href = '/';
            } else {
                await authService.register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    avatar: formData.avatar
                });
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box glass slide-up">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Đăng Nhập
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Đăng Ký
                    </button>
                </div>

                <div className="auth-header">
                    <h2>{isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}</h2>
                    <p>{isLogin ? 'Đăng nhập để vào thế giới truyện' : 'Đăng ký để trải nghiệm nhiều tính năng hơn'}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <Type size={20} className="input-icon" />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và Tên"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="input-group">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="input-group">
                                <ImageIcon size={20} className="input-icon" />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '3rem', paddingTop: '0.75rem' }}
                                />
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <User size={20} className="input-icon" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={20} className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/">Quay Lại Trang Chủ</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
