import { z } from 'zod';



const createBookedCardZodSchema = z.object({
    body: z.object({
        bookingDate: z.string({ required_error: 'Booking date is required' }),
        bookingTime: z.string({ required_error: 'Booking time is required' }),
        cardId: z.string({ required_error: 'Card ID is required' }),
        senderId: z.string({ required_error: 'Sender ID is required' }),
        receiverId: z.string({ required_error: 'Receiver ID is required' }),
        receiverEmail: z.string({ required_error: 'Receiver email is required' }).email('Invalid email format'),
        message: z.string().optional(),
        status: z.string({ required_error: 'Status is required' }).default('booked')
    }),
});


const updateBookedCardZodSchema = z.object({
    body: z.object({
        bookingDate: z.string().optional(),
        bookingTime: z.string().optional(),
        cardId: z.string().optional(),
        senderId: z.string().optional(),
        receiverId: z.string().optional(),
        receiverEmail: z.string().email('Invalid email format').optional(),
        message: z.string().optional(),
        status: z.enum(['booked', 'cancelled']).optional()
    }),
});


export const BookedCardValidations = {
    createBookedCardZodSchema,
    updateBookedCardZodSchema
};
