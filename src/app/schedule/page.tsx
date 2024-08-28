"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ShiftTable from "@/feature/schedule/ShiftTable";
import ShiftDetailsDrawer from "@/feature/schedule/ShiftDetailsDrawer";
import { parse, differenceInMinutes } from 'date-fns';
import { downloadShift } from '@/lib/api';

interface Shift {
    date: string;
    start_time: string | null;
    end_time: string | null;
    work_type: string;
    is_holiday: boolean;
}

const calculateWorkTime = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return '00:00 (+0m)';
    try {
        const start = parse(startTime, 'HH:mm', new Date());
        const end = parse(endTime, 'HH:mm', new Date());
        let totalMinutes = differenceInMinutes(end, start);
        if (totalMinutes < 0) {
            totalMinutes += 24 * 60;
        }

        let workMinutes = totalMinutes;
        let breakMinutes = 0;

        if (totalMinutes <= 180) {
            workMinutes = 180;
        } else if (totalMinutes <= 240) {
            workMinutes = 240;
        } else if (totalMinutes <= 300) {
            workMinutes = 270;
            breakMinutes = 30;
        } else if (totalMinutes <= 360) {
            workMinutes = 330;
            breakMinutes = 30;
        } else if (totalMinutes <= 420) {
            workMinutes = 375;
            breakMinutes = 45;
        } else if (totalMinutes <= 480) {
            workMinutes = 420;
            breakMinutes = 60;
        } else if (totalMinutes <= 540) {
            workMinutes = 480;
            breakMinutes = 60;
        } else if (totalMinutes <= 600) {
            workMinutes = 525;
            breakMinutes = 75;
        } else if (totalMinutes <= 660) {
            workMinutes = 570;
            breakMinutes = 90;
        } else if (totalMinutes <= 720) {
            workMinutes = 630;
            breakMinutes = 90;
        } else if (totalMinutes <= 780) {
            workMinutes = 675;
            breakMinutes = 105;
        } else if (totalMinutes <= 840) {
            workMinutes = 720;
            breakMinutes = 120;
        } else {
            workMinutes = 780;
            breakMinutes = 120;
        }

        const hours = Math.floor(workMinutes / 60);
        const minutes = workMinutes % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} (+${breakMinutes}m)`;
    } catch (error) {
        console.error('Error calculating work time:', error);
        return '00:00 (+0m)';
    }
};

const calculateSalary = (workTime: string, hourlyWage: number) => {
    const [hours, minutes] = workTime.split(' ')[0].split(':').map(Number);
    const totalHours = hours + minutes / 60;
    return Math.round(totalHours * hourlyWage);
};

const SchedulePage = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [hourlyWage, setHourlyWage] = useState<number>(0);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shifts`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch shifts');
                }
                const data = await response.json();
                setShifts(data);
            } catch (error) {
                console.error('Error fetching shifts:', error);
                setError('シフトデータの取得に失敗しました');
            }
        };

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        setHourlyWage(userData.hourly_wage || 0);

        fetchShifts();
    }, []);

    const calculateTotals = () => {
        const totalWorkDays = shifts.filter(shift => shift.work_type === '勤務').length;
        let totalWorkMinutes = 0;
        let totalSalary = 0;

        shifts.forEach(shift => {
            if (shift.work_type === '勤務' && shift.start_time && shift.end_time) {
                const workTime = calculateWorkTime(shift.start_time, shift.end_time);
                const [hours, minutes] = workTime.split(' ')[0].split(':').map(Number);
                totalWorkMinutes += hours * 60 + minutes;
                totalSalary += calculateSalary(workTime, hourlyWage);
            }
        });

        const totalWorkHours = Math.floor(totalWorkMinutes / 60);
        const remainingMinutes = totalWorkMinutes % 60;

        return { totalWorkDays, totalWorkHours, remainingMinutes, totalSalary };
    };

    const handleDownloadCurrent = async () => {
        try {
            await downloadShift('current');
        } catch (error) {
            console.error('Failed to download current month shift:', error);
            setError('現在のシフトのダウンロードに失敗しました');
        }
    };

    const handleDownloadNext = async () => {
        try {
            await downloadShift('next');
        } catch (error) {
            console.error('Failed to download next month shift:', error);
            setError('来月のシフトのダウンロードに失敗しました');
        }
    };

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    const { totalWorkDays, totalWorkHours, remainingMinutes, totalSalary } = calculateTotals();

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="w-full">
                <ShiftTable
                    shifts={shifts}
                    hourlyWage={hourlyWage}
                    calculateWorkTime={calculateWorkTime}
                    calculateSalary={calculateSalary}
                />
            </div>
            <Button className="w-full mt-3" onClick={() => setIsDetailsOpen(true)}>
                詳細を表示
            </Button>
            <ShiftDetailsDrawer
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                totalWorkDays={totalWorkDays}
                totalWorkHours={totalWorkHours}
                totalWorkMinutes={remainingMinutes}
                totalSalary={totalSalary}
                onDownloadCurrent={handleDownloadCurrent}
                onDownloadNext={handleDownloadNext}
            />
        </div>
    );
};

export default SchedulePage;