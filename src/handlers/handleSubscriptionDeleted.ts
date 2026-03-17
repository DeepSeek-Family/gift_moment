
import Stripe from 'stripe';
import stripe from '../config/stripe';
import { Subscription } from '../app/modules/subscription/subscription.model';
import { User } from '../app/modules/user/user.model';
export const handleSubscriptionDeleted = async (data: Stripe.Subscription) => {

    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(data.id);

    // Find the current active subscription
    const userSubscription = await Subscription.findOne({
        customerId: subscription.customer,
        status: 'active',
    });

    if (userSubscription) {

        // Deactivate the subscription
        await Subscription.findByIdAndUpdate(
            userSubscription._id,
            { status: 'deactivated' },
            { new: true }
        );

        // Find the user associated with the subscription
        const existingUser = await User.findById(userSubscription?.user);

        if (existingUser) {
            await User.findByIdAndUpdate(
                existingUser._id,
                { hasAccess: false },
                { new: true },
            );
        } else {
            console.log(`User with ID: ${userSubscription?.user} not found!`);
        }
    } else {
        console.log(`Active subscription for customer ID: ${subscription.customer} not found!`);
    }
}