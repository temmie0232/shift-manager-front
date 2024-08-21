import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO, differenceInMinutes } from 'date-fns';

interface Shift {
    date: string;
    start_time: string | null;
    end_time: string | null;
    work_type: string;
}

const formatTimeRange = (start: string | null, end: string | null) => {
    if (!start || !end) return '(休み)';
    try {
        const startTime = format(parseISO(start), 'HH:mm');
        const endTime = format(parseISO(end), 'HH:mm');
        return `${startTime}～${endTime}`;
    } catch (error) {
        console.error('Error formatting time range:', error);
        return '(時間情報エラー)';
    }
};

const calculateWorkTime = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return '00:00 (0m)';
    try {
        const start = parseISO(startTime);
        const end = parseISO(endTime);
        const totalMinutes = differenceInMinutes(end, start);

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

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} (${breakMinutes}m)`;
    } catch (error) {
        console.error('Error calculating work time:', error);
        return '00:00 (0m)';
    }
};

const calculateSalary = (workTime: string, hourlyWage: number) => {
    const [hours, minutes] = workTime.split(':').map(Number);
    const totalHours = hours + minutes / 60;
    return Math.round(totalHours * hourlyWage);
};

const ShiftTable: React.FC = () => {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [hourlyWage, setHourlyWage] = useState<number>(0);
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
                console.log('Fetched shifts:', data); // デバッグ用ログ
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

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <ScrollArea className="h-[calc(100vh-16rem)] w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>営業日</TableHead>
                        <TableHead>出勤時間帯</TableHead>
                        <TableHead>実労働時間</TableHead>
                        <TableHead>給料</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {shifts.map((shift, index) => {
                        const workTime = shift.work_type === '勤務'
                            ? calculateWorkTime(shift.start_time, shift.end_time)
                            : '00:00 (0m)';
                        const salary = shift.work_type === '勤務'
                            ? calculateSalary(workTime.split(' ')[0], hourlyWage)
                            : 0;

                        return (
                            <TableRow key={index}>
                                <TableCell>{format(parseISO(shift.date), 'M/d')}</TableCell>
                                <TableCell>{formatTimeRange(shift.start_time, shift.end_time)}</TableCell>
                                <TableCell>{workTime}</TableCell>
                                <TableCell>¥{salary.toLocaleString()}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default ShiftTable;