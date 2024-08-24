"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { fetchEmployees } from '@/lib/api';
import { Employee } from '@/types/employee';

const ShiftCreationPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<Date>(addMonths(new Date(), 1));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const fetchedEmployees = await fetchEmployees();
                setEmployees(fetchedEmployees);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load employees:', error);
                setError('従業員データの読み込みに失敗しました。');
                setIsLoading(false);
            }
        };

        loadEmployees();
    }, []);

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month] = event.target.value.split('-');
        setSelectedMonth(new Date(parseInt(year), parseInt(month) - 1));
    };

    const handleCreateShifts = () => {
        // TODO: Implement shift creation logic
        console.log('Creating shifts for:', format(selectedMonth, 'yyyy年MM月', { locale: ja }));
    };

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-4">シフト作成</h1>

            <Card>
                <CardHeader>
                    <CardTitle>シフト作成月の選択</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="month-select">作成するシフトの月を選択してください</Label>
                    <Input
                        id="month-select"
                        type="month"
                        value={format(selectedMonth, 'yyyy-MM')}
                        onChange={handleMonthChange}
                        className="mt-2"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>従業員一覧</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {employees.map((employee) => (
                            <div key={employee.id} className="flex items-center justify-between">
                                <span>{employee.name}</span>
                                <span className="text-sm text-gray-500">
                                    {employee.employee_type === 1 ? 'フルタイム' : 'パートタイム'}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleCreateShifts} className="w-full">
                シフトを作成
            </Button>
        </div>
    );
};

export default ShiftCreationPage;