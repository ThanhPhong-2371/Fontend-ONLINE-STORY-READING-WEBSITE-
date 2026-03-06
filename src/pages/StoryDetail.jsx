import React from 'react';
import { useParams } from 'react-router-dom';
import { stories } from '@/lib/data';
import { StoryDetailContent } from '@/components/story-detail-content';

const StoryDetail = () => {
    const { id } = useParams();
    const story = stories.find((s) => s.id === id);

    if (!story) {
        return <div className="container py-20">Truyện không tồn tại.</div>;
    }

    return (
        <div className="flex flex-col">
            <StoryDetailContent story={story} />
        </div>
    );
};

export default StoryDetail;
