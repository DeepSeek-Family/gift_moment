import { model, Schema } from "mongoose";
import { IPackage, PackageModel } from "./package.interface";

const packageSchema = new Schema<IPackage, PackageModel>(
    {
        title: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },
        moneySaved: {
            type: Number,
            required: false,
            min: [0, "Discount cannot be negative"]

        },
        duration: {
            type: String,
            enum: ['1 month', '1 year'],
            required: true
        },
        paymentType: {
            type: String,
            enum: ['Monthly', 'Yearly'],
            required: true
        },
        productId: {
            type: String,
            required: true
        },
       
        feature: {
            type: [String],
            required: true
        },
        priceId: {
            type: String,
            required: false
        },
        paymentLink: {
            type: String,
            required: true
        },
        packageType: {
            type: String,
            enum: ["recommended", "standard"],
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Delete'],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
)

export const Package = model<IPackage, PackageModel>("Package", packageSchema);