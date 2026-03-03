import React, { useState, useEffect } from 'react';
import { storyService } from '../services/api';
import { Plus, Edit2, Trash2, Search, X, Check, AlertCircle, Image as ImageIcon, BookOpen, User as UserIcon, Activity, Download } from 'lucide-react';
import './AdminDashboard.css';

import { Link, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
    const location = useLocation();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        author: '',
        description: '',
        coverImage: '',
        status: 'ONGOING',
        isPremium: false
    });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const response = await storyService.getAll(0, 100);
            setStories(response.data.content || response.data);
        } catch (error) {
            showNotification('error', 'Không thể tải danh sách truyện');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenModal = (story = null) => {
        if (story) {
            setCurrentStory(story);
            setFormData({
                title: story.title,
                slug: story.slug || '',
                author: story.author,
                description: story.description || '',
                coverImage: story.coverImage || '',
                status: story.status || 'ONGOING',
                isPremium: story.isPremium || false
            });
        } else {
            setCurrentStory(null);
            setFormData({
                title: '',
                slug: '',
                author: '',
                description: '',
                coverImage: '',
                status: 'ONGOING',
                isPremium: false
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentStory) {
                await storyService.update(currentStory.id, formData);
                showNotification('success', 'Cập nhật truyện thành công');
            } else {
                await storyService.create(formData);
                showNotification('success', 'Thêm truyện mới thành công');
            }
            setIsModalOpen(false);
            fetchStories();
        } catch (error) {
            showNotification('error', 'Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa truyện này không?')) {
            try {
                await storyService.delete(id);
                showNotification('success', 'Xóa truyện thành công');
                fetchStories();
            } catch (error) {
                showNotification('error', 'Không thể xóa truyện');
            }
        }
    };

    const filteredStories = stories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <BookOpen color="var(--primary)" size={32} />
                    <h2>Staff Panel</h2>
                </div>
                <nav className="admin-nav">
                    <Link to="/staff" className={location.pathname === '/staff' ? 'active' : ''}><Activity size={20} /> Quản lý truyện</Link>
                    <Link to="/staff/import" className={location.pathname === '/staff/import' ? 'active' : ''}><Download size={20} /> Import Truyện</Link>
                </nav>
            </aside>

            <main className="admin-main light-main">
                <header className="admin-header light-header">
                    <div className="search-box light-search">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm truyện hoặc tác giả..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-add light-btn-add" onClick={() => handleOpenModal()}>
                        <Plus size={20} /> Thêm truyện mới
                    </button>
                </header>

                <div className="admin-content light-card">
                    <div className="table-responsive">
                        <table className="admin-table light-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Hình ảnh</th>
                                    <th>Tiêu đề</th>
                                    <th>Tác giả</th>
                                    <th>Trạng thái</th>
                                    <th>Loại</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center">Đang tải dữ liệu...</td></tr>
                                ) : filteredStories.length > 0 ? (
                                    filteredStories.map(story => (
                                        <tr key={story.id}>
                                            <td>#{story.id}</td>
                                            <td>
                                                <img src={story.coverImage || 'https://via.placeholder.com/40x60'} alt="" className="table-thumb" />
                                            </td>
                                            <td><strong>{story.title}</strong></td>
                                            <td>{story.author}</td>
                                            <td>
                                                <span className={`status-badge ${story.status.toLowerCase()}`}>
                                                    {story.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`type-badge ${story.premium ? 'premium' : 'free'}`}>
                                                    {story.premium ? 'Premium' : 'Miễn phí'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions">
                                                    <button className="btn-edit light-btn" onClick={() => handleOpenModal(story)}><Edit2 size={16} /></button>
                                                    <button className="btn-delete light-btn" onClick={() => handleDelete(story.id)}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="text-center">Không tìm thấy truyện nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay fade-in">
                    <div className="modal-content light-card slide-up">
                        <div className="modal-header">
                            <h3>{currentStory ? 'Chỉnh sửa truyện' : 'Thêm truyện mới'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group light-input-box">
                                    <label>Tiêu đề</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Tên truyện..."
                                    />
                                </div>
                                <div className="form-group light-input-box">
                                    <label>Slug (Đường dẫn)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="ten-truyen-slug..."
                                    />
                                </div>
                                <div className="form-group light-input-box">
                                    <label>Tác giả</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Tên tác giả..."
                                    />
                                </div>
                                <div className="form-group full-width light-input-box">
                                    <label>URL Ảnh bìa</label>
                                    <input
                                        type="text"
                                        name="coverImage"
                                        value={formData.coverImage}
                                        onChange={handleInputChange}
                                        placeholder="https://otruyen.cc/uploads/..."
                                    />
                                </div>
                                <div className="form-group full-width light-input-box">
                                    <label>Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Tóm tắt truyện..."
                                    ></textarea>
                                </div>
                                <div className="form-group light-input-box">
                                    <label>Trạng thái</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="ONGOING">Đang tiến hành</option>
                                        <option value="COMPLETED">Hoàn thành</option>
                                        <option value="DROPPED">Tạm ngưng</option>
                                    </select>
                                </div>
                                <div className="form-group checkbox-group">
                                    <label className="checkbox-container light-checkbox">
                                        Truyện Premium
                                        <input
                                            type="checkbox"
                                            name="isPremium"
                                            checked={formData.isPremium}
                                            onChange={handleInputChange}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel light-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="btn-submit">Lưu lại 🚀</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
