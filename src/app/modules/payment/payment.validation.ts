import { Types } from 'mongoose';
import { z } from 'zod';



const createPaymentZodSchema = z.object({
    amount: z.number().positive(),
    giftId: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid gift ID",
    }),
    user: z.string().refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid user ID",
    }),
    trxId: z.string(),
    status: z.enum(["pending", "success", "failed"]).default("pending"),

});

export const PaymentValidations = {
    createPaymentZodSchema
};