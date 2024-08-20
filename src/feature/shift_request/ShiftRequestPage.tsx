"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

import { Preset } from '@/types/preset';
import { fetchPresets, saveTemporaryShiftRequest, loadTemporaryShiftRequest, submitShiftRequest } from '@/lib/api';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import CalendarSection from './CalendarSection';
import PresetList from './PresetList';
import OperationDrawer from './OperationDrawer';
import ConfirmationDialog from './ConfirmationDialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PresetSelectionDrawer from './PresetSelectionDawer';

interface ShiftInfo {
    startTime: string;
    endTime: string;
    color?: string;
}

const ShiftRequestPage: React.FC = () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [shiftData, setShiftData] = useState<{ [key: string]: ShiftInfo }>({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmDialogContent, setConfirmDialogContent] = useState({ title: '', description: '', action: () => { } });
    const [isPresetDrawerOpen, setIsPresetDrawerOpen] = useState(false);
    const [minWorkHours, setMinWorkHours] = useState<string>('');
    const [maxWorkHours, setMaxWorkHours] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedPresets = await fetchPresets();
                setPresets(fetchedPresets);

                const currentDate = new Date();
                const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                const tempShiftRequest = await loadTemporaryShiftRequest(format(nextMonth, 'yyyy-MM-dd'));
                if (tempShiftRequest) {
                    setShiftData(tempShiftRequest.shift_data);
                    setMinWorkHours(tempShiftRequest.min_work_hours?.toString() || '');
                    setMaxWorkHours(tempShiftRequest.max_work_hours?.toString() || '');
                    setSelectedDates(Object.keys(tempShiftRequest.shift_data).map(dateStr => new Date(dateStr)));
                }
            } catch (error) {
                console.error('Failed to load data:', error);
                setError('データの読み込みに失敗しました。もう一度お試しください。');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDateSelect = (date: Date) => {
        if (selectedPreset) {
            const dateString = format(date, 'yyyy-MM-dd');
            setSelectedDates(prev => {
                const isAlreadySelected = prev.some(d => isSameDay(d, date));
                if (isAlreadySelected) {
                    return prev.filter(d => !isSameDay(d, date));
                } else {
                    return [...prev, date];
                }
            });
            setShiftData(prev => {
                const newShiftData = { ...prev };
                if (newShiftData[dateString]) {
                    delete newShiftData[dateString];
                } else {
                    newShiftData[dateString] = {
                        startTime: selectedPreset.startTime,
                        endTime: selectedPreset.endTime,
                        color: selectedPreset.color
                    };
                }
                return newShiftData;
            });
        }
    };

    const handleWeekdaySelect = (weekday: number) => {
        if (selectedPreset) {
            const currentDate = new Date();
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            const startOfNextMonth = startOfMonth(nextMonth);
            const endOfNextMonth = endOfMonth(nextMonth);
            const daysInMonth = eachDayOfInterval({ start: startOfNextMonth, end: endOfNextMonth });

            const selectedDays = daysInMonth.filter(day => getDay(day) === weekday);

            const allSelected = selectedDays.every(day => {
                const dateString = format(day, 'yyyy-MM-dd');
                return shiftData[dateString]?.startTime === selectedPreset.startTime
                    && shiftData[dateString]?.endTime === selectedPreset.endTime;
            });

            setSelectedDates(prev => {
                if (allSelected) {
                    return prev.filter(date => !selectedDays.some(day => isSameDay(day, date)));
                } else {
                    const newDates = selectedDays.filter(day =>
                        !prev.some(date => isSameDay(date, day))
                    );
                    return [...prev, ...newDates];
                }
            });

            setShiftData(prev => {
                const newShiftData = { ...prev };
                selectedDays.forEach(day => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    if (allSelected) {
                        delete newShiftData[dateString];
                    } else {
                        newShiftData[dateString] = {
                            startTime: selectedPreset.startTime,
                            endTime: selectedPreset.endTime,
                            color: selectedPreset.color
                        };
                    }
                });
                return newShiftData;
            });
        }
    };
    const handlePresetClick = (preset: Preset) => {
        setSelectedPreset(preset);
    };

    const handleSave = async () => {
        try {
            const currentDate = new Date();
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            await saveTemporaryShiftRequest(
                format(nextMonth, 'yyyy-MM-dd'),
                shiftData,
                parseFloat(minWorkHours),
                parseFloat(maxWorkHours)
            );
            console.log('Temporary shift data saved:', shiftData);
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Failed to save temporary shift data:', error);
            setError('一時保存に失敗しました。もう一度お試しください。');
        }
    };

    const handleCancel = async () => {
        setConfirmDialogContent({
            title: '変更を破棄',
            description: '現在加えた変更が破棄され、以前の保存地点まで作業内容が戻ってしまいますがよろしいですか？',
            action: async () => {
                try {
                    const currentDate = new Date();
                    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                    const tempShiftRequest = await loadTemporaryShiftRequest(format(nextMonth, 'yyyy-MM-dd'));
                    if (tempShiftRequest) {
                        setShiftData(tempShiftRequest.shift_data);
                        setMinWorkHours(tempShiftRequest.min_work_hours?.toString() || '');
                        setMaxWorkHours(tempShiftRequest.max_work_hours?.toString() || '');
                        setSelectedDates(Object.keys(tempShiftRequest.shift_data).map(dateStr => new Date(dateStr)));
                    } else {
                        setShiftData({});
                        setSelectedDates([]);
                        setMinWorkHours('');
                        setMaxWorkHours('');
                    }
                    setIsDrawerOpen(false);
                } catch (error) {
                    console.error('Failed to load temporary shift data:', error);
                    setError('前回の保存データの読み込みに失敗しました。もう一度お試しください。');
                }
            }
        });
        setIsConfirmDialogOpen(true);
    };

    const handleReset = () => {
        setConfirmDialogContent({
            title: 'シフトをリセット',
            description: 'シフトがリセットされて0の状態になってしまいますがよろしいですか？',
            action: () => {
                setShiftData({});
                setSelectedDates([]);
                setSelectedPreset(null);
                setMinWorkHours('');
                setMaxWorkHours('');
                setIsDrawerOpen(false);
            }
        });
        setIsConfirmDialogOpen(true);
    };

    const handleSubmit = async () => {
        setConfirmDialogContent({
            title: 'シフト希望を提出',
            description: '現在の内容でシフトを提出します。よろしいですか？',
            action: async () => {
                try {
                    const currentDate = new Date();
                    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                    await submitShiftRequest(
                        format(nextMonth, 'yyyy-MM-dd'),
                        shiftData,
                        parseFloat(minWorkHours),
                        parseFloat(maxWorkHours)
                    );
                    console.log('Shift request submitted:', shiftData);
                    setIsDrawerOpen(false);
                    // TODO: Show success message and maybe redirect
                } catch (error) {
                    console.error('Failed to submit shift request:', error);
                    setError('シフト希望の提出に失敗しました。もう一度お試しください。');
                }
            }
        });
        setIsConfirmDialogOpen(true);
    };

    if (isLoading) {
        return <div className="p-4">読み込み中...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
            <div className="flex-grow overflow-hidden">
                <div className="h-full overflow-y-auto p-4">
                    <CalendarSection
                        selectedDates={selectedDates}
                        onDateSelect={handleDateSelect}
                        onWeekdaySelect={handleWeekdaySelect}
                        shiftData={shiftData}
                    />
                    <div className="mt-4 space-y-2">
                        <Label>希望勤務時間</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={minWorkHours}
                                onChange={(e) => setMinWorkHours(e.target.value)}
                                placeholder="最小"
                                className="w-24"
                            />
                            <span>～</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={maxWorkHours}
                                onChange={(e) => setMaxWorkHours(e.target.value)}
                                placeholder="最大"
                                className="w-24"
                            />
                            <span>時間</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-2 bg-white">
                <Button onClick={() => setIsPresetDrawerOpen(true)} className="w-full">
                    プリセット選択
                </Button>
                <Button onClick={() => setIsDrawerOpen(true)} className="w-full">
                    シフト操作
                </Button>
            </div>
            <OperationDrawer
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                onSave={handleSave}
                onCancel={handleCancel}
                onReset={handleReset}
                onSubmit={handleSubmit}
            />
            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                content={confirmDialogContent}
            />
            <PresetSelectionDrawer
                isOpen={isPresetDrawerOpen}
                onOpenChange={setIsPresetDrawerOpen}
                presets={presets}
                selectedPreset={selectedPreset}
                onPresetClick={handlePresetClick}
            />
        </div>
    );
};

export default ShiftRequestPage;