"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

const PWAPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPrompt(false);
        }
    }, []);

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                setDeferredPrompt(null);
                setShowPrompt(false);
            });
        }
    };

    if (!showPrompt) return null;

    return (
        <>
            <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>アプリをインストール</DialogTitle>
                        <DialogDescription>
                            より良いエクスペリエンスのために、このアプリをホーム画面に追加しませんか？
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <Button variant="outline" onClick={() => setShowSecurityInfo(true)}>
                            安全性について
                        </Button>
                        <Button variant="outline" onClick={() => setShowPrompt(false)}>
                            後で
                        </Button>
                        <Button onClick={handleInstall}>
                            インストール
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showSecurityInfo} onOpenChange={setShowSecurityInfo}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>アプリの安全性について</AlertDialogTitle>
                        <AlertDialogDescription>
                            当アプリは、ユーザーの皆様のデータとプライバシーを最優先に考え、以下のセキュリティ対策を実施しています：

                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>
                                    <strong>HTTPS通信</strong>
                                    <ul className="list-circle pl-5">
                                        <li>すべての通信は暗号化されたHTTPS接続を使用しています。</li>
                                        <li>これにより、データの傍受や改ざんのリスクを最小限に抑えています。</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>JWT（JSON Web Token）認証</strong>
                                    <ul className="list-circle pl-5">
                                        <li>ログイン後の認証にJWTを使用しています。</li>
                                        <li>これにより、セッションの安全性を高め、なりすましのリスクを軽減しています。</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>データストレージの安全性</strong>
                                    <ul className="list-circle pl-5">
                                        <li>ローカルでの重要なデータの保存には、暗号化されたストレージを使用しています。</li>
                                        <li>サーバー側でのデータ保存も適切に暗号化されています。</li>
                                    </ul>
                                </li>
                            </ul>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowSecurityInfo(false)}>閉じる</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default PWAPrompt;