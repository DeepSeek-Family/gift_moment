import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import keyGeneratorIpFallback from "express-rate-limit";


// Production-ready limiter
export const limiter = rateLimit({
    // For Production
    //   windowMs: 15 * 60 * 1000, // 15 minutes
    //   max: 1000, // max requests per window per key
    // For Development
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // max requests per window per key
    standardHeaders: true,
    legacyHeaders: false,

    // Key generator: prefer user id, fallback to IP
    keyGenerator: (req, _res) => {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace("Bearer ", "");

        if (token) {
            try {
                const payload: any = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
                if (payload?.id) return payload.id; // user-id for logged-in users
            } catch (err: any) {
                console.warn("Invalid JWT in rate limiter:", err.message);
            }
        }

        // fallback for IP → IPv6 safe
        return keyGeneratorIpFallback(req as any);
    },

    handler: (_req: Request, _res: Response, _next: NextFunction, options: any) => {
        _res.status(options?.statusCode || 429).json({
            success: false,
            message: `Rate limit exceeded. Try again in ${options.windowMs / 60000} minutes.`,
        });
    },
});