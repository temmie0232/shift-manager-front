import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { downloadShift } from '@/lib/api';

interface ShiftDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    totalWorkDays: number;
    totalWorkHours: number;
    totalWorkMinutes: number;
    totalSalary: number;
}

const ShiftDetailsDrawer: React.FC<ShiftDetailsDrawerProps> = ({
    isOpen,
    onClose,
    totalWorkDays,
    totalWorkHours,
    totalWorkMinutes,
    totalSalary,
}) => {
    const handleDownload = async () => {
        try {
            await downloadShift();
        } catch (error) {
            console.error('Failed to download shift:', error);
            // エラーメッセージを表示するなどの処理を追加できます
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>今月のシフト詳細</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>出勤日数</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalWorkDays}日</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>総労働時間</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalWorkHours}時間{totalWorkMinutes}分</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>総給料</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">¥{totalSalary.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </div>
                <DrawerFooter>
                    <Button onClick={handleDownload} className="w-full">
                        シフトをダウンロード
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ShiftDetailsDrawer;