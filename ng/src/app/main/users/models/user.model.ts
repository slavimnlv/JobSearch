export interface User {
    id: number;
    name: string;
    email?: string;
    password: string;
    bulgarian?: boolean;
    role?: string;
}