"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Preset } from '@/types/preset';
import { fetchPresets } from '@/lib/api';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import CustomCalendar from '@/components/elements/CustomCalendar';

const ShiftRequestPage: React.FC = () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [shiftData, setShiftData] = useState<{ [key: string]: { color: string } }>({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadPresets = async () => {
            try {
                const fetchedPresets = await fetchPresets();
                setPresets(fetchedPresets);
            } catch (error) {
                console.error('Failed to load presets:', error);
            }
        };
        loadPresets();
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
                    newShiftData[dateString] = { color: selectedPreset.color };
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

            // Check if all days of this weekday are already selected
            const allSelected = selectedDays.every(day =>
                shiftData[format(day, 'yyyy-MM-dd')]?.color === selectedPreset.color
            );

            setSelectedDates(prev => {
                if (allSelected) {
                    // If all are selected, remove them
                    return prev.filter(date => !selectedDays.some(day => isSameDay(day, date)));
                } else {
                    // If not all are selected, add the missing ones
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
                        newShiftData[dateString] = { color: selectedPreset.color };
                    }
                });
                return newShiftData;
            });
        }
    };

    const handlePresetClick = (preset: Preset) => {
        setSelectedPreset(preset);
    };

    const handleSave = () => {
        console.log('Saving shift data:', shiftData);
        setIsDrawerOpen(false);
    };

    const handleCancel = () => {
        setIsDrawerOpen(false);
    };

    const handleReset = () => {
        setShiftData({});
        setSelectedDates([]);
        setSelectedPreset(null);
        setIsDrawerOpen(false);
    };

    const handleSubmit = () => {
        console.log('Submitting shift data:', shiftData);
        setIsDrawerOpen(false);
    };

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
        </div>
    );
};

export default ShiftRequestPage;