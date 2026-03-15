import { z } from 'zod';


const createSendGiftZodSchema = z.object({
    body: z.object({
        cardId: z
            .string({ required_error: "Card ID is required" })
            .min(1, "Card ID cannot be empty"),
        senderId: z
            .string({ required_error: "Sender ID is required" })
            .min(1, "Sender ID cannot be empty"),
        receiverId: z
            .string({ required_error: "Receiver ID is required" })
            .min(1, "Receiver ID cannot be empty"),
        receiverEmail: z
            .string({ required_error: "Receiver email is required" })
            .email("Invalid email format"),
        message: z.string().optional(),
        bookingDate: z
            .string({ required_error: "Booking date is required" })
            .refine(
                (date) => {
                    const today = new Date();
                    const booking = new Date(date);
                    return booking >= today;
                },
                { message: "Booking date must be today or in the future" }
            ),
        bookingTime: z
            .string({ required_error: "Booking time is required" })
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Booking time must be in HH:mm format"),
    }),
});
const updateSendGiftZodSchema = z.object({
    body: z.object({
        cardId: z.string().optional(),
        senderId: z.string().optional(),
        receiverId: z.string().optional(),
        receiverEmail: z.string().email('Invalid email format').optional(),
    }),
});
export const SendGiftValidations = { createSendGiftZodSchema, updateSendGiftZodSchema };
