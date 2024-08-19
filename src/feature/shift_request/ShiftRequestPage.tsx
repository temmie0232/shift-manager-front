"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Preset } from '@/types/preset';
import { fetchPresets, saveTemporaryShiftRequest, loadTemporaryShiftRequest, submitShiftRequest } from '@/lib/api';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import CustomCalendar from '@/components/elements/CustomCalendar';

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
                    <CustomCalendar
                        selectedDates={selectedDates}
                        onDateSelect={handleDateSelect}
                        onWeekdaySelect={handleWeekdaySelect}
                        shiftData={shiftData}
                        className="border border-gray-200 rounded-lg shadow-sm mb-4"
                    />
                    <ScrollArea className="h-60 rounded-md border p-2">
                        <div className="flex flex-col items-center space-y-4">
                            {presets.map((preset) => (
                                <div key={preset.id} className="relative w-4/5">
                                    <div
                                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black transition-opacity duration-300 flex items-center justify-center ${selectedPreset?.id === preset.id ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        style={{ left: '-24px' }}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                    <Button
                                        onClick={() => handlePresetClick(preset)}
                                        className="w-full justify-center transition-all duration-200 ease-in-out hover:scale-[1.02] overflow-hidden"
                                        style={{
                                            backgroundColor: 'white',
                                            color: 'black',
                                            border: `4px solid ${preset.color}`
                                        }}
                                    >
                                        <span className="mr-3 truncate">{preset.title}</span>
                                        <span>[ {preset.startTime} - {preset.endTime} ]</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <div className="p-4 h-16 bg-white">
                <Button onClick={() => setIsDrawerOpen(true)} className="w-full">
                    シフト操作
                </Button>
            </div>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>シフト操作</DrawerTitle>
                        <DrawerDescription>
                            希望シフトに対する操作を選択してください。
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-2">
                        <Button onClick={handleSave} className="w-full">現在の変更を一時的に保存</Button>
                        <Button onClick={handleCancel} variant="outline" className="w-full">現在加えた変更を破棄</Button>
                        <Button onClick={handleReset} variant="destructive" className="w-full">シフトをリセット</Button>
                        <Button onClick={handleSubmit} className="w-full">シフト希望を提出</Button>
                    </div>
                    <DrawerFooter>
                        <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                            閉じる
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmDialogContent.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialogContent.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {confirmDialogContent.title === 'シフト希望を提出' && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="min-work-hours">希望最小勤務時間（時間）</Label>
                                <Input
                                    id="min-work-hours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={minWorkHours}
                                    onChange={(e) => setMinWorkHours(e.target.value)}
                                    placeholder="例: 80"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="max-work-hours">希望最大勤務時間（時間）</Label>
                                <Input
                                    id="max-work-hours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={maxWorkHours}
                                    onChange={(e) => setMaxWorkHours(e.target.value)}
                                    placeholder="例: 110"
                                />
                            </div>
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                confirmDialogContent.action();
                                setIsConfirmDialogOpen(false);
                            }}
                            disabled={confirmDialogContent.title === 'シフト希望を提出' && (!minWorkHours || !maxWorkHours)}
                        >
                            確認
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ShiftRequestPage;