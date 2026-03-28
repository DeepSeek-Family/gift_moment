import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../../builder/queryBuilder";
import { User } from "../../user/user.model";
import { IUser } from "../../user/user.interface";

const getAllUserListFromDB = async (query: Record<string, any>, user: JwtPayload) => {
    const qb = new QueryBuilder(User.find().lean(), query).fields().sort().paginate();
    const [result, meta] = await Promise.all([qb.modelQuery, qb.getPaginationInfo()]);
    return { result, meta };
}

const getSingleUserFromDB = async (id: string) => {
    const user = await User.findById(id).select('-password').lean();
    return user;
}
const banTheUserAsAdmin = async (id: string , payload: Partial<IUser>) => {
    const user = await User.findByIdAndUpdate(id, payload, { new: true }).select('-password').lean();
    return user;
}


export const UserManagementService = {
    getAllUserListFromDB,
    getSingleUserFromDB,
    banTheUserAsAdmin
}