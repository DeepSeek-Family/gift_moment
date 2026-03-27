import { IMessage } from '../message/message.interface';
import { Message } from '../message/message.model';
import { IChat } from './chat.interface';
import { Chat } from './chat.model';

const createChatToDB = async (payload: any, currentUserId: string): Promise<IChat> => {
    const isExistChat: IChat | null = await Chat.findOne({
        participants: { $all: payload },
    }).populate({
        path: 'participants',
        select: 'name email profile',
    });

    if (isExistChat) {
        const partnersData = isExistChat.participants.filter(
            (participant: any) => participant._id.toString() !== currentUserId
        );
        return {
            // @ts-ignore
            ...isExistChat.toObject(),
            participants: partnersData,
        };
    }

    const chat: IChat = await Chat.create({ participants: payload });
    const populatedChat = await Chat.findById((chat as any)._id).populate({
        path: 'participants',
        select: 'name email profile',
    });

    const partnersData = populatedChat?.participants.filter(
        (participant: any) => participant._id.toString() !== currentUserId
    );

    return {
        ...populatedChat?.toObject(),
        // @ts-ignore
        participants: partnersData || [],
    };
};

const getChatFromDB = async (user: any, search: string): Promise<IChat[]> => {
    const chats: any = await Chat.find({ participants: { $in: [user.id] } })
        .populate({
            path: 'participants',
            select: 'name email profile',
        })
        .select('participants status');

    // Filter participants to exclude the current user and apply search if provided
    const filteredChats = chats
        .map((chat: any) => {
            const otherParticipants = chat.participants.filter(
                (p: any) =>
                    p._id.toString() !== user.id &&
                    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
            );

            return {
                ...chat.toObject(),
                participants: otherParticipants,
            };
        })
        .filter((chat: any) => chat.participants.length > 0); // Remove chats with no other participants

    // Attach lastMessage
    const chatList: IChat[] = await Promise.all(
        filteredChats.map(async (chat: any) => {
            const lastMessage: IMessage | null = await Message.findOne({ chatId: chat._id })
                .sort({ createdAt: -1 })
                .select('text offer createdAt sender');

            return {
                ...chat,
                lastMessage: lastMessage || null,
            };
        })
    );

    return chatList;
};

export const ChatService = { createChatToDB, getChatFromDB };