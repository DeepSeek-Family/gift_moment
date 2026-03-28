import { Cards } from "../cards/cards.model";
import { User } from "../user/user.model";
import { ISendGift } from "./sendgift.interface";

export const fetchGiftEntities = async (payload: ISendGift) => {
    const [card, sender, receiver] = await Promise.all([
        Cards.findById(payload.cardId),
        User.findById(payload.senderId),
        User.findOne({ email: payload.receiverEmail }),
    ]);
    return { card, sender, receiver };
};

export const isPaidCard = (card: any): boolean => {
    return card?.isFree !== true && card?.price > 0;
};