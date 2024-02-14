import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { ErrorHandle } from "../middlewares/error.js"
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";



const register = catchAsyncErrors(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandle("User Avatar Required", 400));
    }

    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(
            new ErrorHandle(
            "Inavalid file type. Please provide valid file type png , jpeg and webp",
            400))
    };



    const { name, email, password, phone, role, education } = req.body;

    if (!name || !email || !password || !phone || !role || !education || !avatar) {
        return next(new ErrorHandle("Please fill all fileds", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandle("User already exists", 400));
    }


    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary error : ", cloudinaryResponse.error || "Unknown cloudinary error");
    }

    user = await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });
    sendToken(user, 200, "User registered successfully", res);

});

const login = catchAsyncErrors(async (req, res, next) => {

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new ErrorHandle("Please fill all fileds", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandle("Please Enter Valid email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandle("Please Enter Valid password", 400));
    }

    if (user.role !== role) {
        return next(new ErrorHandle(`User with provided role ${role} not found`, 400));
    }

    sendToken(user, 200, "User logged in successfully", res);

});


const logout = catchAsyncErrors((req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "User logged out successfully"
    });

});

const getMyProfile = (req, res, next) => {

    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
}

const getAllAuthors = catchAsyncErrors(async (req, res, next) => {

    const authors = await User.find({ role: "Author" });

    res.status(200).json({
        success: true,
        authors
    });
});


export {
    register,
    login,
    logout,
    getMyProfile,
    getAllAuthors
}