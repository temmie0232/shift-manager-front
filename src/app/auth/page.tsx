import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { employees } from '@/data/employees';

const AuthPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-3/4">
                <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
                <form className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">ユーザー</label>
                        <Select>
                            <SelectTrigger id="user-type">
                                <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((employee, index) => (
                                    <React.Fragment key={employee.id}>
                                        <SelectItem value={employee.id}>{employee.name}</SelectItem>
                                    </React.Fragment>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">誕生日を入力 (例: 0521)</label>
                        <Input id="password" type="password" placeholder="mmdd" />
                    </div>
                    <Separator className='my-2' />
                    <Button type="submit" className="w-full">ログイン</Button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;