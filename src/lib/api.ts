import { Employee } from '@/types/employee';

export async function fetchEmployees(): Promise<Employee[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
        const response = await fetch(`${apiUrl}/api/employees`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as Employee[];
    } catch (error) {
        console.error('Failed to fetch employees:', error);
        throw error;
    }
}