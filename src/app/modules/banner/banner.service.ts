import { JwtPayload } from "jsonwebtoken";
import { IBanner } from "./banner.interface";
import { BannerModel } from "./banner.model";
import { USER_ROLES } from "../../../enums/user";

const createBannerToDB = async (user: JwtPayload, bannerData: IBanner) => {
    if (user.role != USER_ROLES.SUPER_ADMIN) {
        return {
            status: "Unauthorized",
        } as const
    }
    const result = await BannerModel.create({ ...bannerData, isAdmin: user.id });
    if (!result) {
        return {
            status: "Failed",
        } as const
    }
    return result;
}



const getAllBannerFromDB = async () => {
    const result = await BannerModel.find({
        status: "active"
    });
    return result ? result : [];
}


const getAllBannerFromDBByAdmin = async () => {
    const result = await BannerModel.find();
    return result ? result : [];
}


const deleteBannerFromDB = async (user: JwtPayload, id: string) => {
    if (user.role != USER_ROLES.SUPER_ADMIN) {
        return {
            status: "Unauthorized",
        } as const
    }
    const result = await BannerModel.findByIdAndDelete(id);
    if (!result) {
        return {
            status: "Failed",
        } as const
    }
    return result;
}

const turnOffStatusOfBannerFromDB = async (user: JwtPayload, id: string, payload: Partial<IBanner>) => {
    if (user.role != USER_ROLES.SUPER_ADMIN) {
        return {
            status: "Unauthorized",
        } as const
    }
    const result = await BannerModel.findByIdAndUpdate(id, { status: payload.status }, { new: true, runValidators: true });
    if (!result) {
        return {
            status: "Failed",
        } as const
    }
    return result;
}



export const BannerService = {
    createBannerToDB,
    getAllBannerFromDB,
    deleteBannerFromDB,
    turnOffStatusOfBannerFromDB,
    getAllBannerFromDBByAdmin
}