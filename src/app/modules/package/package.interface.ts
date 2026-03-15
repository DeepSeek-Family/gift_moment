import { Model } from "mongoose";

export type IPackage = {
    title: String;
    paymentType: 'Monthly' | 'Yearly';
    packageType: "recommended" | "standard";
    price: Number;
    discount?: Number;
    feature: String[];
    duration: '1 month' | '1 year';
    productId?: String;
    credit: Number;
    paymentLink?: string;
    status: 'Active' | 'Delete'
}

export type PackageModel = Model<IPackage, Record<string, unknown>>;