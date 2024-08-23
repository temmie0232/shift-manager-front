"use client"
import { useState, useEffect } from 'react';

const PWAPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        });
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
        <div className="fixed bottom-16 left-0 right-0 bg-white p-4 shadow-lg">
            <p>アプリをインストールしますか？</p>
            <button onClick={handleInstall} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                インストール
            </button>
        </div>
    );
};

export default PWAPrompt;
