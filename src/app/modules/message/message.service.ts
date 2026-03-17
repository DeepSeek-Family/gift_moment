import { JwtPayload } from 'jsonwebtoken';
import { messageQueue } from '../../../config/bullMQ.config';
import { IMessage } from './message.interface';
import { Message } from './message.model';

const sendMessageToQueue = async (payload: IMessage, user: JwtPayload) => {
  payload.sender = user.id;
  // Use a unique jobId per message to prevent duplicates
  const jobId = `chat_${payload.chatId}_msg_${payload.sender}_${Date.now()}`;

  // Add job to queue
  await messageQueue.add("sendMessage", { payload }, { jobId });

  // Return immediately (async)
  return { status: "queued", jobId };
};

const getMessageFromDB = async (id: string): Promise<IMessage[]> => {
  const messages = await Message.find({ chatId: id }).select("-__v").lean().sort({ createdAt: -1 });
  return messages;
};

export const MessageService = { sendMessageToQueue, getMessageFromDB };
