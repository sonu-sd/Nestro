import userModel from "../models/user.model.js";
import {
  sendForbidden,
  sendServerError,
  sendUnauthorized,
} from "../utils/response.js";
import jwt from "jsonwebtoken";
import { getCookieClearOptions } from "../utils/auth.js";

const clearInvalidSession = (res) => {
  res.clearCookie("token", getCookieClearOptions());
};

export async function protect(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token && req.headers.authorization) {
      const [scheme, bearerToken] = req.headers.authorization.split(" ");
      token = scheme === "Bearer" ? bearerToken : null;
    }

    if (!token) {
      return sendUnauthorized(res, "Please sign in to continue");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded.id)
      .select("-password -otp -otpExpire -otpAttempts -otpLastSentAt");

    if (!user || !user.status) {
      clearInvalidSession(res);
      return sendUnauthorized(res, "Your session is no longer valid");
    }

    req.user = user;
    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      clearInvalidSession(res);
      return sendUnauthorized(res, "Your session is invalid or has expired");
    }
    return sendServerError(res, error);
  }
}

export function authorized(...roles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendUnauthorized(res, "Please sign in to continue");
      }
      if (!roles.includes(req.user.role)) {
        return sendForbidden(res, "You are not authorized for this action");
      }

      return next();
    } catch (error) {
      return sendServerError(res, error);
    }
  };
}
