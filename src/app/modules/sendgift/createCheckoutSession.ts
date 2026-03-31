
import config from "../../../config";
import stripe from "../../../config/stripe";
import { SendGift } from "./sendgift.model";


export const isPaidCard = (card: any): boolean => {
    return card?.isFree !== true && card?.price > 0;
};

// ──────────────── Stripe Checkout ────────────────

export const createCheckoutSession = async (
    card: any,
    gift: any,
    sender: any,
    receiver: any,
    message?: string
) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: Math.round(card.price * 100),
                        product_data: {
                            name: "Gift Card",
                            description: message ?? "Gift Card Purchase",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                giftId: gift._id.toString(),
                senderId: sender?._id?.toString() ?? "",
                receiverId: receiver?._id?.toString() ?? "",
            },
            success_url: config.stripe.checkoutSuccess,
            cancel_url: config.stripe.checkoutCancel,
        });
        return session;
    } catch (error) {
        await SendGift.findByIdAndDelete(gift._id);
        console.log(`Failed to create checkout session: ${error}`);
    }
};
