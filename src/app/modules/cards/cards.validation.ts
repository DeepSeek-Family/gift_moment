import { z } from 'zod';



const createCardsSchema = z.object({
    body: z.object({
        file: z.string().nonempty('File is required'),
        isFree: z.boolean(
            { required_error: 'isFree is required' }
        ).default(false),
        price: z.number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        }).min(0, 'Price cannot be negative').default(0),
        type: z.enum(['image', 'video']),
        isAdmin: z.string().nonempty('Admin ID is required'),
        occasionId: z.string().nonempty('Occasion ID is required'),
    }).strict(),
});
const updateCardsSchema = z.object({
    body: z.object({
        file: z.string().nonempty('File is required').optional(),
        isFree: z.boolean().optional(),
        price: z.number().min(0, 'Price cannot be negative').optional(),
        type: z.enum(['image', 'video']).optional(),
        occasionId: z.string().nonempty('Occasion ID is required').optional(),
    }).strict(),
});

export const CardsValidations = {
    createCardsSchema,
    updateCardsSchema
};
