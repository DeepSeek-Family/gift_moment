import { JwtPayload } from 'jsonwebtoken';
import { IOccasions, OccasionsModel } from './occasions.interface';
import { Occasions } from './occasions.model';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';
const createOccasionsIntoDB = async (user: JwtPayload, payload: IOccasions) => {
    payload.isAdmin = user.id;

    const [isAdmin, data] = await Promise.all([
        User.findById(payload.isAdmin),
        Occasions.findOne({ name: payload.name })
    ]);

    if (isAdmin?.role !== USER_ROLES.SUPER_ADMIN) {
        return {
            status: "unauthorized",
        } as const
    }
    if (data) {
        return {
            status: "duplicate",
        } as const
    }
    const result = await Occasions.create(payload);
    if (!result) {
        return {
            status: "failed",
        } as const
    }
    return result;
}

const getAllOccasionsFromDB = async () => {
    const result = await Occasions.find({
        status: 'active'
    });
    return result ? result : [];
}

const updateOccasionsIntoDB = async (id: string, payload: Partial<IOccasions>) => {
    const admin = await User.findById(payload.isAdmin);
    if (!admin) {
        return {
            status: "unauthorized",
        } as const
    }
    const result = await Occasions.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!result) {
        return {
            status: "failed",
        } as const
    }
    return result;
}

const deleteOccasionsFromDB = async (id: string) => {
    const result = await Occasions.findById(id);
    const admin = await User.findById(result?.isAdmin);
    if (!admin) {
        return {
            status: "unauthorized",
        } as const
    }
    const deletedResult = await Occasions.findByIdAndDelete(id);
    if (!deletedResult) {
        return {
            status: "failed",
        } as const
    }
    return deletedResult;
}
const getSingleOccasionsFromDB = async (id: string) => {
    const result = await Occasions.findById(id);
    return result ? result : "Not found";
}


export const OccasionsServices = {
    createOccasionsIntoDB,
    getAllOccasionsFromDB,
    updateOccasionsIntoDB,
    deleteOccasionsFromDB,
    getSingleOccasionsFromDB
}
