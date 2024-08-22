import { login } from './api';

export async function checkAutoLogin() {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');

    if (storedToken && storedUserData) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify_token`, {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid) {
                    return JSON.parse(storedUserData);
                }
            }
            // トークンが無効な場合、ストレージをクリア
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        } catch (error) {
            console.error('Auto login check failed:', error);
        }
    }

    return null;
}

export async function performLogin(employeeId: string, birthday: string) {
    const { employee, token } = await login(employeeId, birthday);

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(employee));

    return employee;
}

export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
}