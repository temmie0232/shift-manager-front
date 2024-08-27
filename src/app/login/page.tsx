"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/feature/login/LoginForm';
import { fetchEmployees } from '@/lib/api';
import { checkAutoLogin } from '@/lib/auth';
import { Employee } from '@/types/employee';
import { Badge } from "@/components/ui/badge";
import PWAInstallPrompt from '@/components/elements/PWAInstallPrompt';

// パッケージのバージョン
const VERSION = "1.1.0";

export default function AuthPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function init() {
            try {
                const autoLoginUser = await checkAutoLogin();
                if (autoLoginUser) {
                    router.push('/schedule');
                    return;
                }

                const fetchedEmployees = await fetchEmployees();
                setEmployees(fetchedEmployees);
            } catch (error) {
                console.error('Error initializing auth page:', error);
            } finally {
                setIsLoading(false);
            }
        }

        init();
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 space-y-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
                <LoginForm employees={employees} />
            </div>
            <PWAInstallPrompt />
            <Badge className="absolute bottom-4 right-4 bg-gray-200 text-gray-700">
                Version {VERSION}
            </Badge>
        </div>
    );
}