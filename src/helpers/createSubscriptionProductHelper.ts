import { StatusCodes } from "http-status-codes";
import { IPackage } from "../app/modules/package/package.interface";
import stripe from "../config/stripe";
import ApiError from "../errors/ApiErrors";
import config from "../config";

export const createSubscriptionProduct = async (
    payload: Partial<IPackage>
): Promise<{ productId: string; paymentLink: string; priceId: string } | null> => {
    const product = await stripe.products.create({
        name: payload.title as string,
        description: payload.moneySaved
            ? `Discount: ${payload.moneySaved}%`
            : "No discount",
    });

    let interval: "month" | "year" = "month";
    let intervalCount = 1;

    switch (payload.duration) {
        case "1 month":
            interval = "month";
            intervalCount = 1;
            break;
        case "1 year":
            interval = "year";
            intervalCount = 1;
            break;
        default:
            interval = "month";
            intervalCount = 1;
    }

    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Number(payload.price) * 100,
        currency: "usd",
        recurring: { interval, interval_count: intervalCount },
    });

    if (!price?.id) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create price in Stripe");
    }

    const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
            type: "redirect",
            redirect: { url: `${config.stripe.paymentSuccess}` },
        },
        metadata: {
            productId: product.id,
            priceId: price.id,
        },
    });

    if (!paymentLink.url) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create payment link");
    }

    return {
        productId: product.id,
        priceId: price.id,
        paymentLink: paymentLink.url,
    };
};