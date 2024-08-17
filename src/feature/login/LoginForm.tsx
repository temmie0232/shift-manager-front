"use client"
// このディレクティブは、このコンポーネントがクライアントサイドでレンダリングされることを示します。

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/types/employee';

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

    // フォーム送信時の処理を定義します。
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // フォームのデフォルトの送信動作を防ぎます。

        if (!selectedEmployeeId) return; // 従業員が選択されていない場合、処理を中断します。

        try {
            // 環境変数からAPIのURLを取得します。設定されていない場合はデフォルト値を使用します。
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

            // fetch APIを使用してログインリクエストを送信します。
            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: selectedEmployeeId, birthday }),
            });

            if (response.ok) {
                router.push('/dashboard'); // ログイン成功時、ダッシュボードページにリダイレクトします。
            } else {
                console.error('Login failed');
                // TODO: ユーザーへのフィードバック機能を実装する（例：エラーメッセージの表示）
            }
        } catch (error) {
            console.error('Error during login', error);
            // TODO: ネットワークエラー時のエラー処理を実装する
        }
    };

    // JSXを返します。これがコンポーネントの実際の表示内容になります。
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">ユーザー</label>
                {/* Select コンポーネントを使用して、従業員リストを表示します。 */}
                <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId}>
                    <SelectTrigger id="user-type">
                        <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* employees配列をマップして、各従業員のSelectItemを生成します。 */}
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
                {/* Input コンポーネントを使用して、誕生日の入力フィールドを表示します。 */}
                <Input
                    id="birthday"
                    type="text"
                    placeholder="mmdd"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    maxLength={4}
                />
            </div>
            {/* Separator コンポーネントを使用して、視覚的な区切り線を追加します。 */}
            <Separator className='my-2' />
            {/* Button コンポーネントを使用して、送信ボタンを表示します。 */}
            <Button type="submit" className="w-full">ログイン</Button>
        </form>
    );
};

export default LoginForm; // LoginForm コンポーネントをエクスポートします。