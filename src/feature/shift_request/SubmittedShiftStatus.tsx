import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomCalendar from '@/components/elements/CustomCalendar';
import { format } from 'date-fns';
import { getSubmittedShift } from '@/lib/api';

interface SubmittedShiftStatusProps {
    currentMonth: Date;
    isShiftSubmitted: boolean;
}

const SubmittedShiftStatus: React.FC<SubmittedShiftStatusProps> = ({ currentMonth, isShiftSubmitted }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submittedShiftData, setSubmittedShiftData] = useState<{ [key: string]: { startTime: string, endTime: string, color?: string } }>({});
    const [minWorkHours, setMinWorkHours] = useState<number | null>(null);
    const [maxWorkHours, setMaxWorkHours] = useState<number | null>(null);

    useEffect(() => {
        const fetchSubmittedShift = async () => {
            try {
                const data = await getSubmittedShift(format(currentMonth, 'yyyy-MM-dd'));
                if (data && data.shiftData && Object.keys(data.shiftData).length > 0) {
                    setIsSubmitted(true);
                    setSubmittedShiftData(data.shiftData);
                    setMinWorkHours(data.minWorkHours);
                    setMaxWorkHours(data.maxWorkHours);
                } else {
                    setIsSubmitted(false);
                    setSubmittedShiftData({});
                    setMinWorkHours(null);
                    setMaxWorkHours(null);
                }
            } catch (error) {
                console.error('Failed to fetch submitted shift:', error);
                setIsSubmitted(false);
            }
        };

        fetchSubmittedShift();
    }, [currentMonth, isShiftSubmitted]);

    return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">シフト提出状況</h2>
            {isSubmitted ? (
                <>
                    <p className="text-green-600 mb-2">提出済み</p>
                    <Button onClick={() => setIsDialogOpen(true)}>提出したシフトを確認</Button>
                </>
            ) : (
                <p className="text-red-600">未提出</p>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>提出したシフト</DialogTitle>
                    </DialogHeader>
                    <CustomCalendar
                        selectedDates={[]}
                        onDateSelect={() => { }}
                        onWeekdaySelect={() => { }}
                        shiftData={submittedShiftData}
                        currentMonth={currentMonth}
                    />
                    {(minWorkHours !== null || maxWorkHours !== null) && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">希望勤務時間</h3>
                            <p>
                                {minWorkHours !== null && `最低: ${minWorkHours}時間`}
                                {minWorkHours !== null && maxWorkHours !== null && ' / '}
                                {maxWorkHours !== null && `最高: ${maxWorkHours}時間`}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SubmittedShiftStatus;