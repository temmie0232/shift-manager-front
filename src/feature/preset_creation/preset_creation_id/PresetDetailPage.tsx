"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Preset } from '@/types/preset';
import { fetchPreset, updatePreset, deletePreset, fetchPresets } from '@/lib/api';
import ColorRadioGroup from '../ColorRadioGroup';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import TimeSelectionDrawer from '../TimeSelectionDrawer';

interface PresetDetailPageProps {
    presetId: string;
}

const PresetDetailPage: React.FC<PresetDetailPageProps> = ({ presetId }) => {
    const [preset, setPreset] = useState<Preset | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTimeDrawerOpen, setIsTimeDrawerOpen] = useState(false);
    const [timeType, setTimeType] = useState<'start' | 'end'>('start');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [timeError, setTimeError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

    const checkTimeOverlap = async (startTime: string, endTime: string) => {
        const presets = await fetchPresets();
        return presets.some(p =>
            p.id !== presetId && p.startTime === startTime && p.endTime === endTime
        );
    };

    const handleSave = async () => {
        if (preset) {
            if (preset.system) {
                setError('システムプリセットは編集できません。');
                return;
            }

            if (preset.title.trim() === '') {
                setTitleError('シフト名を入力してください');
                return;
            }

            if (!preset.startTime || !preset.endTime) {
                setTimeError('開始時間と終了時間を設定してください');
                return;
            }

            const overlap = await checkTimeOverlap(preset.startTime, preset.endTime);
            if (overlap) {
                setTimeError('すでにその時間帯は登録されています');
                return;
            }

            try {
                await updatePreset(preset);
                router.push('/preset_creation');
            } catch (error) {
                console.error('Failed to update preset:', error);
                setError('プリセットの更新に失敗しました。もう一度お試しください。');
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (preset) {
            if (preset.system) {
                setError('システムプリセットは削除できません。');
                return;
            }

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

    const handleTimeSelection = async (time: string) => {
        if (preset && !preset.system) {
            const updatedPreset = {
                ...preset,
                [timeType === 'start' ? 'startTime' : 'endTime']: time
            };
            setPreset(updatedPreset);

            if (updatedPreset.startTime && updatedPreset.endTime) {
                const overlap = await checkTimeOverlap(updatedPreset.startTime, updatedPreset.endTime);
                if (overlap) {
                    setTimeError('すでにその時間帯は登録されています');
                } else {
                    setTimeError(null);
                }
            }
        }
        setIsTimeDrawerOpen(false);
    };

    const openTimeDrawer = (type: 'start' | 'end') => {
        if (preset && !preset.system) {
            setTimeType(type);
            setIsTimeDrawerOpen(true);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (preset && !preset.system) {
            const newTitle = e.target.value;
            setPreset(prev => prev ? { ...prev, title: newTitle } : null);
            if (newTitle.trim() === '') {
                setTitleError('シフト名を入力してください');
            } else {
                setTitleError(null);
            }
        }
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
            <div className="flex-grow overflow-y-auto p-4 mt-4">
                <div className="space-y-8">
                    <div>
                        <Label htmlFor="title">シフト名</Label>
                        <Input
                            id="title"
                            value={preset.title}
                            onChange={handleTitleChange}
                            className={titleError ? 'border-red-500' : ''}
                            disabled={preset.system}
                        />
                        {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
                    </div>
                    <div>
                        <Label>表示色</Label>
                        <ColorRadioGroup
                            selectedColor={preset.color}
                            onChange={(color) => !preset.system && setPreset({ ...preset, color })}
                            disabled={preset.system}
                        />
                    </div>
                    <div>
                        <Label>勤務時間</Label>
                        <div className="space-y-2 mt-2">
                            <Button
                                onClick={() => openTimeDrawer('start')}
                                className="w-full justify-between"
                                variant="outline"
                                disabled={preset.system}
                            >
                                <span>開始時間</span>
                                <span>{preset.startTime || '未設定'}</span>
                            </Button>
                            <Button
                                onClick={() => openTimeDrawer('end')}
                                className="w-full justify-between"
                                variant="outline"
                                disabled={preset.system}
                            >
                                <span>終了時間</span>
                                <span>{preset.endTime || '未設定'}</span>
                            </Button>
                            {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-3 bg-white">
                {!preset.system && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <Button onClick={handleSave} className="w-full">保存</Button>
                        <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" className="w-full">削除</Button>
                    </div>
                )}
                <Button onClick={handleCancel} variant="outline" className="w-full">戻る</Button>
            </div>
            <TimeSelectionDrawer
                isOpen={isTimeDrawerOpen}
                onClose={() => setIsTimeDrawerOpen(false)}
                onSelect={handleTimeSelection}
                type={timeType}
            />
            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default PresetDetailPage;