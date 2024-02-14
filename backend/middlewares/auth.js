import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import { ErrorHandle } from "./error.js";
import jwt from "jsonwebtoken";


const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandle("User is not authenticated", 400))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();

});

const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandle(`User with this role (${req.user.role}) not allowed to access `))

        }
        next();
    }

};

export { isAuthenticated, isAuthorized };
