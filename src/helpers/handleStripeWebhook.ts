import { Request, Response } from 'express';
import Stripe from 'stripe';
import colors from 'colors';
import {
    handleAccountUpdatedEvent,
    handleSubscriptionCreated,
    handleSubscriptionDeleted,
    handleSubscriptionUpdated,
} from '../handlers';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../shared/logger';
import config from '../config';
import stripe from '../config/stripe';
import { handleCheckoutSessionCompleted, handleCheckoutSessionExpired } from '../handlers/handleCheckoutSessionCompleted';

const handleStripeWebhook = async (req: Request, res: Response) => {

    // Extract Stripe signature and webhook secret
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = config.stripe.webhookSecret as string;

    let event: Stripe.Event | undefined;

    // Verify the event signature
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error) {
        console.log(`Webhook signature verification failed. ${error}`);
    }

    // Check if the event is valid
    if (!event) {
        console.log(`Invalid event received!`);
    }

    // Extract event data and type
    const data = event?.data.object as Stripe.Subscription | Stripe.Account;
    const eventType = event?.type;

    // Handle the event based on its type
    try {
        switch (eventType) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(data as Stripe.Subscription);
                break;

            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(data as unknown as Stripe.Checkout.Session);
                break;
            case "checkout.session.expired":
                await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
                break;


            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(data as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(data as Stripe.Subscription);
                break;

            case 'account.updated':
                await handleAccountUpdatedEvent(data as Stripe.Account);
                break;

            default:
                logger.warn(colors.bgGreen.bold(`Unhandled event type: ${eventType}`));
        }
    } catch (error) {
        console.log(`Error handling event: ${error}`);
    }

    res.sendStatus(200);
};

export default handleStripeWebhook;