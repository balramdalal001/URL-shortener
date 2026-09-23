export interface userCreateRes {
  message: string;
}

export interface UsrRow {
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
}

export interface UserLoginRow {
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
}

export type UserCreateRes = {
  message: string;
};

export type UserLoginRes = {
  id: string;
  email: string;
  message: string;
};


export type UserDetailRes = {
  id: string;
  email: string;
};