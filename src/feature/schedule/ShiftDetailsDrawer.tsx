import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Separator } from '@/components/ui/separator';
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
    const handleDownload = async (type: 'current' | 'next') => {
        try {
            await downloadShift(type);
        } catch (error) {
            console.error(`Failed to download ${type} shift:`, error);
            // エラー処理（例：ユーザーへの通知）を追加することをお勧めします
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>シフト詳細</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-5">
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
                <Separator />
                <DrawerFooter className="space-y-2">
                    <Button onClick={() => handleDownload('current')} className="w-full">
                        今月のシフトをダウンロード
                    </Button>
                    <Button onClick={() => handleDownload('next')} className="w-full">
                        来月のシフトをダウンロード
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ShiftDetailsDrawer;