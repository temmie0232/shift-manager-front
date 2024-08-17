import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeSelectProps {
    value: string;
    onChange: (value: string) => void;
    isStartTime: boolean;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange, isStartTime }) => {
    const generateTimeOptions = () => {
        const options = [];
        const start = isStartTime ? 7 : 11;
        const end = isStartTime ? 19 : 22;

        for (let hour = start; hour <= end; hour++) {
            options.push(`${hour.toString().padStart(2, '0')}:00`);
            if (isStartTime && hour === 8) {
                options.push('08:30');
            }
        }
        return options;
    };

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={isStartTime ? "開始時間を選択" : "終了時間を選択"} />
            </SelectTrigger>
            <SelectContent>
                {generateTimeOptions().map((time) => (
                    <SelectItem key={time} value={time}>
                        {time}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default TimeSelect;