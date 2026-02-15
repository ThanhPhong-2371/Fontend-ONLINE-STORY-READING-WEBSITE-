import React, { useState, useEffect } from 'react';
import './Home.css';
import { Play, Star, Clock, TrendingUp } from 'lucide-react';

const Home = () => {
    // Mock data for demo
    const trendingStories = [
        { id: 1, title: 'Võ Luyện Đỉnh Phong', author: 'Mạc Mặc', rating: 4.8, views: '2.5M', image: 'https://images.unsplash.com/photo-1543004218-ee1411045231?w=400&h=600&fit=crop' },
        { id: 2, title: 'Đấu Phá Thương Khung', author: 'Thiên Tằm Thổ Đậu', rating: 4.9, views: '3.1M', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop' },
        { id: 3, title: 'Thần Đạo Đan Tôn', author: 'Cô Đơn Địa Phi', rating: 4.7, views: '1.8M', image: 'https://images.unsplash.com/photo-1621351123081-420792372573?w=400&h=600&fit=crop' },
        { id: 4, title: 'Thế Giới Hoàn Mỹ', author: 'Thần Đông', rating: 4.9, views: '2.9M', image: 'https://images.unsplash.com/photo-1532012197367-e3d1390319ca?w=400&h=600&fit=crop' },
    ];

    return (
        <main className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-text fade-in">
                        <span className="badge">Khám phá thế giới mới</span>
                        <h1>Đọc Truyện Online <br /><span className="highlight">Miễn Phí</span> Mỗi Ngày</h1>
                        <p>Hàng ngàn bộ truyện tiên hiệp, ngôn tình, kiếm hiệp sắc hiệp cực hay đang chờ đón bạn.</p>
                        <div className="hero-actions">
                            <button className="btn-primary">Bắt đầu đọc</button>
                            <button className="btn-secondary">Gói Premium</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="container section">
                <div className="section-header">
                    <div className="title-area">
                        <TrendingUp className="section-icon" />
                        <h2>Truyện Đang Hot</h2>
                    </div>
                    <button className="view-all">Xem tất cả</button>
                </div>

                <div className="story-grid">
                    {trendingStories.map(story => (
                        <div key={story.id} className="story-card fade-in">
                            <div className="card-image">
                                <img src={story.image} alt={story.title} />
                                <div className="card-overlay">
                                    <button className="play-btn"><Play fill="white" /></button>
                                </div>
                            </div>
                            <div className="card-info">
                                <h3>{story.title}</h3>
                                <p className="author">{story.author}</p>
                                <div className="stats">
                                    <span className="rating"><Star size={14} fill="#f59e0b" stroke="none" /> {story.rating}</span>
                                    <span className="views"><Clock size={14} /> {story.views} lượt đọc</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;
