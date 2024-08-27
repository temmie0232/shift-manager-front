"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveShiftDeadline, getShiftDeadline } from '@/lib/api';

const ShiftSettingPage: React.FC = () => {
    const [deadline, setDeadline] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeadline = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedDeadline = await getShiftDeadline();
                setDeadline(fetchedDeadline);
            } catch (error) {
                console.error('Failed to fetch deadline:', error);
                setError('締切日の取得に失敗しました。');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeadline();
    }, []);

    const handleSave = async () => {
        if (deadline === null) {
            setError('有効な締切日を入力してください。');
            return;
        }
        try {
            await saveShiftDeadline(deadline);
            alert('締切日が保存されました。');
        } catch (error) {
            console.error('Failed to save deadline:', error);
            setError('締切日の保存に失敗しました。');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="deadline">シフト締切日</Label>
                    <Input
                        id="deadline"
                        type="number"
                        min="1"
                        max="31"
                        value={deadline !== null ? deadline : ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            setDeadline(value === '' ? null : parseInt(value));
                        }}
                    />
                </div>
                <Button onClick={handleSave}>保存</Button>
            </div>
        </div>
    );
};

export default ShiftSettingPage;