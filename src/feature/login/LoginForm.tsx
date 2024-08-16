'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/types/employee';

interface LoginFormProps {
    employees: Employee[];
}

const LoginForm: React.FC<LoginFormProps> = ({ employees }) => {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [birthday, setBirthday] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: selectedEmployee, birthday }),
            });

            if (response.ok) {
                router.push('/dashboard');
            } else {
                console.error('Login failed');
                // エラーハンドリングを実装（例：エラーメッセージの表示）
            }
        } catch (error) {
            console.error('Error during login', error);
            // エラーハンドリングを実装（例：ネットワークエラーメッセージの表示）
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">ユーザー</label>
                <Select onValueChange={setSelectedEmployee}>
                    <SelectTrigger id="user-type">
                        <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
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
    );
};

export default LoginForm;