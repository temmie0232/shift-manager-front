import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IoReorderThree } from 'react-icons/io5';
import { GrUserAdmin } from 'react-icons/gr';
import { FaUserCircle } from 'react-icons/fa';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminPopover from '../elements/AdminPopover';
import { Separator } from '../ui/separator';

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        const checkUserStatus = () => {
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setIsAdmin(userData.employee_type === 1);
                setUserName(userData.name);
            }
        };

        checkUserStatus();
        window.addEventListener('storage', checkUserStatus);

        return () => {
            window.removeEventListener('storage', checkUserStatus);
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

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsSheetOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 flex flex-col bg-white bg-opacity-90 backdrop-blur-sm shadow-md z-50 rounded-b-2xl">
            <div className="flex justify-between items-center px-4 py-3">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className={buttonClass}>
                            <IoReorderThree className="h-6 w-6 text-gray-700" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="flex flex-col space-y-1">
                            <Card className="m-2 mt-10 mb-6 bg-gray-100">
                                <CardContent className="flex items-center p-2">
                                    <FaUserCircle className="text-gray-600 text-2xl mr-2" />
                                    <span className="text-sm font-medium">{userName}</span>
                                </CardContent>
                            </Card>
                            <Separator />
                            <Button variant="ghost" onClick={() => handleNavigation('/schedule')}>スケジュール確認</Button>
                            <Separator />
                            <Button variant="ghost" onClick={() => handleNavigation('/shift_request')}>希望シフト提出</Button>
                            <Separator />
                            <Button variant="ghost" onClick={() => handleNavigation('/preset_creation')}>パターンの作成</Button>
                            <Separator />
                            <Button variant="ghost" onClick={() => handleNavigation('/update_profile')}>情報の更新</Button>
                            <Separator />
                        </nav>
                    </SheetContent>
                </Sheet>
                <h1 className="text-2xl font-semibold text-gray-800">
                    {getPageTitle()}
                </h1>
                {isAdmin ? (
                    <AdminPopover>
                        <Button variant="ghost" className={buttonClass}>
                            <GrUserAdmin className="h-6 w-6 text-gray-700" />
                        </Button>
                    </AdminPopover>
                ) : (
                    <div className={`${buttonClass} opacity-0 cursor-default`}>
                        <GrUserAdmin className="h-6 w-6" />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;