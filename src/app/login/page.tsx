import LoginForm from '@/feature/login/LoginForm';
import { fetchEmployees } from '@/lib/api';

export default async function AuthPage() {
    try {
        const employees = await fetchEmployees();
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-3/4 max-w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
                    <LoginForm employees={employees} />
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">エラー</h1>
                    <p>従業員データの取得に失敗しました。後でもう一度お試しください。</p>
                </div>
            </div>
        );
    }
}