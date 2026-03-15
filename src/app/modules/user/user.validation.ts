import { z } from "zod";
import { USER_ROLES } from "../../../enums/user";

const createAdminZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z.string({ required_error: "Password is required" }),
    role: z.enum(Object.values(USER_ROLES) as [string, ...string[]], {
      required_error: "Role is required",
    }),
  }),
});


const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" }),
    role: z.enum(Object.values(USER_ROLES) as [string, ...string[]], {
      required_error: "Role is required",
    }),
    contact: z.string({ required_error: "Contact is required" }).optional(),
    location: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
});


export const UserValidation = { createAdminZodSchema, createUserZodSchema };
