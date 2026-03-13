import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Plus, Edit2, Trash2, Search, X, Check, AlertCircle, Image as ImageIcon, BookOpen, User as UserIcon, Activity, Lock, Unlock, Download, MessageSquare } from 'lucide-react';
import './AdminUserManagement.css';
import { Link, useLocation } from 'react-router-dom';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        roleIds: []
    });
    const [notification, setNotification] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll(searchTerm);
            setUsers(response.data);
        } catch (error) {
            showNotification('error', 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await userService.getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy roles", error);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenRoleModal = (user) => {
        setCurrentUser(user);
        setFormData({
            ...user,
            roleIds: user.roles ? user.roles.map(r => r.id) : []
        });
        setIsRoleModalOpen(true);
    };

    const handleOpenInfoModal = (user) => {
        setCurrentUser(user);
        setFormData({
            ...user,
            roleIds: user.roles ? user.roles.map(r => r.id) : []
        });
        setIsInfoModalOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (roleId) => {
        setFormData(prev => {
            const currentRoles = prev.roleIds;
            if (currentRoles.includes(roleId)) {
                return { ...prev, roleIds: currentRoles.filter(id => id !== roleId) };
            } else {
                return { ...prev, roleIds: [...currentRoles, roleId] };
            }
        });
    };

    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.updateRole(currentUser.id, formData.roleIds);
            showNotification('success', 'Cập nhật phân quyền thành công');
            setIsRoleModalOpen(false);
            fetchUsers();
        } catch (error) {
            showNotification('error', 'Có lỗi xảy ra');
        }
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.update(currentUser.id, formData);
            showNotification('success', 'Cập nhật thông tin thành công');
            setIsInfoModalOpen(false);
            fetchUsers();
        } catch (error) {
            showNotification('error', 'Có lỗi xảy ra');
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await userService.toggleStatus(userId);
            showNotification('success', 'Đã thay đổi trạng thái tài khoản');
            fetchUsers();
        } catch (error) {
            showNotification('error', 'Thất bại khi đổi trạng thái');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            try {
                await userService.delete(id);
                showNotification('success', 'Xóa người dùng thành công');
                fetchUsers();
            } catch (error) {
                showNotification('error', 'Không thể xóa người dùng. Vui lòng kiểm tra lại!');
            }
        }
    };

    const getAvatarUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/40';
        if (url.startsWith('http')) return url;
        return `http://localhost:8080${url}`;
    };

    return (
        <div className="admin-container light-theme">
            {notification && (
                <div className={`notification ${notification.type} slide-in`}>
                    {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    <span>{notification.message}</span>
                </div>
            )}

            <aside className="admin-sidebar light-sidebar">
                <div className="admin-logo">
                    <UserIcon color="var(--primary)" size={32} />
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}><UserIcon size={20} /> Người dùng</Link>
                    <Link to="/admin/support" className={location.pathname === '/admin/support' ? 'active' : ''}><MessageSquare size={20} /> Hỗ trợ CSKH</Link>
                </nav>
            </aside>

            <main className="admin-main light-main">
                <header className="admin-header light-header">
                    <div className="search-box light-search">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="admin-content light-card">
                    <div className="table-responsive">
                        <table className="admin-table light-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên đăng nhập</th>
                                    <th>Email</th>
                                    <th>Họ và Tên</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="8" className="text-center">Đang tải dữ liệu...</td></tr>
                                ) : users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id} className={!user.enabled ? 'user-locked' : ''}>
                                            <td>#{user.id}</td>
                                            <td>
                                                <img src={getAvatarUrl(user.avatar)} alt="" className="table-avatar" />
                                            </td>
                                            <td><strong>{user.username}</strong></td>
                                            <td>{user.email}</td>
                                            <td>{user.fullName}</td>
                                            <td>
                                                <div className="role-badges">
                                                    {user.roles && user.roles.map(role => (
                                                        <span key={role.id} className={`role-badge ${role.name.toLowerCase()}`}>
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.enabled ? 'active' : 'locked'}`}>
                                                    {user.enabled ? 'Đang hoạt động' : 'Đã khóa'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions">
                                                    <button className="btn-edit light-btn" onClick={() => handleOpenInfoModal(user)} title="Sửa thông tin"><UserIcon size={16} /></button>
                                                    <button className="btn-edit light-btn" onClick={() => handleOpenRoleModal(user)} title="Phân quyền"><Edit2 size={16} /></button>
                                                    <button
                                                        className={`btn-lock light-btn ${user.enabled ? '' : 'is-locked'}`}
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        title={user.enabled ? "Khóa tài khoản" : "Mở khóa"}
                                                    >
                                                        {user.enabled ? <Unlock size={16} /> : <Lock size={16} />}
                                                    </button>
                                                    <button className="btn-delete light-btn" onClick={() => handleDelete(user.id)} title="Xóa"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8" className="text-center">Không tìm thấy người dùng nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isRoleModalOpen && (
                <div className="modal-overlay fade-in">
                    <div className="modal-content light-card slide-up">
                        <div className="modal-header">
                            <h3>Phân quyền người dùng: {currentUser?.username}</h3>
                            <button className="modal-close" onClick={() => setIsRoleModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleRoleSubmit}>
                            <div className="form-group role-selection">
                                <label>Chọn vai trò:</label>
                                <div className="role-options">
                                    {roles.map(role => (
                                        <label key={role.id} className="checkbox-container light-checkbox">
                                            {role.name}
                                            <input
                                                type="checkbox"
                                                checked={formData.roleIds.includes(role.id)}
                                                onChange={() => handleRoleChange(role.id)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel light-cancel" onClick={() => setIsRoleModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-submit">Cập nhật quyền 🚀</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isInfoModalOpen && (
                <div className="modal-overlay fade-in">
                    <div className="modal-content light-card slide-up">
                        <div className="modal-header">
                            <h3>Sửa thông tin: {currentUser?.username}</h3>
                            <button className="modal-close" onClick={() => setIsInfoModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleInfoSubmit}>
                            <div className="form-group light-input-box">
                                <label>Họ và Tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group light-input-box">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel light-cancel" onClick={() => setIsInfoModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-submit">Lưu thay đổi ✨</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;
