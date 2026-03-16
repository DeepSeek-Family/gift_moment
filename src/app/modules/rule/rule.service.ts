import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IRule } from "./rule.interface";
import { Rule } from "./rule.model";

const allowedTypes = ["privacy", "terms", "about"];
const validateType = (types: string) => {
  if (!allowedTypes.includes(types)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid type provided");
  }
};
// if already exit same type than just replace previous content
// else create new
const createRuleToDB = async (payload: IRule) => {
  validateType(payload.type);
  const result = await Rule.findOneAndUpdate({ type: payload.type }, payload, {
    new: true,
    upsert: true,
  });


  return result;
};

const getRuleFromDB = async (type: string) => {
  validateType(type);
  const result = await Rule.findOne({ type: type });
  if (!result) {
    return [];
  }
  return result;
};

export const RuleService = {
  createRuleToDB,
  getRuleFromDB,
};
