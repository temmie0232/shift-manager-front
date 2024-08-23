"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

import { Preset } from '@/types/preset';
import { fetchPresets, saveTemporaryShiftRequest, loadTemporaryShiftRequest, submitShiftRequest, getShiftDeadline } from '@/lib/api';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths } from 'date-fns';
import CalendarSection from './CalendarSection';
import PresetList from './PresetList';
import OperationDrawer from './OperationDrawer';
import ConfirmationDialog from './ConfirmationDialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PresetSelectionDrawer from './PresetSelectionDawer';
import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SubmittedShiftStatus from './SubmittedShiftStatus';
import { toast, useToast } from '@/components/ui/use-toast';

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
    const [workHoursError, setWorkHoursError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deadline, setDeadline] = useState<number | null>(null);
    const [currentDisplayMonth, setCurrentDisplayMonth] = useState<Date>(addMonths(new Date(), 1));
    const [isShiftSubmitted, setIsShiftSubmitted] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedPresets = await fetchPresets();
                setPresets(fetchedPresets);

                const nextMonth = addMonths(new Date(), 1);
                const tempShiftRequest = await loadTemporaryShiftRequest(format(nextMonth, 'yyyy-MM-dd'));
                if (tempShiftRequest) {
                    setShiftData(tempShiftRequest.shift_data);
                    setMinWorkHours(tempShiftRequest.min_work_hours?.toString() || '');
                    setMaxWorkHours(tempShiftRequest.max_work_hours?.toString() || '');
                    setSelectedDates(Object.keys(tempShiftRequest.shift_data).map(dateStr => new Date(dateStr)));
                }

                const fetchedDeadline = await getShiftDeadline();
                setDeadline(fetchedDeadline);

                setCurrentDisplayMonth(nextMonth);
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
            const startOfCurrentMonth = startOfMonth(currentDisplayMonth);
            const endOfCurrentMonth = endOfMonth(currentDisplayMonth);
            const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

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
            await saveTemporaryShiftRequest(
                format(currentDisplayMonth, 'yyyy-MM-dd'),
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
            title: 'シフト希望を提出',
            description: '現在の内容でシフトを提出します。よろしいですか？',
            action: async () => {
                try {
                    // 一時保存を実行
                    await saveTemporaryShiftRequest(
                        format(currentDisplayMonth, 'yyyy-MM-dd'),
                        shiftData,
                        parseFloat(minWorkHours),
                        parseFloat(maxWorkHours)
                    );

                    // シフト希望を提出
                    await submitShiftRequest(
                        format(currentDisplayMonth, 'yyyy-MM-dd'),
                        shiftData,
                        parseFloat(minWorkHours),
                        parseFloat(maxWorkHours)
                    );

                    console.log('Shift request submitted and saved:', shiftData);
                    setIsDrawerOpen(false);
                    setIsShiftSubmitted(true); // シフト提出状態を更新

                    toast({
                        title: "成功",
                        description: "シフト希望が正常に提出され、保存されました。",
                        duration: 3000,
                    });
                } catch (error) {
                    console.error('Failed to submit or save shift request:', error);

                    toast({
                        title: "エラー",
                        description: "シフト希望の提出または保存に失敗しました。もう一度お試しください。",
                        variant: "destructive",
                        duration: 3000,
                    });
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
        const errorMessage = validateWorkHours();
        setWorkHoursError(errorMessage);

        if (errorMessage) {
            toast({
                title: "エラー",
                description: errorMessage,
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        setConfirmDialogContent({
            title: 'シフト希望を提出',
            description: '現在の内容でシフトを提出します。よろしいですか？',
            action: async () => {
                try {
                    // 一時保存を実行
                    await saveTemporaryShiftRequest(
                        format(currentDisplayMonth, 'yyyy-MM-dd'),
                        shiftData,
                        parseFloat(minWorkHours),
                        parseFloat(maxWorkHours)
                    );

                    // シフト希望を提出
                    await submitShiftRequest(
                        format(currentDisplayMonth, 'yyyy-MM-dd'),
                        shiftData,
                        parseFloat(minWorkHours),
                        parseFloat(maxWorkHours)
                    );

                    console.log('Shift request submitted and saved:', shiftData);
                    setIsDrawerOpen(false);
                    setIsShiftSubmitted(true); // シフト提出状態を更新

                    toast({
                        title: "成功",
                        description: "シフト希望が正常に提出され、保存されました。",
                        duration: 3000,
                    });
                } catch (error) {
                    console.error('Failed to submit or save shift request:', error);

                    toast({
                        title: "エラー",
                        description: "シフト希望の提出または保存に失敗しました。もう一度お試しください。",
                        variant: "destructive",
                        duration: 3000,
                    });
                }
            }
        });
        setIsConfirmDialogOpen(true);
    };

    const validateWorkHours = (): string | null => {
        if (!minWorkHours || !maxWorkHours) {
            return '最低希望時間と最高希望時間を入力してください。';
        }
        const min = parseFloat(minWorkHours);
        const max = parseFloat(maxWorkHours);
        if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
            return '有効な数値を入力してください。';
        }
        if (min > max) {
            return '最低希望時間は最高希望時間以下にしてください。';
        }
        return null;
    };


    const getDeadlineText = () => {
        if (!deadline) return null;
        const displayMonth = currentDisplayMonth.getMonth(); // 0-indexed
        const deadlineMonth = displayMonth === 0 ? 12 : displayMonth; // 1月の場合は12月を表示
        const deadlineMonthName = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'][deadlineMonth - 1];
        return `${deadlineMonthName}月${deadline}日`;
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
                    {getDeadlineText() && (
                        <div className="mb-4 flex items-center justify-center">
                            <Badge variant="secondary" className="px-4 py-2 text-base font-medium">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                提出締切日: {getDeadlineText()}
                            </Badge>
                        </div>
                    )}
                    <CalendarSection
                        selectedDates={selectedDates}
                        onDateSelect={handleDateSelect}
                        onWeekdaySelect={handleWeekdaySelect}
                        shiftData={shiftData}
                        currentDisplayMonth={currentDisplayMonth}
                    />
                    <div className="my-4 space-y-2">
                        <Label>希望勤務時間</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={minWorkHours}
                                onChange={(e) => {
                                    setMinWorkHours(e.target.value);
                                    setWorkHoursError(null);
                                }}
                                placeholder="最低"
                                className={`w-24 ${workHoursError ? 'border-red-500' : ''}`}
                            />
                            <span>～</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                value={maxWorkHours}
                                onChange={(e) => {
                                    setMaxWorkHours(e.target.value);
                                    setWorkHoursError(null);
                                }}
                                placeholder="最高"
                                className={`w-24 ${workHoursError ? 'border-red-500' : ''}`}
                            />
                            <span>時間</span>
                        </div>
                        {workHoursError && <p className="text-red-500 text-sm">{workHoursError}</p>}
                    </div>
                    <SubmittedShiftStatus
                        currentMonth={currentDisplayMonth}
                        isShiftSubmitted={isShiftSubmitted}
                    />
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