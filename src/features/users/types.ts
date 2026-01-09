export type UserRole = 'admin' | 'client_admin' | 'user';
export type UserStatus = 'active' | 'inactive';

export type UserRow = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastSeen: string; 
};

export type UserResponse = {
    items: UserRow[];
    total: number;
    page: number;
    pageSize: number;
};