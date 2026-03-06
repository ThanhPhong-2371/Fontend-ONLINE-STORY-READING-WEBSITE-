import React, { useState, useEffect, useRef } from 'react';
import { userService, getServerUrl } from '../services/api';
import { User, Mail, Camera, Save, Key, Shield, Calendar, Loader2, Check, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userService.getProfile();
            setProfile(response.data);
            setFormData({
                fullName: response.data.fullName || '',
                email: response.data.email || '',
                newPassword: '',
                confirmPassword: ''
            });
            if (response.data.avatar) {
                setAvatarPreview(getServerUrl(response.data.avatar));
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            showNotification('error', 'Không thể tải thông tin hồ sơ.');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            showNotification('error', 'Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            setSaving(true);
            const dataToUpdate = {
                fullName: formData.fullName,
                email: formData.email,
                avatar: avatarFile,
                newPassword: formData.newPassword
            };

            const response = await userService.updateProfile(dataToUpdate);
            setProfile(response.data);

            // Update preview to use the server URL instead of blob URL
            if (response.data.avatar) {
                setAvatarPreview(getServerUrl(response.data.avatar));
            }

            showNotification('success', 'Cập nhật hồ sơ thành công!');

            // Re-sync local storage user info
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                fullName: response.data.fullName,
                avatar: response.data.avatar
            }));

            // Clear password fields
            setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        } catch (error) {
            showNotification('error', 'Lỗi khi cập nhật hồ sơ.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                <p className="font-bold uppercase tracking-widest text-xs">Đang đồng bộ hồ sơ...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-20 px-4">
            {notification && (
                <div className={`fixed top-24 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-full backdrop-blur-md border border-white/20 ${notification.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                    }`}>
                    {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    <span className="font-bold">{notification.message}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-xl shadow-indigo-500/5 border border-slate-100 overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-700">
                        <div className="absolute -bottom-16 left-12">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white overflow-hidden shadow-2xl bg-white">
                                    <img
                                        src={avatarPreview || "https://via.placeholder.com/150"}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://github.com/shadcn.png";
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Camera className="text-white h-8 w-8" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-12 pb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile?.fullName || profile?.username}</h1>
                                <p className="text-slate-400 font-bold flex items-center gap-2 mt-2">
                                    <Badge className="bg-indigo-50 text-indigo-600 border-none hover:bg-indigo-50">@{profile?.username}</Badge>
                                    <span className="text-xs uppercase tracking-widest">{profile?.roles?.join(' • ')}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1">Thành viên từ</p>
                                    <p className="text-sm font-bold text-slate-700">{new Date(profile?.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="w-px h-10 bg-slate-100" />
                                <div className="text-center">
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1">Loại tài khoản</p>
                                    {profile?.premiumExpiry && new Date(profile.premiumExpiry) > new Date() ? (
                                        <Badge className="bg-amber-100 text-amber-600 border-none hover:bg-amber-100 font-bold flex items-center gap-1">
                                            <Sparkles size={10} fill="currentColor" /> VIP Member
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-50 font-bold">Free User</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                        <User size={12} /> Họ và tên
                                    </label>
                                    <Input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold"
                                        placeholder="Tên của bạn..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                        <Mail size={12} /> Địa chỉ Email
                                    </label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                    <Shield size={20} className="text-indigo-500" />
                                    Đổi mật khẩu
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">(Bỏ trống nếu không đổi)</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                            <Key size={12} /> Mật khẩu mới
                                        </label>
                                        <Input
                                            name="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                            <Check size={12} /> Xác nhận mật khẩu
                                        </label>
                                        <Input
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-8">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="h-14 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1"
                                >
                                    {saving ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi hồ sơ ✨'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
