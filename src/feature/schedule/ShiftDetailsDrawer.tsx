import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Separator } from '@/components/ui/separator';

interface ShiftDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    totalWorkDays: number;
    totalWorkHours: number;
    totalWorkMinutes: number;
    totalSalary: number;
    onDownloadCurrent: () => Promise<void>;
    onDownloadNext: () => Promise<void>;
}

const ShiftDetailsDrawer: React.FC<ShiftDetailsDrawerProps> = ({
    isOpen,
    onClose,
    totalWorkDays,
    totalWorkHours,
    totalWorkMinutes,
    totalSalary,
    onDownloadCurrent,
    onDownloadNext
}) => {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>今月のシフト詳細</DrawerTitle>
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
                <DrawerFooter>
                    <Button onClick={onDownloadCurrent} className="w-full">
                        今月のシフトをダウンロード
                    </Button>
                    <Button onClick={onDownloadNext} className="w-full">
                        来月のシフトをダウンロード
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ShiftDetailsDrawer;