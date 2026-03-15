import z from "zod";

const createBannerZodSchema = z.object({
    body: z.object({
        image: z.string({
            required_error: "Image is required",
        }),
    }),
})

const updateBannerZodSchema = z.object({
    body: z.object({
        image: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
    }).strict(),
})

export const BannerValidation = {
    createBannerZodSchema,
    updateBannerZodSchema,
}