import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IoReorderThree } from 'react-icons/io5';
import { GrUserAdmin } from 'react-icons/gr';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AdminPopover from '../elements/AdminPopover';
import { Separator } from '../ui/separator';

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminStatus = () => {
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setIsAdmin(userData.employee_type === 0);
            }
        };

        checkAdminStatus();
        // Add event listener for storage changes
        window.addEventListener('storage', checkAdminStatus);

        // Cleanup
        return () => {
            window.removeEventListener('storage', checkAdminStatus);
        };
    }, []);

    const getPageTitle = () => {
        switch (pathname) {
            case '/schedule':
                return 'スケジュール';
            case '/shift_request':
                return '希望シフト入力';
            case '/preset_creation':
                return 'プリセットの作成';
            case '/chat':
                return 'チャット';
            case '/status_check':
                return 'ステータス確認';
            case '/update_profile':
                return '情報の更新';
            case '/admin/shift_upload':
                return 'シフトの更新';
            case '/admin/shift_submission_status':
                return 'シフトの提出状況';
            case '/admin/shift_setting':
                return 'シフト設定';
            default:
                return '';
        }
    };

    const buttonClass = `
        p-2 
        rounded-full 
        transition-all 
        duration-300 
        ease-in-out 
        hover:bg-gray-200 
        focus:outline-none 
        focus:ring-0 
        active:scale-95
    `;

    return (
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-white bg-opacity-90 backdrop-blur-sm shadow-md z-50 rounded-b-2xl">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" className={buttonClass}>
                        <IoReorderThree className="h-6 w-6 text-gray-700" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="flex flex-col space-y-1">
                        <Separator className='mt-8' />
                        <Button variant="ghost" onClick={() => router.push('/schedule')}>スケジュール確認</Button>
                        <Separator />
                        <Button variant="ghost" onClick={() => router.push('/shift_request')}>希望シフト提出</Button>
                        <Separator />
                        <Button variant="ghost" onClick={() => router.push('/preset_creation')}>パターンの作成</Button>
                        <Separator />
                        {/*
                        <Button variant="ghost" onClick={() => router.push('/chat')}>チャット</Button>
                        <Separator />
                        <Button variant="ghost" onClick={() => router.push('/status_check')}>給与確認</Button>
                        <Separator />
                        */}
                        <Button variant="ghost" onClick={() => router.push('/update_profile')}>情報の更新</Button>
                        <Separator />
                    </nav>
                </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-semibold text-gray-800">
                {getPageTitle()}
            </h1>
            {isAdmin && (
                <AdminPopover>
                    <Button variant="ghost" className={buttonClass}>
                        <GrUserAdmin className="h-6 w-6 text-gray-700" />
                    </Button>
                </AdminPopover>
            )}
        </header>
    );
};

export default Header;