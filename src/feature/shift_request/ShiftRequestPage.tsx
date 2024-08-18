"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Preset } from '@/types/preset';
import { fetchPresets } from '@/lib/api';
import { ja } from 'date-fns/locale';

const ShiftRequestPage: React.FC = () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [shiftData, setShiftData] = useState<{ [key: string]: Preset }>({});
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

    const handleDateSelect = (dates: Date[] | undefined) => {
        if (dates) {
            setSelectedDates(dates);
            if (selectedPreset) {
                const newShiftData = { ...shiftData };
                dates.forEach(date => {
                    const dateString = date.toISOString().split('T')[0];
                    newShiftData[dateString] = selectedPreset;
                });
                setShiftData(newShiftData);
            }
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
    };

    const handleSubmit = () => {
        console.log('Submitting shift data:', shiftData);
    };

    return (
        <div className="p-4 flex flex-col h-screen">
            <div className="flex-grow overflow-auto mt-3">
                <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={handleDateSelect}
                    className="rounded-md border mb-4 w-full"
                    locale={ja}
                />
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {presets.map((preset) => (
                        <Button
                            key={preset.id}
                            onClick={() => handlePresetClick(preset)}
                            className="p-2"
                            style={{ backgroundColor: preset.color }}
                        >
                            {preset.title}
                        </Button>
                    ))}
                </div>
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