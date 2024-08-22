import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, addMonths, isBefore, isAfter, startOfDay, getDay, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface CustomCalendarProps {
    selectedDates: Date[];
    onDateSelect: (date: Date) => void;
    onWeekdaySelect: (weekday: number) => void;
    shiftData: { [key: string]: { startTime: string, endTime: string, color?: string } };
    onMonthChange: (newMonth: Date) => void;
    className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
    selectedDates,
    onDateSelect,
    onWeekdaySelect,
    shiftData,
    onMonthChange,
    className
}) => {
    const today = startOfDay(new Date());
    const nextMonth = startOfMonth(addMonths(today, 1));
    const [currentMonth, setCurrentMonth] = useState(nextMonth);
    const [isNextMonthDisabled, setIsNextMonthDisabled] = useState(false);
    const [isPrevMonthDisabled, setIsPrevMonthDisabled] = useState(true);

    useEffect(() => {
        const twoMonthsLater = addMonths(nextMonth, 1);
        setIsNextMonthDisabled(isSameMonth(currentMonth, twoMonthsLater));
        setIsPrevMonthDisabled(isSameMonth(currentMonth, nextMonth));
    }, [currentMonth, nextMonth]);

    const handleNextMonth = () => {
        if (!isNextMonthDisabled) {
            const newMonth = addMonths(currentMonth, 1);
            setCurrentMonth(newMonth);
            onMonthChange(newMonth);
        }
    };

    const handlePrevMonth = () => {
        if (!isPrevMonthDisabled) {
            const newMonth = addMonths(currentMonth, -1);
            setCurrentMonth(newMonth);
            onMonthChange(newMonth);
        }
    };

    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(startMonth, { weekStartsOn: 0 });
    const endDate = endOfWeek(endMonth, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    const isDateSelectable = (date: Date) => {
        const startOfDate = startOfDay(date);
        return (
            isSameMonth(startOfDate, currentMonth) &&
            (isSameMonth(startOfDate, nextMonth) || isSameMonth(startOfDate, addMonths(nextMonth, 1))) &&
            !isBefore(startOfDate, nextMonth)
        );
    };

    const getLighterColor = (color: string | undefined, factor: number = 0.9) => {
        if (!color) return 'white';
        if (color === '#ffffff') return 'rgb(0, 0, 0)';
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const lighterR = Math.round(r + (255 - r) * factor);
        const lighterG = Math.round(g + (255 - g) * factor);
        const lighterB = Math.round(b + (255 - b) * factor);
        return `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
    };

    return (
        <div className={cn("bg-white rounded-lg shadow", className)}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={handlePrevMonth} variant="ghost" size="icon" disabled={isPrevMonthDisabled}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center font-bold">
                        {format(currentMonth, 'yyyy年M月', { locale: ja })}
                    </div>
                    <Button onClick={handleNextMonth} variant="ghost" size="icon" disabled={isNextMonthDisabled}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekdays.map((day, index) => (
                        <button
                            key={day}
                            className={`text-center font-medium mb-1 hover:bg-gray-100 rounded-md ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
                                }`}
                            onClick={() => onWeekdaySelect(index)}
                        >
                            {day}
                        </button>
                    ))}
                    {days.map(day => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const shiftInfo = shiftData[dateKey];
                        const isSelectable = isDateSelectable(day);
                        const isFree = shiftInfo && shiftInfo.color === '#ffffff';
                        const isHoliday = shiftInfo && shiftInfo.startTime === '00:00' && shiftInfo.endTime === '00:00';
                        const dayOfWeek = getDay(day);
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        const textColor = isSelectable
                            ? (isFree ? 'text-white' : isWeekend ? (dayOfWeek === 0 ? 'text-red-500' : 'text-blue-500') : 'text-gray-900')
                            : 'text-gray-400';
                        const backgroundColor = shiftInfo
                            ? (isFree ? 'rgb(0, 0, 0)' : getLighterColor(shiftInfo.color))
                            : 'white';

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => isSelectable && onDateSelect(day)}
                                className={`p-2 ${textColor} transition-all rounded-md text-sm relative ${isSelectable ? 'hover:bg-gray-100' : 'cursor-not-allowed'}`}
                                style={{
                                    backgroundColor: backgroundColor,
                                    opacity: isSelectable ? 1 : 0.5,
                                }}
                                disabled={!isSelectable}
                            >
                                <div>{format(day, 'd')}</div>
                                {shiftInfo && (
                                    <>
                                        <div className="my-1 h-px bg-gray-300"></div>
                                        <div className="text-xs flex flex-col items-center">
                                            {isHoliday ? (
                                                <div>休</div>
                                            ) : (
                                                <>
                                                    <div>{shiftInfo.startTime}</div>
                                                    <div className="h-2 w-px bg-gray-400"></div>
                                                    <div>{shiftInfo.endTime}</div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomCalendar;