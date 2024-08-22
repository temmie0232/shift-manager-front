import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface AdminPopoverProps {
    children: React.ReactNode;
}

const AdminPopover: React.FC<AdminPopoverProps> = ({ children }) => {
    const router = useRouter();

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-56">
                <div className="grid gap-3">
                    <h4 className="font-medium leading-none !my-3">管理者メニュー</h4>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => router.push('/admin/shift_upload')}
                    >
                        シフトのアップロード
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        シフト作成
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => router.push('/admin/shift_submission_status')}
                    >
                        シフト提出状況の確認
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default AdminPopover;