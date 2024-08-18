import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Preset } from '@/types/preset';
import ColorRadioGroup from './ColorRadioGroup';
import { fetchPresets } from '@/lib/api';
import TimeSelectionDrawer from './TimeSelectionDrawer';

interface AddPresetDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    newPreset: Omit<Preset, 'id'>;
    setNewPreset: React.Dispatch<React.SetStateAction<Omit<Preset, 'id'>>>;
    onAdd: () => void;
}

const AddPresetDialog: React.FC<AddPresetDialogProps> = ({
    isOpen,
    onOpenChange,
    newPreset,
    setNewPreset,
    onAdd,
}) => {
    const [isTimeDrawerOpen, setIsTimeDrawerOpen] = useState(false);
    const [timeType, setTimeType] = useState<'start' | 'end'>('start');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [timeError, setTimeError] = useState<string | null>(null);

    const handleTimeSelection = async (time: string) => {
        const updatedPreset = {
            ...newPreset,
            [timeType === 'start' ? 'startTime' : 'endTime']: time
        };
        setNewPreset(updatedPreset);
        setIsTimeDrawerOpen(false);

        // 時間の重複チェック
        if (updatedPreset.startTime && updatedPreset.endTime) {
            const overlap = await checkTimeOverlap(updatedPreset.startTime, updatedPreset.endTime);
            if (overlap) {
                setTimeError('すでにその時間帯は登録されています');
            } else {
                setTimeError(null);
            }
        }
    };

    const openTimeDrawer = (type: 'start' | 'end') => {
        setTimeType(type);
        setIsTimeDrawerOpen(true);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setNewPreset({ ...newPreset, title: newTitle });
        if (newTitle.trim() === '') {
            setTitleError('シフト名を入力してください');
        } else {
            setTitleError(null);
        }
    };

    const checkTimeOverlap = async (startTime: string, endTime: string) => {
        const presets = await fetchPresets();
        return presets.some(preset =>
            preset.startTime === startTime && preset.endTime === endTime
        );
    };

    const handleAdd = async () => {
        if (newPreset.title.trim() === '') {
            setTitleError('シフト名を入力してください');
            return;
        }

        if (!newPreset.startTime || !newPreset.endTime) {
            setTimeError('開始時間と終了時間を設定してください');
            return;
        }

        const overlap = await checkTimeOverlap(newPreset.startTime, newPreset.endTime);
        if (overlap) {
            setTimeError('すでにその時間帯は登録されています');
            return;
        }

        onAdd();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>新しいプリセットを追加</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            シフト名
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="title"
                                value={newPreset.title}
                                placeholder='早番, 遅番, 学校がある日, 水曜日, etc.'
                                onChange={handleTitleChange}
                                className={titleError ? 'border-red-500' : ''}
                            />
                            {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">表示色</Label>
                        <div className="col-span-3">
                            <ColorRadioGroup
                                selectedColor={newPreset.color}
                                onChange={(color) => setNewPreset({ ...newPreset, color })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">勤務時間</Label>
                        <div className="col-span-3 space-y-2">
                            <Button
                                onClick={() => openTimeDrawer('start')}
                                className="w-full justify-between"
                                variant="outline"
                            >
                                <span>開始時間</span>
                                <span>{newPreset.startTime || '未設定'}</span>
                            </Button>
                            <Button
                                onClick={() => openTimeDrawer('end')}
                                className="w-full justify-between"
                                variant="outline"
                            >
                                <span>終了時間</span>
                                <span>{newPreset.endTime || '未設定'}</span>
                            </Button>
                            {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
                        </div>
                    </div>
                </div>
                <Button onClick={handleAdd} className="w-full">追加</Button>
            </DialogContent>
            <TimeSelectionDrawer
                isOpen={isTimeDrawerOpen}
                onClose={() => setIsTimeDrawerOpen(false)}
                onSelect={handleTimeSelection}
                type={timeType}
            />
        </Dialog>
    );
};

export default AddPresetDialog;