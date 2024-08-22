"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadShiftFiles } from '@/lib/api';
import { FaRegCircle, FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';

const ShiftUploadPage: React.FC = () => {
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [pdfStatus, setPdfStatus] = useState<'none' | 'success' | 'error'>('none');
    const [csvStatus, setCsvStatus] = useState<'none' | 'success' | 'error'>('none');
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/schedule');
    }, [router]);

    const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setPdfFiles(Array.from(files));
            setPdfStatus('success');
        } else {
            setPdfStatus('error');
        }
    };

    const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setCsvFile(files[0]);
            setCsvStatus('success');
        } else {
            setCsvStatus('error');
        }
    };

    const handleUpload = async () => {
        if (pdfFiles.length === 0 && !csvFile) {
            setMessage({ type: 'error', text: 'Please select at least one file to upload.' });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            await uploadShiftFiles(pdfFiles, csvFile);
            setMessage({ type: 'success', text: 'Files uploaded successfully!' });
            setPdfFiles([]);
            setCsvFile(null);
            setPdfStatus('none');
            setCsvStatus('none');
            setTimeout(() => {
                router.push('/schedule');
            }, 2000);
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: `Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}` });
        } finally {
            setUploading(false);
        }
    };

    const renderFileStatus = (status: 'none' | 'success' | 'error', files: File[] | File | null) => {
        switch (status) {
            case 'none':
                return (
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                        <FaRegCircle className="mr-2" />
                        <span>ファイルは選択されていません</span>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                        <FaRegCircleCheck className="mr-2 text-green-500" />
                        <span>{Array.isArray(files) ? files.map(f => f.name).join(', ') : files?.name}</span>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                        <FaRegCircleXmark className="mr-2 text-red-500" />
                        <span>ファイルの選択に失敗しました</span>
                    </div>
                );
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-8rem)]">
            <div className="space-y-4 flex-grow">
                <div>
                    <Label htmlFor="pdf-files">PDF Files</Label>
                    <div className="relative">
                        <Input
                            id="pdf-files"
                            type="file"
                            accept=".pdf"
                            multiple
                            onChange={handlePdfFileChange}
                            disabled={uploading}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                        <Button className="w-full" disabled={uploading}>ファイルを選択</Button>
                    </div>
                    {renderFileStatus(pdfStatus, pdfFiles)}
                </div>
                <div>
                    <Label htmlFor="csv-file">CSV File</Label>
                    <div className="relative">
                        <Input
                            id="csv-file"
                            type="file"
                            accept=".csv"
                            onChange={handleCsvFileChange}
                            disabled={uploading}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                        <Button className="w-full" disabled={uploading}>ファイルを選択</Button>
                    </div>
                    {renderFileStatus(csvStatus, csvFile)}
                </div>
                {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}
            </div>
            <div className="mt-auto pb-4">
                <Button
                    onClick={handleUpload}
                    disabled={uploading || (pdfFiles.length === 0 && !csvFile)}
                    className="w-full"
                >
                    {uploading ? 'Uploading...' : 'Upload Files'}
                </Button>
            </div>
        </div>
    );
};

export default ShiftUploadPage;