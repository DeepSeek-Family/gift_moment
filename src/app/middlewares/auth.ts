import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelper";
import ApiError from "../../errors/ApiErrors";
import { User } from "../modules/user/user.model";

const auth =
  (...roles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;

      if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer ")) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      if (tokenWithBearer && tokenWithBearer.startsWith("Bearer")) {
        const token = tokenWithBearer.split(" ")[1];

        if (!token) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "You are not authorized"
          );
        }

        //verify token
        let verifyUser = null;
        try {
          verifyUser = jwtHelpers.verifyAccessToken(token);
        } catch (error) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Invalid or expired token"
          );
        }

        if (!verifyUser) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "You are not authorized"
          );
        }

        const dbUser = await User.findById(verifyUser.id)
          .select("role isBanned tokenVersion")
          .lean();

        if (!dbUser) {
          throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
        }
        if (dbUser.isBanned) {
          throw new ApiError(StatusCodes.UNAUTHORIZED, "Account is suspended");
        }

        if (dbUser.role !== verifyUser.role) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Permission changed. Please login again"
          );
        }

        //set user to header
        req.user = {
          id: dbUser._id.toString(),
          email: verifyUser.email,
          role: dbUser.role,
        };

        //guard user
        if (roles.length && !roles.includes(verifyUser.role)) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to access this api"
          );
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };
export default auth;
