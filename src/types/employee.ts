export type Employee = {
    id: string;
    name: string;
    type: string;
    employee_type: number;
    birthday: string;
    hourly_wage?: number;
    skills?: string[];
    isFirstLogin?: boolean;
};