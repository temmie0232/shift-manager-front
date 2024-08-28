"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadCurrentMonthShift, uploadNextMonthShift } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaCircle, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

interface FileStatus {
    file: File | null;
    isValid: boolean;
}

const ShiftUploadPage: React.FC = () => {
    const [currentMonthFiles, setCurrentMonthFiles] = useState<{ pdf: FileStatus; csv: FileStatus }>({
        pdf: { file: null, isValid: false },
        csv: { file: null, isValid: false }
    });
    const [nextMonthFiles, setNextMonthFiles] = useState<{ pdf: FileStatus; csv: FileStatus }>({
        pdf: { file: null, isValid: false },
        csv: { file: null, isValid: false }
    });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const validateFile = (file: File, type: 'pdf' | 'csv'): boolean => {
        // ここでファイルの妥当性チェックを行う
        // 例: ファイルタイプ、サイズ、内容などをチェック
        return file.type === (type === 'pdf' ? 'application/pdf' : 'text/csv');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, monthType: 'current' | 'next', fileType: 'pdf' | 'csv') => {
        const file = e.target.files?.[0] || null;
        const isValid = file ? validateFile(file, fileType) : false;

        if (monthType === 'current') {
            setCurrentMonthFiles(prev => ({
                ...prev,
                [fileType]: { file, isValid }
            }));
        } else {
            setNextMonthFiles(prev => ({
                ...prev,
                [fileType]: { file, isValid }
            }));
        }
    };

    const handleUpload = async (type: 'current' | 'next') => {
        setUploading(true);
        setMessage(null);

        const files = type === 'current' ? currentMonthFiles : nextMonthFiles;

        try {
            if (type === 'current') {
                await uploadCurrentMonthShift(files.pdf.file, files.csv.file);
            } else {
                await uploadNextMonthShift(files.pdf.file, files.csv.file);
            }
            setMessage({ type: 'success', text: `${type === 'current' ? '今月' : '来月'}のシフトがアップロードされました！` });
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: `アップロードに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}` });
        } finally {
            setUploading(false);
        }
    };

    const renderFileInput = (type: 'pdf' | 'csv', monthType: 'current' | 'next') => {
        const files = monthType === 'current' ? currentMonthFiles : nextMonthFiles;
        const fileStatus = files[type];

        return (
            <div className="space-y-2">
                <Label htmlFor={`${monthType}-${type}-file`}>{type.toUpperCase()}ファイル</Label>
                <div className="flex flex-col items-start space-y-2">
                    <Button
                        onClick={() => document.getElementById(`${monthType}-${type}-file`)?.click()}
                        variant="outline"
                    >
                        (ファイルを選択)
                    </Button>
                    <Input
                        id={`${monthType}-${type}-file`}
                        type="file"
                        accept={`.${type}`}
                        onChange={(e) => handleFileChange(e, monthType, type)}
                        className="hidden"
                        disabled={uploading}
                    />
                    <div className="flex items-center space-x-2">
                        {fileStatus.file ? (
                            <>
                                {fileStatus.isValid ? (
                                    <FaCheckCircle className="text-green-500" />
                                ) : (
                                    <FaTimesCircle className="text-red-500" />
                                )}
                                <span className="text-sm text-gray-500">{fileStatus.file.name}</span>
                            </>
                        ) : (
                            <>
                                <FaCircle className="text-gray-500" />
                                <span className="text-sm text-gray-500">ファイルが選択されていません</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderUploadForm = (type: 'current' | 'next') => (
        <div className="space-y-4">
            {renderFileInput('pdf', type)}
            {renderFileInput('csv', type)}
            <Button
                onClick={() => handleUpload(type)}
                disabled={uploading || !(type === 'current' ? (currentMonthFiles.pdf.isValid && currentMonthFiles.csv.isValid) : (nextMonthFiles.pdf.isValid && nextMonthFiles.csv.isValid))}
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