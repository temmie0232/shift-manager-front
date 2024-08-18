import React, { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CustomCalendarProps {
    selectedDates: Date[];
    onDateSelect: (date: Date) => void;
    shiftData: { [key: string]: { color: string } };
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDates, onDateSelect, shiftData }) => {
    const [currentMonth, setCurrentMonth] = useState(addMonths(new Date(), 1));

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(startMonth, { weekStartsOn: 0 });
    const endDate = endOfWeek(endMonth, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <Button onClick={prevMonth} variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center font-bold">
                        {format(currentMonth, 'yyyy年M月', { locale: ja })}
                    </div>
                    <Button onClick={nextMonth} variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekdays.map(day => (
                        <div key={day} className="text-center font-medium text-gray-500 mb-1">
                            {day}
                        </div>
                    ))}
                    {days.map(day => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const shiftInfo = shiftData[dateKey];
                        const bgColor = shiftInfo ? shiftInfo.color : 'white';
                        const textColor = isSameMonth(day, currentMonth) ? 'text-gray-900' : 'text-gray-400';

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => onDateSelect(day)}
                                className={`p-2 ${textColor} hover:opacity-80 transition-all rounded-md text-sm`}
                                style={{ backgroundColor: bgColor }}
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