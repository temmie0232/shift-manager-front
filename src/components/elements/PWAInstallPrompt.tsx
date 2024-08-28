"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from "@/components/ui/alert-dialog";

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                setDeferredPrompt(null);
            });
        } else {
            alert('このアプリは既にインストールされているか、インストールできない環境です。');
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>アプリのインストール</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">安全性について</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>PWAの安全性について</AlertDialogTitle>
                            <AlertDialogDescription>
                                <p>PWA（Progressive Web App）は、通常のアプリとは異なる安全な仕組みでインストールされます：</p>
                                <ul className="list-disc pl-5 mt-2">
                                    <li>ウイルス感染のリスクが極めて低い</li>
                                    <li>ブラウザのサンドボックス内で動作し、システムへの直接アクセスが制限される</li>
                                    <li>HTTPS通信により、データの傍受や改ざんのリスクが低減</li>
                                    <li>アプリストアを介さずに、常に最新版を利用可能</li>
                                </ul>
                                <p className="mt-2">安心してインストールしていただけます。</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogCancel>閉じる</AlertDialogCancel>
                    </AlertDialogContent>
                </AlertDialog>
                <Button onClick={handleInstall}>インストール</Button>
            </CardContent>
        </Card>
    );
};

export default PWAInstallPrompt;