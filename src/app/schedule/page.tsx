"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ShiftTable from "@/feature/schedule/ShiftTable";
import ShiftDetailsDrawer from "@/feature/schedule/ShiftDetailsDrawer";
import { parse, differenceInMinutes } from 'date-fns';

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

    const handleDownload = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download_shift`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'current_shift.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'シフトのダウンロードに失敗しました');
            }
        } catch (error) {
            console.error('Download error:', error);
            setError('ネットワークエラーが発生しました');
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
                onDownload={handleDownload}
            />
        </div>
    );
};

export default SchedulePage;