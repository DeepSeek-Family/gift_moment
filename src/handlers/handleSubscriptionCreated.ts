
import Stripe from 'stripe';
import stripe from '../config/stripe';
import { User } from '../app/modules/user/user.model';
import { Package } from '../app/modules/package/package.model';
import { Subscription } from '../app/modules/subscription/subscription.model';

export const handleSubscriptionCreated = async (data: Stripe.Subscription) => {
    const subscription = await stripe.subscriptions.retrieve(data.id);
  
    const customer = (await stripe.customers.retrieve(
      subscription.customer as string
    )) as Stripe.Customer;
  
    const priceId =
      subscription.items?.data?.[0]?.price?.id ||
      (subscription as any)?.plan?.id;
  
    if (!priceId) {
      console.log(`No Stripe priceId found in subscription`);
    }
  
    if (!customer?.email) {
      console.log(`No email found for the customer!`);
    }
  
    const existingUser = await User.findOne({ email: customer.email });
  
    if (!existingUser) {
      console.log(`Invalid User!`);
    }
  
    const pricingPlan = await Package.findOne({ priceId }).lean();
  
    if (!pricingPlan) {
      console.log(`Pricing plan with Price ID: ${priceId} not found!`);
    }
  
    const currentActiveSubscription = await Subscription.findOne({
      user: existingUser?._id,
      status: "active",
    });
  
    if (currentActiveSubscription) {
      console.log(`User already has an active subscription.`);
    }
  
    const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
  
    const paymentIntentValue = invoice?.payment_intent;
    const trxId =
      typeof paymentIntentValue === "string"
        ? paymentIntentValue
        : paymentIntentValue?.id || subscription.latest_invoice?.toString() || "N/A";
  
    const amountPaid = (invoice?.total ?? 0) / 100;
  
    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  
    const remainingMs = currentPeriodEnd.getTime() - Date.now();
    const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
  
    const newSubscription = new Subscription({
      user: existingUser?._id,
      customerId: customer.id,
      package: pricingPlan?._id,
      status: "active",
      price: amountPaid,
      subscriptionId: subscription.id,
      currentPeriodStart: currentPeriodStart.toISOString(),
      currentPeriodEnd: currentPeriodEnd.toISOString(),
      trxId,
      remaining: remainingDays,
    });
  
    await newSubscription.save();
  };