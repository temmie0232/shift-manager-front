import { Employee } from "@/types/employee";

export async function fetchEmployees(): Promise<Employee[]> {
    const response = await fetch('http://your-rails-api.com/api/employees', {
        headers: {
            'Content-Type': 'application/json',
            // 必要に応じて認証ヘッダーを追加
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }

    return response.json();
}