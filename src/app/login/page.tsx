import AuthForm from '@/feature/login/LoginForm';
import { fetchEmployees } from '@/lib/api';

export default async function AuthPage() {
    const employees = await fetchEmployees();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-3/4 max-w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
                <AuthForm employees={employees} />
            </div>
        </div>
    );
}