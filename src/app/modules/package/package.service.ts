import { IPackage } from "./package.interface";
import { Package } from "./package.model";
import mongoose from "mongoose";
import { createSubscriptionProduct } from "../../../helpers/createSubscriptionProductHelper";
import stripe from "../../../config/stripe";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";

const createPackageToDB = async (payload: IPackage): Promise<IPackage | null> => {
    const productPayload = {
        title: payload.title,
        duration: payload.duration,
        price: Number(payload.price),
        moneySaved: payload.moneySaved,
    };

    const product = await createSubscriptionProduct(productPayload);

    if (!product) {
        console.error("Failed to create subscription product in Stripe");
        return null;
    }

    payload.paymentLink = product.paymentLink;
    payload.productId = product.productId;
    payload.priceId = product.priceId;

    const result = await Package.create(payload);

    if (!result) {
        await stripe.products.del(product.productId);
        console.error("Failed to create package in DB");
        return null;
    }

    return result;
};

const updatePackageToDB = async (id: string, payload: IPackage): Promise<IPackage | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid package ID");
    }

    const result = await Package.findByIdAndUpdate(
        { _id: id },
        payload,
        { new: true }
    );

    if (!result) {
        console.error(`Failed to update package with ID: ${id}`);
    }

    return result;
}

// Get all packages from DB for user to see the packages
const getPackageFromDB = async (): Promise<IPackage[]> => {

    const result = await Package.find({status: "Active"}).lean();
    return result ? result : [];
}

// Get package details from DB for admin to see the package details
const getAllPackagesFromDBForAdmin = async (user: JwtPayload): Promise<IPackage[]> => {
    const result = await Package.find().lean();
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No packages found");
    }
    return result;
}

const getPackageDetailsFromDB = async (id: string): Promise<IPackage | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid package ID");
        return null;
    }
    const result = await Package.findById(id);
    return result;
}

const deletePackageToDB = async (id: string): Promise<IPackage | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid package ID");
        return null;
    }

    const result = await Package.findByIdAndUpdate(
        { _id: id },
        { status: "Delete" },
        { new: true }
    );

    if (!result) {
        console.error(`Failed to delete package with ID: ${id}`);
    }

    return result;
}

export const PackageService = {
    createPackageToDB,
    updatePackageToDB,
    getPackageFromDB,
    getPackageDetailsFromDB,
    deletePackageToDB,
    getAllPackagesFromDBForAdmin
}