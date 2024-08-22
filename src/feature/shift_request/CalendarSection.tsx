import React from 'react';
import CustomCalendar from '@/components/elements/CustomCalendar';

interface CalendarSectionProps {
    selectedDates: Date[];
    onDateSelect: (date: Date) => void;
    onWeekdaySelect: (weekday: number) => void;
    shiftData: { [key: string]: { startTime: string; endTime: string; color?: string } };
    currentDisplayMonth: Date;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
    selectedDates,
    onDateSelect,
    onWeekdaySelect,
    shiftData,
    currentDisplayMonth,
}) => (
    <CustomCalendar
        selectedDates={selectedDates}
        onDateSelect={onDateSelect}
        onWeekdaySelect={onWeekdaySelect}
        shiftData={shiftData}
        currentMonth={currentDisplayMonth}
        className="border border-gray-200 rounded-lg shadow-sm mb-4"
    />
);

export default CalendarSection;