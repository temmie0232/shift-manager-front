"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/types/employee';
import { login, updateUserInfo } from '@/lib/api';
import UserInfoDialog from '@/components/elements/UserInfoDialog';

interface LoginFormProps {
    employees: Employee[];
}

const LoginForm: React.FC<LoginFormProps> = ({ employees }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [birthday, setBirthday] = useState('');
    const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEmployeeId) return;

        try {
            const { employee, token } = await login(selectedEmployeeId, birthday);
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(employee));

            if (!employee.hourly_wage || !employee.skills) {
                setShowUserInfoDialog(true);
            } else {
                router.push('/schedule');
            }
        } catch (error) {
            console.error('Login failed', error);
            // Handle login error (e.g., show error message)
        }
    };

    const handleUserInfoSubmit = async (data: { hourlyWage: number; skills: string[] } | null) => {
        if (data) {
            try {
                await updateUserInfo(data.hourlyWage, data.skills);
                router.push('/schedule');
            } catch (error) {
                console.error('Failed to update user info', error);
                // Handle error (e.g., show error message)
            }
        }
        setShowUserInfoDialog(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">ユーザー</label>
                    <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
                        <SelectTrigger id="user-type">
                            <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                    {employee.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">誕生日を入力 (例: 0521)</label>
                    <Input
                        id="birthday"
                        type="text"
                        placeholder="mmdd"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        maxLength={4}
                    />
                </div>
                <Separator className='my-2' />
                <Button type="submit" className="w-full">ログイン</Button>
            </form>
            <UserInfoDialog isOpen={showUserInfoDialog} onClose={handleUserInfoSubmit} />
        </>
    );
};

export default LoginForm;