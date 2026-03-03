import React, { useState, useEffect } from 'react';
import { otruyenService, storyService } from '../services/api';
import { Search, Download, Check, AlertCircle, BookOpen, User as UserIcon, Activity, ExternalLink, Loader2 } from 'lucide-react';
import './AdminDashboard.css'; // Reuse container/sidebar styles
import './StaffDashboard.css';
import { Link, useLocation } from 'react-router-dom';

const StaffDashboard = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importingStates, setImportingStates] = useState({}); // Tracking which item is being imported
    const [notification, setNotification] = useState(null);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            setLoading(true);
            const response = await otruyenService.search(searchTerm);
            // otruyen API search response structure based on common pattern
            const items = response.data?.data?.items || [];
            setResults(items);
        } catch (error) {
            showNotification('error', 'Lỗi khi tìm kiếm từ otruyen.cc');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (story) => {
        const storyKey = story.slug;
        try {
            setImportingStates(prev => ({ ...prev, [storyKey]: 'loading' }));

            // 1. Get full detail from otruyen to have description etc.
            const detailRes = await otruyenService.getDetail(storyKey);
            const fullStory = detailRes.data?.data?.item;

            if (!fullStory) {
                throw new Error("Không lấy được chi tiết truyện từ nguồn");
            }

            // 2. Map to our database model
            const storyToImport = {
                title: fullStory.name,
                slug: fullStory.slug,
                author: Array.isArray(fullStory.author) ? fullStory.author.join(', ') : (fullStory.author || 'Đang cập nhật'),
                description: fullStory.content ? fullStory.content.replace(/<[^>]*>?/gm, '') : '',
                coverImage: `https://img.otruyenapi.com/uploads/comics/${fullStory.thumb_url}`,
                status: fullStory.status === 'ongoing' ? 'ONGOING' : 'COMPLETED',
                isPremium: false,
                genres: fullStory.category ? fullStory.category.map(c => c.name) : []
            };

            // 3. Send to backend through specialized import endpoint
            await otruyenService.importStory(storyToImport);

            setImportingStates(prev => ({ ...prev, [storyKey]: 'success' }));
            showNotification('success', `Đã lưu truyện "${fullStory.name}" thành công!`);
        } catch (error) {
            console.error('Import error:', error);
            setImportingStates(prev => ({ ...prev, [storyKey]: 'error' }));
            const errorMsg = error.response?.data?.message || error.message || 'Lỗi khi lưu truyện';
            showNotification('error', errorMsg);
        }
    };

    return (
        <div className="admin-container light-theme staff-theme">
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
                    <Link to="/staff" className={location.pathname === '/staff' ? 'active' : ''}><Activity size={20} /> Quản lý nội bộ</Link>
                    <Link to="/staff/import" className={location.pathname === '/staff/import' ? 'active' : ''}><Download size={20} /> Import Truyện</Link>
                </nav>
                <div className="sidebar-hint">
                    <p>Nhân viên có thể tìm kiếm truyện từ nguồn ngoài và thêm vào hệ thống.</p>
                </div>
            </aside>

            <main className="admin-main light-main">
                <header className="admin-header light-header">
                    <form className="search-box light-search fetch-search" onSubmit={handleSearch}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Nhập tên truyện muốn tìm từ otruyen.cc..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="btn-fetch" disabled={loading}>
                            {loading ? <Loader2 className="spin" size={18} /> : 'Tìm từ nguồn'}
                        </button>
                    </form>
                </header>

                <div className="admin-content light-card">
                    <div className="table-responsive">
                        <table className="admin-table light-table">
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên truyện (Nguồn)</th>
                                    <th>Trạng thái nguồn</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && results.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center">Đang kết nối với otruyen.cc...</td></tr>
                                ) : results.length > 0 ? (
                                    results.map(story => (
                                        <tr key={story.slug}>
                                            <td>
                                                <img
                                                    src={`https://img.otruyenapi.com/uploads/comics/${story.thumb_url}`}
                                                    alt=""
                                                    className="table-thumb"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/45x65'}
                                                />
                                            </td>
                                            <td>
                                                <div className="story-info-cell">
                                                    <strong>{story.name}</strong>
                                                    <span className="source-slug">{story.slug}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${story.status === 'ongoing' ? 'ongoing' : 'completed'}`}>
                                                    {story.status === 'ongoing' ? 'Đang ra' : 'Hoàn thành'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className={`btn-import ${importingStates[story.slug] === 'success' ? 'success' : ''}`}
                                                        onClick={() => handleImport(story)}
                                                        disabled={importingStates[story.slug] === 'loading' || importingStates[story.slug] === 'success'}
                                                    >
                                                        {importingStates[story.slug] === 'loading' ? <Loader2 className="spin" size={16} /> :
                                                            importingStates[story.slug] === 'success' ? <Check size={16} /> :
                                                                <Download size={16} />}
                                                        {importingStates[story.slug] === 'success' ? ' Đã lưu' : ' Lưu về DB'}
                                                    </button>
                                                    <a
                                                        href={`https://otruyen.cc/truyen-tranh/${story.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-view-source"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center">Nhập từ khóa và nhấn tìm kiếm để bắt đầu</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;
