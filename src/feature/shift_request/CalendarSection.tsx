import React from 'react';
import CustomCalendar from '@/components/elements/CustomCalendar';

interface CalendarSectionProps {
    selectedDates: Date[];
    onDateSelect: (date: Date) => void;
    onWeekdaySelect: (weekday: number) => void;
    shiftData: { [key: string]: { startTime: string; endTime: string; color?: string } };
    onMonthChange: (newMonth: Date) => void;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
    selectedDates,
    onDateSelect,
    onWeekdaySelect,
    shiftData,
    onMonthChange,
}) => (
    <CustomCalendar
        selectedDates={selectedDates}
        onDateSelect={onDateSelect}
        onWeekdaySelect={onWeekdaySelect}
        shiftData={shiftData}
        onMonthChange={onMonthChange}
        className="border border-gray-200 rounded-lg shadow-sm mb-4"
    />
);

export default CalendarSection;