import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

// Production‑ready rate limiter
export const limiter = rateLimit({
    // 30 sec
    windowMs: 30 * 1000, // 30 seconds
    limit: 5, // max per window

    standardHeaders: "draft-8",
    legacyHeaders: false,

    keyGenerator: (req: Request) => {
        const authHeader = req.headers["authorization"] || "";
        const token = authHeader.replace("Bearer ", "");

        if (token) {
            try {
                const payload: any = JSON.parse(
                    Buffer.from(token.split(".")[1], "base64").toString()
                );
                if (payload?.id) return String(payload.id);
            } catch {

            }

            // If token exists but cannot be decoded, still use a stable token-based key
            // so one bad token does not crash rate-limit internals.
            return `token:${token.slice(0, 32)}`;
        }

        // Always return a string key. Avoid passing request objects to any hash helper.
        const forwarded = req.headers["x-forwarded-for"];
        const forwardedIp = Array.isArray(forwarded)
            ? forwarded[0]
            : forwarded?.split(",")[0]?.trim();
        const clientIp =
            forwardedIp ||
            // request-ip middleware attaches this in runtime
            (req as Request & { clientIp?: string }).clientIp ||
            req.ip ||
            req.socket?.remoteAddress ||
            "unknown";

        return `ip:${clientIp}`;
    },

    handler: (
        _req: Request,
        _res: Response,
        _next: NextFunction,
        options: any
    ) => {
        _res.status(options.statusCode).json({
            success: false,
            message: `Rate limit exceeded. Try again in ${options.windowMs / 60000} minutes.`,
        });
    },
});