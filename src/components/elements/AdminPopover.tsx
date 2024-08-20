import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface AdminPopoverProps {
    children: React.ReactNode;
}

const AdminPopover: React.FC<AdminPopoverProps> = ({ children }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-56">
                <div className="grid gap-4">
                    <h4 className="font-medium leading-none">管理者メニュー</h4>
                    <Button variant="outline" className="w-full justify-start">
                        シフトのアップロード
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        シフト作成
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        シフト提出状況の確認
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default AdminPopover;