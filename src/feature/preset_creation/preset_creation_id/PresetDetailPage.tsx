"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Preset } from '@/types/preset';
import { fetchPreset, updatePreset, deletePreset } from '@/lib/api';
import TimeSelect from '../TimeSelect';
import ColorRadioGroup from '../ColorRadioGroup';

interface PresetDetailPageProps {
    presetId: string;
}

const PresetDetailPage: React.FC<PresetDetailPageProps> = ({ presetId }) => {
    const [preset, setPreset] = useState<Preset | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadPreset = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedPreset = await fetchPreset(presetId);
                setPreset(fetchedPreset);
            } catch (error) {
                console.error('Failed to load preset:', error);
                setError('プリセットの読み込みに失敗しました。もう一度お試しください。');
            } finally {
                setIsLoading(false);
            }
        };
        loadPreset();
    }, [presetId]);

    const handleSave = async () => {
        if (preset) {
            try {
                await updatePreset(preset);
                router.push('/preset_creation');
            } catch (error) {
                console.error('Failed to update preset:', error);
                setError('プリセットの更新に失敗しました。もう一度お試しください。');
            }
        }
    };

    const handleDelete = async () => {
        if (preset) {
            try {
                await deletePreset(preset.id);
                router.push('/preset_creation');
            } catch (error) {
                console.error('Failed to delete preset:', error);
                setError('プリセットの削除に失敗しました。もう一度お試しください。');
            }
        }
    };

    const handleCancel = () => {
        router.push('/preset_creation');
    };

    if (isLoading) {
        return <div className="p-4">読み込み中...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!preset) {
        return <div className="p-4">プリセットが見つかりません。</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
            <div className="flex-grow overflow-y-auto p-4">
                <h1 className="text-2xl font-bold mb-4">プリセット詳細</h1>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">シフト名</Label>
                        <Input
                            id="title"
                            value={preset.title}
                            onChange={(e) => setPreset({ ...preset, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>表示色</Label>
                        <ColorRadioGroup
                            selectedColor={preset.color}
                            onChange={(color) => setPreset({ ...preset, color })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="startTime">開始時間</Label>
                        <TimeSelect
                            value={preset.startTime}
                            onChange={(startTime) => setPreset({ ...preset, startTime })}
                            isStartTime={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="endTime">終了時間</Label>
                        <TimeSelect
                            value={preset.endTime}
                            onChange={(endTime) => setPreset({ ...preset, endTime })}
                            isStartTime={false}
                        />
                    </div>
                </div>
            </div>
            <div className="p-3 bg-white ">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <Button onClick={handleSave} className="w-full">保存</Button>
                    <Button onClick={handleDelete} variant="destructive" className="w-full">削除</Button>
                </div>
                <Button onClick={handleCancel} variant="outline" className="w-full">キャンセル</Button>
            </div>
        </div>
    );
};

export default PresetDetailPage;