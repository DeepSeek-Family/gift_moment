import { JwtPayload } from 'jsonwebtoken';
import { messageQueue } from '../../../config/bullMQ.config';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import QueryBuilder from '../../builder/queryBuilder';
import { Chat } from '../chat/chat.model';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';

const sendMessageToQueue = async (payload: IMessage, user: JwtPayload) => {
  payload.sender = user.id;
  // Use a unique jobId per message to prevent duplicates
  const jobId = `chat_${payload.chatId}_msg_${payload.sender}_${Date.now()}`;

  // Add job to queue
  await messageQueue.add("sendMessage", { payload }, { jobId });
  console.log(`📥 Message queued → JobID: ${jobId}`);
  // Return immediately (async)
  return { status: "queued" };
};
// TODO: need to add authorizer error handling
const getMessageFromDB = async (id: string, query: Record<string, unknown>, user: JwtPayload) => {
  const chat = await Chat.findById(id).lean();
  if (!chat) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Chat not found!");
  }
  console.log("\n \n \n ", user.id);
  if (!chat.participants.some((p) => p.toString() === user.id)) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to access this chat!"
    );
  }
  const qb = new QueryBuilder(Message.find({ chatId: id }), query).fields().sort().paginate();
  const [messages, meta] = await Promise.all([
    qb.modelQuery.exec(),
    qb.getPaginationInfo(),
  ]);
  return {
    messages,
    meta,
  }
};

export const MessageService = { sendMessageToQueue, getMessageFromDB };
