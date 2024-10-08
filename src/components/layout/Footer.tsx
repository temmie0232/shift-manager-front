"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MdChat } from 'react-icons/md';
import { FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HiOutlineCurrencyYen } from "react-icons/hi";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";

const Footer: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const getCurrentTab = () => {
        return pathname.slice(1);
    };

    const currentTab = getCurrentTab();

    const getIconSize = (tabName: string) => {
        return currentTab === tabName ? 30 : 26; // アイコンサイズを小さくしました
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl"> {/* 角を丸くしました */}
            <Tabs value={currentTab} className="w-full">
                <TabsList className="flex justify-around h-14 bg-transparent">
                    <TabsTrigger
                        value="schedule"
                        onClick={() => handleNavigation('/schedule')}
                        className={`flex flex-col items-center ${currentTab === 'schedule' ? 'text-zinc-950' : ''}`}
                    >
                        <FaCalendarAlt size={getIconSize('schedule')} />
                    </TabsTrigger>
                    <TabsTrigger
                        value="shift_request"
                        onClick={() => handleNavigation('/shift_request')}
                        className={`flex flex-col items-center ${currentTab === 'shift_request' ? 'text-zinc-950' : ''}`}
                    >
                        <FaEdit size={getIconSize('shift_request')} />
                    </TabsTrigger>
                    <TabsTrigger
                        value="preset_creation"
                        onClick={() => handleNavigation('/preset_creation')}
                        className={`flex flex-col items-center ${currentTab === 'preset_creation' ? 'text-zinc-950' : ''}`}
                    >
                        <MdOutlinePublishedWithChanges size={getIconSize('preset_creation')} />
                    </TabsTrigger>
                    {/*
                    <TabsTrigger
                        value="chat"
                        onClick={() => handleNavigation('/chat')}
                        className={`flex flex-col items-center ${currentTab === 'chat' ? 'text-zinc-950' : ''}`}
                    >
                        <MdChat size={getIconSize('chat')} />
                    </TabsTrigger>
                    <TabsTrigger
                        value="status_check"
                        onClick={() => handleNavigation('/status_check')}
                        className={`flex flex-col items-center ${currentTab === 'status_check' ? 'text-zinc-950' : ''}`}
                    >
                        <HiOutlineCurrencyYen size={getIconSize('status_check')} />
                    </TabsTrigger>
                    */}
                    <TabsTrigger
                        value="update_profile"
                        onClick={() => handleNavigation('/update_profile')}
                        className={`flex flex-col items-center ${currentTab === 'update_profile' ? 'text-zinc-950' : ''}`}
                    >
                        <IoMdInformationCircleOutline size={getIconSize('update_profile')} />
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </footer>
    );
};

export default Footer;