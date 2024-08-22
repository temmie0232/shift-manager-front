"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadCurrentMonthShift, uploadNextMonthShift } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ShiftUploadPage: React.FC = () => {
    const [currentMonthPdfFile, setCurrentMonthPdfFile] = useState<File | null>(null);
    const [currentMonthCsvFile, setCurrentMonthCsvFile] = useState<File | null>(null);
    const [nextMonthPdfFile, setNextMonthPdfFile] = useState<File | null>(null);
    const [nextMonthCsvFile, setNextMonthCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpload = async (type: 'current' | 'next') => {
        setUploading(true);
        setMessage(null);

        try {
            if (type === 'current') {
                await uploadCurrentMonthShift(currentMonthPdfFile, currentMonthCsvFile);
            } else {
                await uploadNextMonthShift(nextMonthPdfFile, nextMonthCsvFile);
            }
            setMessage({ type: 'success', text: `${type === 'current' ? '今月' : '来月'}のシフトがアップロードされました！` });
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: `アップロードに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}` });
        } finally {
            setUploading(false);
        }
    };

    const renderUploadForm = (type: 'current' | 'next') => (
        <div className="space-y-4">
            <div>
                <Label htmlFor={`${type}-pdf-file`}>PDFファイル</Label>
                <Input
                    id={`${type}-pdf-file`}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => type === 'current' ? setCurrentMonthPdfFile(e.target.files?.[0] || null) : setNextMonthPdfFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                />
            </div>
            <div>
                <Label htmlFor={`${type}-csv-file`}>CSVファイル</Label>
                <Input
                    id={`${type}-csv-file`}
                    type="file"
                    accept=".csv"
                    onChange={(e) => type === 'current' ? setCurrentMonthCsvFile(e.target.files?.[0] || null) : setNextMonthCsvFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                />
            </div>
            <Button
                onClick={() => handleUpload(type)}
                disabled={uploading || (type === 'current' ? (!currentMonthPdfFile && !currentMonthCsvFile) : (!nextMonthPdfFile && !nextMonthCsvFile))}
            >
                {uploading ? 'アップロード中...' : `${type === 'current' ? '今月' : '来月'}のシフトをアップロード`}
            </Button>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">シフトアップロード</h1>
            <Tabs defaultValue="current">
                <TabsList>
                    <TabsTrigger value="current">今月のシフト</TabsTrigger>
                    <TabsTrigger value="next">来月のシフト</TabsTrigger>
                </TabsList>
                <TabsContent value="current">
                    {renderUploadForm('current')}
                </TabsContent>
                <TabsContent value="next">
                    {renderUploadForm('next')}
                </TabsContent>
            </Tabs>
            {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4">
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default ShiftUploadPage;