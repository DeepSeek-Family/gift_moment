import { z } from 'zod';

const createPackageZodSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "Title is required" }),
        paymentType: z.enum(["Monthly", "Yearly"], { required_error: "Payment type is required" }),
        packageType: z.enum(["recommended", "standard"], { required_error: "Package type is required" }),
        price: z
            .union([z.string(), z.number()])
            .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
            .refine((val) => !isNaN(val), { message: "Price must be a valid number." }),
        duration: z.enum(["1 month", "1 year"], { required_error: "Duration is required" }),
        moneySaved: z.number({ required_error: "Money saved is required" }).min(0, "Money saved cannot be negative").optional(),
        feature: z.array(z.string(), { required_error: "Feature is required" }),
    })
});

export const PackageValidation = {
    createPackageZodSchema,
};
