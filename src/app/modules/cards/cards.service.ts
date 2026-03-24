import { JwtPayload } from 'jsonwebtoken';
import {  ICards } from './cards.interface';
import { Cards } from './cards.model';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';
import QueryBuilder from '../../builder/queryBuilder';


/**
 *This functions for create a card for dashboard.
 *
 * @param {JwtPayload} user
 * @param {ICards} payload
 * @return {*} { status: "success" | "failed", data: ICards | null }
 */
const createCardsIntoDB = async (user: JwtPayload, payload: ICards) => {
    payload.isAdmin = user.id;
    const [isAdmin] = await Promise.all([
        User.findById(payload.isAdmin),
    ]);
    if (payload.isFree === false && payload.price === 0 || payload.price < 0) {
        return {
            status: "price_error",
            message: "Price cannot be negative or zero if it's is not free",
        } as const
    }
    if (isAdmin?.role !== USER_ROLES.SUPER_ADMIN) {
        return {
            status: "unauthorized",
        } as const
    }
    const result = await Cards.create(payload);
    if (!result) {
        return {
            status: "failed",
        } as const
    }
    return result;
}
/**
 *This functions for show all active cards for dashboard.
 *
 * @param {Record<string, any>} query
 * @return {*} { status: "success" | "failed", data: ICards[] | null }
 */
const getAllFilesFromDB = async (query: Record<string, any>) => {
    const result = await Cards.find({
        type: query.type
    });
    return result ? result : [];
}


/**
 *This functions for update a card for dashboard.
 *
 * @param {string} id
 * @param {JwtPayload} user
 * @param {Partial<ICards>} payload
 * @return {*} { status: "success" | "failed", data: ICards | null }
 */

const updateCardsIntoDB = async (id: string, user: JwtPayload, payload: Partial<ICards>) => {
    const admin = await User.findById(user.id);
    if (admin?.role !== USER_ROLES.SUPER_ADMIN) {
        return {
            status: "unauthorized",
        } as const
    }
    const result = await Cards.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!result) {
        return {
            status: "failed",
        } as const
    }
    return result;
}

/**
 *This functions for delete a card for dashboard.
 *
 * @param {string} id
 * @param {JwtPayload} user
 * @return {*} { status: "success" | "failed", data: ICards | null }
 */
const deleteCardsFromDB = async (id: string, user: JwtPayload) => {
    const admin = await User.findById(user.id);
    if (admin?.role !== USER_ROLES.SUPER_ADMIN) {
        return {
            status: "unauthorized",
        } as const
    }
    const result = await Cards.findByIdAndDelete(id);
    if (!result) {
        return {
            status: "failed",
        } as const
    }
    return result;
}


/**
 *This functions for show all cards based on occasion for app.
 *
* @param {string} occasionId
* @param {Record<string, any>} query
* @return {*} { data: ICards[] | null, pagination: { page: number, limit: number, totalPage: number, total: number } }
*/


const getAllCardBasedOnOccasionFromDB = async (id: string, query: Record<string, any>) => {
    const qb = new QueryBuilder(Cards.find({ occasionId: id, isActive: 'active', type: query.type }), query);
    qb.filter()
    qb.sort()
    qb.paginate()
    qb.populate(['occasionId'], { "occasionId.name": 1 })
    const [result, paginationInfo] = await Promise.all([
        qb.modelQuery.exec(),
        qb.getPaginationInfo(),
    ]);
    return {
        data: result || [],
        pagination: paginationInfo,
    };
}



export const CardsServices = {
    createCardsIntoDB,
    getAllFilesFromDB,
    updateCardsIntoDB,
    deleteCardsFromDB,
    getAllCardBasedOnOccasionFromDB
}
