import { Model } from "mongoose";

export type IPackage = {
    title: String;
    paymentType: 'Monthly' | 'Yearly';
    packageType: "recommended" | "standard";
    price: Number;
    moneySaved?: Number;
    feature: String[];
    duration: '1 month' | '1 year';
    productId?: String;
    paymentLink?: string;
    status: 'Active' | 'Delete'
    priceId: string;
}

export type PackageModel = Model<IPackage, Record<string, unknown>>;