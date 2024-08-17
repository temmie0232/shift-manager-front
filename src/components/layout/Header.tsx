"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IoReorderThree } from 'react-icons/io5';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

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
                    <nav className="flex flex-col space-y-4">
                        <Button variant="ghost" onClick={() => router.push('/schedule')}>スケジュール確認</Button>
                        <Button variant="ghost" onClick={() => router.push('/shift_request')}>希望シフト提出</Button>
                        <Button variant="ghost" onClick={() => router.push('/preset_creation')}>パターンの作成</Button>
                        <Button variant="ghost" onClick={() => router.push('/chat')}>チャット</Button>
                        <Button variant="ghost" onClick={() => router.push('/status_check')}>給与確認</Button>
                    </nav>
                </SheetContent>
            </Sheet>
            <h1 className="text-2xl font-semibold text-gray-800">
                {getPageTitle()}
            </h1>
            <div></div>
        </header>
    );
};

export default Header;