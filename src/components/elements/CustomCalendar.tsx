import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, addMonths, isBefore, isAfter, startOfDay, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface CustomCalendarProps {
    selectedDates: Date[];
    onDateSelect: (date: Date) => void;
    onWeekdaySelect: (weekday: number) => void;
    shiftData: { [key: string]: { color: string } };
    className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDates, onDateSelect, onWeekdaySelect, shiftData, className }) => {
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
            setCurrentMonth(addMonths(currentMonth, 1));
        }
    };

    const handlePrevMonth = () => {
        if (!isPrevMonthDisabled) {
            setCurrentMonth(addMonths(currentMonth, -1));
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
                            className="text-center font-medium text-gray-500 mb-1 hover:bg-gray-100 rounded-md"
                            onClick={() => onWeekdaySelect(index)}
                        >
                            {day}
                        </button>
                    ))}
                    {days.map(day => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const shiftInfo = shiftData[dateKey];
                        const borderColor = shiftInfo ? shiftInfo.color : 'transparent';
                        const isSelectable = isDateSelectable(day);
                        const textColor = isSelectable ? 'text-gray-900' : 'text-gray-400';

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => isSelectable && onDateSelect(day)}
                                className={`p-2 ${textColor} transition-all rounded-md text-sm relative ${isSelectable ? 'hover:bg-gray-100' : 'cursor-not-allowed'}`}
                                style={{
                                    border: `4px solid ${borderColor}`,
                                    backgroundColor: 'white',
                                    opacity: isSelectable ? 1 : 0.5
                                }}
                                disabled={!isSelectable}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomCalendar;