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

    useEffect(() => {
        const fetchSubmittedShift = async () => {
            try {
                const data = await getSubmittedShift(format(currentMonth, 'yyyy-MM-dd'));
                if (data && Object.keys(data).length > 0) {
                    setIsSubmitted(true);
                    setSubmittedShiftData(data);
                } else {
                    setIsSubmitted(false);
                }
            } catch (error) {
                console.error('Failed to fetch submitted shift:', error);
                setIsSubmitted(false);
            }
        };

        fetchSubmittedShift();
    }, [currentMonth, isShiftSubmitted]); // isShiftSubmitted を依存配列に追加

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
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SubmittedShiftStatus;