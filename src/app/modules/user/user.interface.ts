import { Model } from "mongoose";
import { USER_ROLES } from "../../../enums/user";
// Stripe account related sub-document


// Authentication related (OTP, password reset)
interface IAuthenticationProps {
  isResetPassword: boolean;
  oneTimeCode: number;
  expireAt: Date;
}
// Main User interface
export type IUser = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  loginWith: "email" | "google";
  role: USER_ROLES;
  contact: string;
  location: string;
  profile: string;
  verified: boolean;
  isBanned: boolean;
  authentication?: IAuthenticationProps;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
