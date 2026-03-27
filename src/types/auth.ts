import { USER_ROLES } from "../enums/user";

export type IVerifyEmail = {
    email: string;
    oneTimeCode: number;
};

export type ILoginData = {
    email: string;
    password: string;
};

export type IAuthResetPassword = {
    newPassword: string;
    confirmPassword: string;
};

export type IChangePassword = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};


export type IAddNewUserAsAdmin = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: USER_ROLES;
    verified: boolean;
};