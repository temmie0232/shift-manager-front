"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Preset } from '@/types/preset';
import { fetchPresets } from '@/lib/api';
import { format, isSameDay } from 'date-fns';
import CustomCalendar from '@/components/elements/CustomCalendar';

const ShiftRequestPage: React.FC = () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [shiftData, setShiftData] = useState<{ [key: string]: { color: string } }>({});
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

    const handlePresetClick = (preset: Preset) => {
        setSelectedPreset(preset);
    };

    const handleSave = () => {
        console.log('Saving shift data:', shiftData);
    };

    const handleCancel = () => {
        router.push('/');
    };

    const handleReset = () => {
        setShiftData({});
        setSelectedDates([]);
        setSelectedPreset(null);
    };

    const handleSubmit = () => {
        console.log('Submitting shift data:', shiftData);
    };

    return (
        <div className="p-4 flex flex-col h-screen">
            <div className="flex-grow overflow-auto mt-1">
                <CustomCalendar
                    selectedDates={selectedDates}
                    onDateSelect={handleDateSelect}
                    shiftData={shiftData}
                />
                <ScrollArea className="h-60 mt-4 rounded-md border p-3">
                    <div className="p-4">
                        {presets.map((preset) => (
                            <Button
                                key={preset.id}
                                onClick={() => handlePresetClick(preset)}
                                className={`w-full mb-2 justify-start ${selectedPreset?.id === preset.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                                style={{ backgroundColor: preset.color }}
                            >
                                <span className="mr-2">{preset.title}:</span>
                                <span>{preset.startTime} - {preset.endTime}</span>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="mt-auto">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button onClick={handleSave} className="w-full">保存</Button>
                    <Button onClick={handleCancel} variant="outline" className="w-full">キャンセル</Button>
                </div>
                <Button onClick={handleReset} variant="destructive" className="w-full mb-2">リセット</Button>
                <Separator className="my-2" />
                <Button onClick={handleSubmit} className="w-full">シフトを提出</Button>
            </div>
        </div>
    );
};

export default ShiftRequestPage;