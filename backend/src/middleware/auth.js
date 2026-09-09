import userModel from "../models/user.model.js";
import { sendServerError } from "../utils/response.js"
import jwt from "jsonwebtoken"

export async function protect(req, res, next) {
    try {
        let token = null;

           // Cookie se token
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
   
       
           // Authorization header se token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById({ _id:decoded.id }).select("-password");
        req.user = user;
        console.log(user,"check")
        next();


    } catch (error) {
        console.log(error);
        
        return sendServerError(res)
    }
}

export function authorized(...roles) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Plese login first"
                })
            }
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied, You are not authorized"
                })
            }

            next()
            console.log(roles)

        } catch (error) {
            return sendServerError(res)
        }
    }

}