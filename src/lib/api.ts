import { Employee } from '@/types/employee';
import { Preset, PresetBackend } from '@/types/preset';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let authToken: string | null = null;

export function setAuthToken(token: string) {
    authToken = token;
}

function getHeaders() {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function login(employeeId: string, birthday: string): Promise<{ employee: Employee; token: string }> {
    console.log('Attempting login with:', { employeeId, birthday }); // Debug log

    const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, birthday }),
        credentials: 'include',
    });

    console.log('Login response status:', response.status); // Debug log

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error:', errorData); // Debug log
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful, received data:', data); // Debug log

    setAuthToken(data.token);

    // Determine if this is the first login
    const isFirstLogin = !data.employee.hourly_wage || !data.employee.skills || data.employee.skills.length === 0;

    // Store user data in localStorage with isFirstLogin
    const userData = { ...data.employee, isFirstLogin };
    localStorage.setItem('userData', JSON.stringify(userData));

    return { ...data, employee: userData };
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
    const presets: PresetBackend[] = await response.json();
    return presets.map(preset => ({
        ...preset,
        startTime: formatTime(preset.start_time),
        endTime: formatTime(preset.end_time)
    }));
}

function formatTime(time: string): string {
    return time;
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
        const errorData = await response.json();
        console.error('Failed to load temporary shift request:', errorData);
        return null;
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

export async function uploadShiftFiles(pdfFiles: File[], csvFile: File | null): Promise<void> {
    const formData = new FormData();

    pdfFiles.forEach((file, index) => {
        formData.append(`pdf_files[${index}]`, file);
    });

    if (csvFile) {
        formData.append('csv_file', csvFile);
    }

    const headers = getHeaders();
    delete headers['Content-Type']; // Let the browser set the correct content type for FormData

    const response = await fetch(`${apiUrl}/api/admin/upload_shift`, {
        method: 'POST',
        headers: headers,
        body: formData,
        credentials: 'include',
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            console.error('Upload error:', errorData);
            throw new Error(errorData.error || 'Failed to upload shift files');
        } else {
            const errorText = await response.text();
            console.error('Upload error (non-JSON):', errorText);
            throw new Error('Server error occurred');
        }
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);
}

export async function updateUserInfo(hourlyWage: number, skills: string[]): Promise<void> {
    const response = await fetch(`${apiUrl}/api/user/update_info`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ hourly_wage: hourlyWage, skills }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user info');
    }
}

export async function downloadShift(): Promise<void> {
    try {
        const response = await fetch(`${apiUrl}/api/download_shift`, {
            headers: getHeaders(),
            credentials: 'include',
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'current_shift.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            throw new Error('Failed to download shift');
        }
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
}
export async function saveShiftDeadline(deadline: number): Promise<void> {
    const response = await fetch(`${apiUrl}/api/admin/shift_deadline`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ deadline }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save shift deadline');
    }
}

export async function getShiftDeadline(): Promise<number> {
    const response = await fetch(`${apiUrl}/api/admin/shift_deadline`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get shift deadline');
    }
    const data = await response.json();
    return data.deadline;
}
export async function uploadCurrentMonthShift(pdfFile: File | null, csvFile: File | null): Promise<void> {
    await uploadShift('current', pdfFile, csvFile);
}

export async function uploadNextMonthShift(pdfFile: File | null, csvFile: File | null): Promise<void> {
    await uploadShift('next', pdfFile, csvFile);
}

async function uploadShift(type: 'current' | 'next', pdfFile: File | null, csvFile: File | null): Promise<void> {
    const formData = new FormData();

    if (pdfFile) {
        formData.append('pdf_file', pdfFile);
    }

    if (csvFile) {
        formData.append('csv_file', csvFile);
    }

    const headers = getHeaders();
    delete headers['Content-Type']; // Let the browser set the correct content type for FormData

    const endpoint = type === 'current' ? 'upload_current_month_shift' : 'upload_next_month_shift';
    const response = await fetch(`${apiUrl}/api/admin/${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: formData,
        credentials: 'include',
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            console.error('Upload error:', errorData);
            throw new Error(errorData.error || 'Failed to upload shift files');
        } else {
            const errorText = await response.text();
            console.error('Upload error (non-JSON):', errorText);
            throw new Error('Server error occurred');
        }
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);
}


export async function getSubmittedShift(date: string): Promise<{
    shiftData: { [key: string]: { startTime: string, endTime: string, color?: string } };
    minWorkHours: number | null;
    maxWorkHours: number | null;
} | null> {
    const response = await fetch(`${apiUrl}/api/shift_requests/submitted?date=${date}`, {
        headers: getHeaders(),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch submitted shift');
    }
    return response.json();
}