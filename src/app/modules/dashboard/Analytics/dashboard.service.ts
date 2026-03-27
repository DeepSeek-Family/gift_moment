import { JwtPayload } from "jsonwebtoken";
import { Payment } from "../../payment/payment.model";
import { User } from "../../user/user.model";
import { Cards } from "../../cards/cards.model";
import { Subscription } from "../../subscription/subscription.model";



const getDashboardAnalytics = async (user: JwtPayload) => {
    const [payment, users, cards, subscribers] = await Promise.all([
        Payment.find().lean(),
        User.find().lean().countDocuments(),
        Cards.find().lean().countDocuments(),
        Subscription.find().lean()
    ]);
    const paymentAmount = payment.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSubscribersAmount = subscribers.reduce(
        (acc, curr) => acc + (curr.price || 0),
        0
    );
    const totalAmount = paymentAmount + totalSubscribersAmount;
    return {
        totalAmount,
        totalUsers: users,
        totalGift: cards,
    }
}

// user monthly progress
const getUserMonthlyProgress = async () => {
    const currentYear = new Date().getFullYear();

    const result = await User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lte: new Date(`${currentYear}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 },
            },
        },
    ]);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return monthNames.map((month, index) => {
        const found = result.find(r => r._id === index + 1);
        return {
            month,
            count: found?.count || 0,
        };
    });
};

const getSubscriptionMonthlyProgress = async () => {
    const currentYear = new Date().getFullYear();

    const result = await Subscription.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lte: new Date(`${currentYear}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$createdAt" }, // or "$startDate"
                count: { $sum: 1 },
            },
        },
    ]);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return monthNames.map((month, index) => {
        const found = result.find(r => r._id === index + 1);
        return {
            month,
            count: found?.count || 0,
        };
    });
};

// recent 4 subscribers
const getRecentSubscriber = async () => {
    const result = await Subscription.find().sort({ createdAt: -1 }).limit(4).populate('user', 'name email').populate('package', 'price').lean();
    return result || [];
}

export const DashboardServices = {
    getDashboardAnalytics,
    getUserMonthlyProgress,
    getSubscriptionMonthlyProgress,
    getRecentSubscriber
};
