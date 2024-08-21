"use client"
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isSameDay, isWeekend, getDay, isBefore } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Shift {
    date: string;
    start_time: string | null;
    end_time: string | null;
    work_type: string;
    is_holiday: boolean;
}

interface ShiftTableProps {
    shifts: Shift[];
    hourlyWage: number;
    calculateWorkTime: (startTime: string | null, endTime: string | null) => string;
    calculateSalary: (workTime: string, hourlyWage: number) => number;
}

const formatTimeRange = (start: string | null, end: string | null) => {
    if (!start || !end) return (
        <div className="flex items-center justify-center h-full">
            休み
        </div>
    );
    return (
        <div className="flex flex-col items-center">
            <div>{start}</div>
            <div className="h-2 w-px bg-gray-500"></div>
            <div>{end}</div>
        </div>
    );
};

const ShiftTable: React.FC<ShiftTableProps> = ({ shifts, hourlyWage, calculateWorkTime, calculateSalary }) => {
    const today = new Date();
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollToToday = () => {
            const todayRow = document.getElementById('today-row');
            if (todayRow && tableRef.current) {
                todayRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        // ページ読み込み後に少し遅延を入れてスクロールを実行
        setTimeout(scrollToToday, 100);
    }, []);

    return (
        <div className="relative flex flex-col items-center space-y-4">
            <div className="w-full max-w-3xl rounded-lg overflow-hidden border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white">
                            <TableHead className="w-1/5 text-center text-xs">日</TableHead>
                            <TableHead className="w-1/4 text-center text-xs">時間</TableHead>
                            <TableHead className="w-1/3 text-center text-xs">実労働時間<br />(+休憩時間)</TableHead>
                            <TableHead className="w-1/4 text-center text-xs">給料</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(100vh-16rem)]" ref={tableRef}>
                    <Table>
                        <TableBody>
                            {shifts.map((shift, index) => {
                                const shiftDate = new Date(shift.date);
                                const dayOfWeek = format(shiftDate, 'EEE', { locale: ja });
                                const workTime = shift.work_type === '勤務'
                                    ? calculateWorkTime(shift.start_time, shift.end_time)
                                    : '00:00 (+0m)';
                                const salary = shift.work_type === '勤務'
                                    ? calculateSalary(workTime.split(' ')[0], hourlyWage)
                                    : 0;
                                const isToday = isSameDay(shiftDate, today);
                                const isWeekendDay = isWeekend(shiftDate);
                                const isSundayOrHoliday = getDay(shiftDate) === 0 || shift.is_holiday;
                                const isPastDay = isBefore(shiftDate, today);

                                let rowClass = '';
                                let dateCellClass = 'text-center';

                                if (isPastDay) {
                                    rowClass = 'bg-gray-300';
                                } else if (isToday) {
                                    rowClass = 'bg-green-100 border-y-2  border-green-500';
                                }

                                if (isWeekendDay || isSundayOrHoliday) {
                                    dateCellClass += isSundayOrHoliday ? ' text-red-500' : ' text-blue-500';
                                }

                                if (shift.work_type !== '勤務') {
                                    rowClass += ' text-gray-400';
                                }

                                return (
                                    <TableRow
                                        key={index}
                                        className={rowClass}
                                        id={isToday ? 'today-row' : undefined}
                                    >
                                        <TableCell className={dateCellClass}>
                                            {format(shiftDate, 'M/d')}({dayOfWeek})
                                        </TableCell>
                                        <TableCell className="text-center">{formatTimeRange(shift.start_time, shift.end_time)}</TableCell>
                                        <TableCell className="text-center">{workTime}</TableCell>
                                        <TableCell className="text-center">¥{salary.toLocaleString()}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
};

export default ShiftTable;