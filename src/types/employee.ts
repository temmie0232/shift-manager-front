export type Employee = {
    id: string;
    name: string;
    type: string;
    birthday: string;
    hourly_wage?: number;
    skills?: string[];
    isFirstLogin?: boolean;
};