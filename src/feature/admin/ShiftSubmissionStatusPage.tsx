"use client"
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Employee {
    id: string;
    name: string;
    shift_submitted: boolean;
}

const ShiftSubmissionStatusPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShiftSubmissionStatus = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/shift_submission_status`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch shift submission status');
                }
                const data = await response.json();
                setEmployees(data.employees);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching shift submission status:', error);
                setError('シフト提出状況の取得に失敗しました');
                setIsLoading(false);
            }
        };

        fetchShiftSubmissionStatus();
    }, []);

    if (isLoading) {
        return <div className="p-4">読み込み中...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-2">
                    {employees.map((employee) => (
                        <Card key={employee.id}>
                            <CardContent className="flex items-center p-4">
                                {employee.shift_submitted ? (
                                    <FaCheckCircle className="text-green-500 mr-2" />
                                ) : (
                                    <FaTimesCircle className="text-red-500 mr-2" />
                                )}
                                <span>{employee.name}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ShiftSubmissionStatusPage;