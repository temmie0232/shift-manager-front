import React from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";

interface OperationDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
    onCancel: () => void;
    onReset: () => void;
    onSubmit: () => void;
}

const OperationDrawer: React.FC<OperationDrawerProps> = ({
    isOpen,
    onOpenChange,
    onSave,
    onCancel,
    onReset,
    onSubmit,
}) => (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>シフト操作</DrawerTitle>
                <DrawerDescription>
                    希望シフトに対する操作を選択してください。
                </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-2">
                <Button onClick={onSave} className="w-full">現在の変更を一時的に保存</Button>
                <Button onClick={onCancel} variant="outline" className="w-full">現在加えた変更を破棄</Button>
                <Button onClick={onReset} variant="destructive" className="w-full">シフトをリセット</Button>
                <Button onClick={onSubmit} className="w-full">シフト希望を提出</Button>
            </div>
            <DrawerFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    閉じる
                </Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
);

export default OperationDrawer;