"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import UserInfoDialog from '@/components/elements/UserInfoDialog';
import { updateUserInfo } from '@/lib/api';
import { logout } from '@/lib/auth';

const SKILLS = [
    { id: 'open', label: 'オープン作業', group: 'opening_closing' },
    {
        id: 'close',
        label: 'クローズ作業',
        group: 'opening_closing',
        children: [
            { id: 'cashier_close', label: 'レジ締め' },
            { id: 'cleaning', label: '洗浄' },
            { id: 'floor_cleaning', label: 'フロア清掃' },
        ]
    },
    { id: 'defrost_order', label: '解凍・発注', group: 'inventory' },
    { id: 'cashier', label: 'キャッシャー', group: 'operations' },
    { id: 'washing', label: '洗浄', group: 'operations' },
    { id: 'drinks', label: 'ドリンク', group: 'operations' },
    { id: 'food', label: 'フード', group: 'operations' },
];

const SKILL_GROUPS = {
    opening_closing: 'オープン・クローズ作業',
    inventory: '在庫管理',
    operations: '店内オペレーション'
};

const UpdateProfilePage: React.FC = () => {
    const [hourlyWage, setHourlyWage] = useState<number>(0);
    const [skills, setSkills] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'wage' | 'skills'>('wage');
    const router = useRouter();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        setHourlyWage(userData.hourly_wage || 0);
        setSkills(userData.skills || []);
    }, []);

    const handleOpenDialog = (type: 'wage' | 'skills') => {
        setDialogType(type);
        setIsDialogOpen(true);
    };

    const handleUpdateInfo = async (data: { hourlyWage: number; skills: string[] } | null) => {
        if (data) {
            try {
                await updateUserInfo(data.hourlyWage, data.skills);
                setHourlyWage(data.hourlyWage);
                setSkills(data.skills);
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                userData.hourly_wage = data.hourlyWage;
                userData.skills = data.skills;
                localStorage.setItem('userData', JSON.stringify(userData));
            } catch (error) {
                console.error('Failed to update user info', error);
            }
        }
        setIsDialogOpen(false);
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const renderSkillBadges = () => {
        return Object.entries(SKILL_GROUPS).map(([groupId, groupName]) => {
            const groupSkills = SKILLS.filter(skill => skill.group === groupId && skills.includes(skill.id));
            if (groupSkills.length === 0) return null;
            return (
                <div key={groupId} className="mb-4">
                    <h3 className="font-semibold mb-2">{groupName}</h3>
                    <div className="flex flex-wrap gap-2">
                        {groupSkills.map(skill => (
                            <div key={skill.id} className="flex flex-col">
                                <Badge variant="secondary" className="mb-1">
                                    {skill.label}
                                </Badge>
                                {skill.children && skills.includes(skill.id) && (
                                    <div className="ml-4 flex flex-col gap-1">
                                        {skill.children.map(childSkill => (
                                            skills.includes(childSkill.id) && (
                                                <Badge key={childSkill.id} variant="outline" className="text-xs">
                                                    {childSkill.label}
                                                </Badge>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>時給</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold">¥ {hourlyWage} / 時</p>
                        <Button onClick={() => handleOpenDialog('wage')}>編集</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>できる仕事</CardTitle>
                        <Button onClick={() => handleOpenDialog('skills')}>編集</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {renderSkillBadges()}
                </CardContent>
            </Card>

            <Separator />

            <div className="flex justify-center">
                <Button variant="destructive" onClick={handleLogout}>ログアウト</Button>
            </div>

            <UserInfoDialog
                isOpen={isDialogOpen}
                onClose={handleUpdateInfo}
                initialData={{ hourlyWage, skills }}
                dialogType={dialogType}
            />
        </div>
    );
};

export default UpdateProfilePage;