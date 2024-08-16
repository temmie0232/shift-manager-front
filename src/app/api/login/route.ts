import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchEmployees } from '@/lib/api';

export async function POST(request: NextRequest) {
    const { employeeId, birthday } = await request.json();

    try {
        const employees = await fetchEmployees();
        const employee = employees.find(emp => emp.id === employeeId);

        if (employee && employee.birthday === birthday) {
            const response = NextResponse.json({ success: true });
            response.cookies.set('session', employeeId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1週間
            });
            return response;
        } else {
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}