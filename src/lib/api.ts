import { Employee } from '@/types/employee';
import { Preset } from '@/types/preset';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let authToken: string | null = null;

export function setAuthToken(token: string) {
    authToken = token;
}

function getHeaders() {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
}

export async function login(employeeId: string, birthday: string): Promise<{ employee: Employee; token: string }> {
    const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, birthday }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    setAuthToken(data.token);
    return data;
}

export async function fetchEmployees(): Promise<Employee[]> {
    try {
        const response = await fetch(`${apiUrl}/api/employees`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        return data as Employee[];
    } catch (error) {
        console.error('Failed to fetch employees:', error);
        throw error;
    }
}

export async function fetchPresets(): Promise<Preset[]> {
    const response = await fetch(`${apiUrl}/api/presets`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch presets');
    }
    return response.json();
}

export async function createPreset(preset: Omit<Preset, 'id'>): Promise<Preset> {
    const { startTime, endTime, ...rest } = preset;
    const response = await fetch(`${apiUrl}/api/presets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            preset: {
                ...rest,
                start_time: startTime,
                end_time: endTime
            }
        }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create preset');
    }
    return response.json();
}

export async function updatePreset(preset: Preset): Promise<Preset> {
    const response = await fetch(`${apiUrl}/api/presets/${preset.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(preset),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update preset');
    }
    return response.json();
}

export async function deletePreset(id: string): Promise<void> {
    const response = await fetch(`${apiUrl}/api/presets/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete preset');
    }
}

export async function fetchPreset(id: string): Promise<Preset> {
    const response = await fetch(`${apiUrl}/api/presets/${id}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch preset');
    }
    return response.json();
}

export async function saveTemporaryShiftRequest(date: string, shiftData: { [key: string]: { startTime: string, endTime: string } }, minWorkHours: number, maxWorkHours: number): Promise<void> {
    const response = await fetch(`${apiUrl}/api/shift_requests/save_temporary`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ date, shift_data: shiftData, min_work_hours: minWorkHours, max_work_hours: maxWorkHours }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save temporary shift request');
    }
}

export async function loadTemporaryShiftRequest(date: string): Promise<any> {
    const response = await fetch(`${apiUrl}/api/shift_requests/load_temporary?date=${date}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load temporary shift request');
    }
    return response.json();
}

export async function submitShiftRequest(date: string, shiftData: { [key: string]: { startTime: string, endTime: string } }, minWorkHours: number, maxWorkHours: number): Promise<void> {
    const response = await fetch(`${apiUrl}/api/shift_requests/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ date, shift_data: shiftData, min_work_hours: minWorkHours, max_work_hours: maxWorkHours }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit shift request');
    }
}