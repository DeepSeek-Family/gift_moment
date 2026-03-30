import { z } from 'zod';


const createSendGiftZodSchema = z.object({
    body: z.object({
        cardId: z.string({ required_error: "Card ID is required" }).min(1, "Card ID cannot be empty"),
        senderId: z.string({ required_error: "Sender ID is required" }).min(1, "Sender ID cannot be empty"),
        receiverId: z.string({ required_error: "Receiver ID is required" }).min(1, "Receiver ID cannot be empty").optional(),
        receiverEmail: z.string({ required_error: "Receiver email is required" }).email("Invalid email format").optional(),
        message: z.string().optional(),
        bookingDate: z
            .string({ required_error: "Booking date is required" })
            .refine((date) => {
                // convert DD-MM-YYYY to YYYY-MM-DD if needed
                let formatted = date;
                if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
                    const [day, month, year] = date.split("-");
                    formatted = `${year}-${month}-${day}`;
                }
                return !isNaN(new Date(formatted).getTime());
            }, { message: "Invalid booking date format" }),
        bookingTime: z
            .string({ required_error: "Booking time is required" })
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Booking time must be in HH:mm format"),
    }).refine((data) => {
        // check combined date+time is in the future
        let { bookingDate, bookingTime } = data;

        // convert DD-MM-YYYY to YYYY-MM-DD if needed
        if (/^\d{2}-\d{2}-\d{4}$/.test(bookingDate)) {
            const [day, month, year] = bookingDate.split("-");
            bookingDate = `${year}-${month}-${day}`;
        }

        const combined = new Date(`${bookingDate}T${bookingTime}`);
        return combined.getTime() >= new Date().getTime();
    }, { message: "Booking date and time must be in the future" }),
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
