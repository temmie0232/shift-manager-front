"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import ShiftTable from '@/feature/schedule/ShiftTable'

const Page = () => {
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/download_shift`;
        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('認証情報が見つかりません。再度ログインしてください。');
            return;
        }

        try {
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'current_shift.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'シフトのダウンロードに失敗しました');
            }
        } catch (error) {
            setError('ネットワークエラーが発生しました');
        }
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="w-full max-w-md mb-4">
                <Button
                    onClick={handleDownload}
                    className="w-full mb-4"
                >
                    <Download className="mr-2 h-4 w-4" />
                    シフトをダウンロード
                </Button>
                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
            <div className="w-full">
                <ShiftTable />
            </div>
        </div>
    )
}

export default Page