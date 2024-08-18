import PresetDetailPage from '@/feature/preset_creation/preset_creation_id/PresetDetailPage';
import React from 'react';

interface PresetDetailProps {
    params: { id: string };
}

const PresetDetail: React.FC<PresetDetailProps> = ({ params }) => {
    return <PresetDetailPage presetId={params.id} />;
};

export default PresetDetail;