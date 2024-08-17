"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/types/employee';
import { login } from '@/lib/api';

// LoginFormPropsインターフェースを定義し、コンポーネントのプロップの型を指定します。
interface LoginFormProps {
    employees: Employee[]; // Employee型の配列。ログイン可能なユーザーのリストを表します。
}

// LoginFormコンポーネントを定義します。React.FCはFunctional Componentの略です。
const LoginForm: React.FC<LoginFormProps> = ({ employees }) => {
    // useState フックを使用して、コンポーネントの状態を管理します。
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [birthday, setBirthday] = useState('');

    // useRouter フックを使用して、プログラムによるナビゲーションを可能にします。
    const router = useRouter();

    // フォーム送信時の処理を定義
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // フォームのデフォルトの送信動作を防ぐ

        if (!selectedEmployeeId) return; // 従業員が選択されていない場合、処理を中断

        try {
            const { employee, token } = await login(selectedEmployeeId, birthday);
            // Here you might want to save the token and employee info in a global state or local storage
            console.log('Login successful', employee);
            router.push('/schedule');
        } catch (error) {
            console.error('Login failed', error);
            // ログインエラー時の処理
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">ユーザー</label>
                {/* Select コンポーネントを使用して、従業員リストを表示 */}
                <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
                    <SelectTrigger id="user-type">
                        <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* employees配列をマップして、各従業員のSelectItemを生成 */}
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
                {/* 誕生日の入力フィールドを表示 */}
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
            {/* 送信ボタン*/}
            <Button type="submit" className="w-full">ログイン</Button>
        </form>
    );
};

export default LoginForm;