import { z } from 'zod';


const createOccasionsSchema = z.object({
    body: z.object({
        image: z.string().nonempty('Image is required'),
        name: z.string().nonempty('Name is required'),
        isAdmin: z.string().nonempty('Admin ID is required'),
    }).strict(),
});

const updateOccasionsSchema = z.object({
    body: z.object({
        image: z.string().nonempty('Image is required').optional(),
        name: z.string().nonempty('Name is required').optional(),
    }).strict(),
});


export const OccasionsValidations = {
    createOccasionsSchema,
    updateOccasionsSchema
};
