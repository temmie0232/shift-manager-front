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
                            利便性を高めるために、インストールを推奨します。
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
                <AlertDialogContent className="max-w-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>PWAの安全性とインストールについて</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <p>
                                このアプリはPWA（Progressive Web App）として実装されており、通常のネイティブアプリと比較してより安全にご利用いただけます。
                            </p>

                            <h3 className="font-semibold">PWAの安全性とインストールの仕組み</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>インストールに関して：</strong> PWAは通常のダウンロードとは異なる仕組みでインストールされます。ファイルを直接ダウンロードせず、ウェブブラウザを通じて機能するため、ウイルス感染のリスクが非常に低くなっています。
                                </li>
                                <li>
                                    <strong>ブラウザベースの動作：</strong> PWAを「インストール」する際、実際にはアプリのアイコンや設定がホーム画面に追加され、アプリのデータがキャッシュされるだけです。これはブラウザ内で動作するため、システムに直接影響を与えることはありません。
                                </li>
                                <li>
                                    <strong>制限されたシステムアクセス：</strong> ネイティブアプリと異なり、PWAはシステム全体へのアクセスが制限されており、セキュリティが強化されています。
                                </li>
                                <li>
                                    <strong>暗号化された通信：</strong> PWAはHTTPS通信を使用しているため、すべてのデータのやり取りが暗号化されています。これにより、データの傍受や改ざんのリスクが大幅に低減されます。
                                </li>
                            </ul>

                            <h3 className="font-semibold">追加のセキュリティ対策</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>JWT（JSON Web Token）認証：</strong> ログイン後の認証にJWTを使用し、セッションの安全性を高め、なりすましのリスクを軽減しています。
                                </li>
                                <li>
                                    <strong>安全なデータストレージ：</strong> ローカルおよびサーバー側での重要なデータの保存には、適切な暗号化を使用しています。
                                </li>
                            </ul>

                            <p>
                                これらの実装で、当アプリはネイティブアプリと同等以上の機能性を提供しながら、より高い安全性を確保しています。PWAをインストールすることでウイルスに感染するリスクは、通常のアプリのダウンロードに比べてほとんどないと言えます。
                            </p>
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