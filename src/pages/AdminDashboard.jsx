import React, { useState, useEffect } from 'react';
import { storyService } from '../services/api';
import { Plus, Edit2, Trash2, Search, X, Check, AlertCircle, BookOpen, Clock, Star, Eye, User as UserIcon, Settings, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StaffLayout } from '@/components/staff-layout';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
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
            setStories(response.data.content || response.data || []);
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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-blue-50 text-blue-600 border-blue-100 ring-4 ring-blue-500/5';
            case 'ONGOING': return 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-4 ring-emerald-500/5';
            case 'DROPPED': return 'bg-rose-50 text-rose-600 border-rose-100 ring-4 ring-rose-500/5';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <StaffLayout>
            {notification && (
                <div className={`fixed top-24 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-full backdrop-blur-md border border-white/20 ${notification.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                    }`}>
                    <div className="bg-white/20 p-1.5 rounded-full">
                        {notification.type === 'success' ? <Check size={18} strokeWidth={3} /> : <AlertCircle size={18} strokeWidth={3} />}
                    </div>
                    <span className="font-bold tracking-tight">{notification.message}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                        <BookOpen size={14} />
                        Kho lưu trữ nội dung
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Thư viện truyện</h1>
                    <p className="text-slate-500 font-medium">Dashboard điều khiển toàn bộ mục lục truyện trên hệ thống.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 bg-white text-slate-600 font-bold h-12 px-6 hover:bg-slate-50">
                        <Filter className="w-4 h-4 mr-2" /> Bộ lọc
                    </Button>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 font-bold"
                    >
                        <Plus className="h-5 w-5" />
                        Đăng truyện mới
                    </Button>
                </div>
            </div>

            <div className="mb-10 group relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                <Input
                    placeholder="Tìm theo tên truyện, tác giả hoặc ID..."
                    className="pl-12 h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all text-lg font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-5">
                {loading ? (
                    <div className="col-span-full py-40 text-center flex flex-col items-center gap-4 text-slate-400 opacity-50">
                        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <p className="font-black uppercase tracking-widest text-xs">Đang tải kho lưu trữ...</p>
                    </div>
                ) : filteredStories.length > 0 ? (
                    filteredStories.map(story => (
                        <div key={story.id} className="group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Settings size={80} className="rotate-45" />
                            </div>

                            <div className="relative shrink-0 w-32 h-44 md:w-24 md:h-32 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-md group-hover:shadow-indigo-200/50 transition-all">
                                <img
                                    src={story.coverImage || 'https://via.placeholder.com/300x450'}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                    alt={story.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                    <Badge className="bg-white/20 backdrop-blur-md border-none text-[10px] h-5">Preview</Badge>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <h3 className="font-black text-2xl text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors truncate max-w-md">{story.title}</h3>
                                    <Badge variant="outline" className={`text-[10px] py-0.5 px-3 rounded-full font-black uppercase tracking-wider border ${getStatusStyles(story.status)}`}>
                                        {story.status}
                                    </Badge>
                                    {story.isPremium && (
                                        <Badge className="bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-100 text-[10px] p-0 px-2 rounded-full flex items-center gap-1 font-bold">
                                            <Star size={10} fill="currentColor" /> PREMIUM
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 mb-4">
                                    <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                                        <div className="bg-slate-100 p-1.5 rounded-lg"><UserIcon size={14} className="text-indigo-500" /></div>
                                        {story.author}
                                    </p>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100/50"><Eye size={14} className="text-indigo-400" /> {story.viewCount || 0} lượt xem</span>
                                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100/50"><Calendar size={14} className="text-rose-400" /> {story.updatedAt ? new Date(story.updatedAt).toLocaleDateString() : 'Chưa cập nhật'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <code className="text-[10px] bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full font-bold border border-indigo-100">SLUG: {story.slug}</code>
                                    <code className="text-[10px] bg-slate-50 text-slate-400 px-3 py-1 rounded-full border border-slate-100">ID: #{story.id}</code>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 shrink-0 relative z-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenModal(story)}
                                    className="h-12 w-12 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(story.id)}
                                    className="h-12 w-12 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-100/40 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-50">
                            <BookOpen size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">Không tìm thấy nội dung phù hợp</h3>
                        <p className="text-slate-400 mt-2">Hãy thử đổi bộ lọc hoặc thêm truyện mới vào thư viện!</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in transition-all">
                    <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-8 md:p-10 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />

                        <div className="flex justify-between items-center mb-8">
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{currentStory ? 'Cập Nhật Truyện' : 'Hồ Sơ Truyện Mới'}</h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{currentStory ? `Dữ liệu ID: #${currentStory.id}` : 'Đang khởi tạo mục mới'}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-2xl h-12 w-12 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên tác phẩm</label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-indigo-500 transition-all font-bold text-slate-800"
                                        placeholder="Nhập tên chính thức..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Đường dẫn (Slug)</label>
                                    <Input
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                        className="h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-indigo-500 transition-all font-mono text-indigo-500"
                                        placeholder="ten-truyen-slug"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Tác giả</label>
                                    <Input
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        className="h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-indigo-500 transition-all"
                                        placeholder="Danh tính tác giả..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Tình trạng</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full h-14 px-6 bg-slate-50 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="ONGOING">Đang tiến hành / Ra mắt</option>
                                        <option value="COMPLETED">Trọn bộ / Hoàn thiện</option>
                                        <option value="DROPPED">Tạm dừng phát triển</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Hệ thống ảnh bìa (Cover URL)</label>
                                <Input
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleInputChange}
                                    className="h-14 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-indigo-500 transition-all"
                                    placeholder="https://truyenhay.example/image.jpg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Tóm tắt nội dung</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full min-h-[120px] px-6 py-4 bg-slate-50 border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Viết một đoạn giới thiệu hấp dẫn về cốt truyện..."
                                />
                            </div>

                            <div
                                className={`flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all cursor-pointer select-none ${formData.isPremium
                                        ? 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-500/5'
                                        : 'bg-slate-50 border-transparent hover:bg-slate-100'
                                    }`}
                                onClick={() => setFormData(p => ({ ...p, isPremium: !p.isPremium }))}
                            >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${formData.isPremium
                                        ? 'bg-amber-500 text-white scale-110'
                                        : 'bg-slate-200 text-slate-400'
                                    }`}>
                                    <Star size={18} fill={formData.isPremium ? "currentColor" : "none"} />
                                </div>
                                <div>
                                    <span className={`text-base font-black tracking-tight block ${formData.isPremium ? 'text-amber-700' : 'text-slate-600'}`}>
                                        Chế độ Premium (VIP Member)
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Chỉ dành cho tài khoản trả phí truy cập</span>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end pt-6 border-t border-slate-100 mt-6">
                                <Button type="button" variant="ghost" className="h-12 px-8 rounded-2xl font-bold text-slate-400" onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>
                                <Button type="submit" className="h-12 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1">Lưu dữ liệu 🚀</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
};

export default AdminDashboard;
