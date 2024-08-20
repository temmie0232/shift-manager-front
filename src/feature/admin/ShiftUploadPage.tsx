"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadShiftFiles } from '@/lib/api';

const ShiftUploadPage: React.FC = () => {
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setPdfFiles(Array.from(files));
        }
    };

    const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setCsvFile(files[0]);
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
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: `Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}` });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Shift Files</h1>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="pdf-files">PDF Files</Label>
                    <Input
                        id="pdf-files"
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={handlePdfFileChange}
                        disabled={uploading}
                    />
                </div>
                <div>
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={handleCsvFileChange}
                        disabled={uploading}
                    />
                </div>
                <Button onClick={handleUpload} disabled={uploading || (pdfFiles.length === 0 && !csvFile)}>
                    {uploading ? 'Uploading...' : 'Upload Files'}
                </Button>
                {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default ShiftUploadPage;