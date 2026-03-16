import QueryBuilder from '../../builder/queryBuilder';
import { PaymentModel } from './payment.interface';
import { Payment } from './payment.model';



const getAllPaymentsFromDB = async () => {
    const qb = new QueryBuilder(Payment.find(), {}).fields().sort().paginate();
    const [result, paginationInfo] = await Promise.all([
        qb.modelQuery.exec(),
        qb.getPaginationInfo(),
    ]);
    return {
        data: result || [],
        pagination: paginationInfo,
    };
}
export const PaymentServices = { getAllPaymentsFromDB };
