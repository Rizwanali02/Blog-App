import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { ErrorHandle } from "../middlewares/error.js"
import { Blog } from "../models/blogSchema.js"
import cloudinary from 'cloudinary'

const blogPost = catchAsyncErrors(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandle("Blog Main Image Is Mandatory", 400))
    }

    const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
    if (!mainImage) {
        return next(new ErrorHandle("Blog Main Image are Required", 400))
    }

    //mimetype yee file k format ko janne k liyeee use kiyaa jata hai 
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"]
    if (!allowedFormats.includes("mainImage.mimetype")
        || (paraOneImage && !allowedFormats.includes("paraOneImage.mimetype"))
        || (paraTwoImage && !allowedFormats.includes("paraTwoImage.mimetype"))
        || (paraThreeImage && !allowedFormats.includes("paraThreeImage.mimetype"))
    ) {
        return next(new ErrorHandle("Inavalid file type. Only PNG , JPEG and WEBP formats are allowed", 400))
    }

    const { title, intro,
        paraOneDescription,
        paraOneTitle,
        paraTwoDescription,
        paraTwoTitle,
        paraThreeDescription,
        paraThreeTitle,
        category
    } = req.body;


    const createdBy = req.user._id;
    const authorName = req.user.name;
    const authorAvatar = req.user.avatar;


    if (!title || !intro || !category) {
        return next(new ErrorHandle("Title , intro and  category are Required", 400))
    }

    const uploadPromisese = [
        cloudinary.uploader.upload(mainImage.tempFilePath),
        paraOneImage ? cloudinary.uploader.upload(paraOneImage.tempFilePath) : Promise.resolve(null),
        paraTwoImage ? cloudinary.uploader.upload(paraTwoImage.tempFilePath) : Promise.resolve(null),
        paraThreeImage ? cloudinary.uploader.upload(paraThreeImage.tempFilePath) : Promise.resolve(null),
    ];

    const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes] = await Promise.all(uploadPromisese);

    if (!mainImageRes || 
        (paraOneImage && (!paraOneImageRes)) ||
        (paraTwoImage && (!paraTwoImageRes)) ||
        (paraThreeImage && (!paraThreeImageRes))
    ) {
        return next(new ErrorHandle("Error while file uploading one or more image", 500))
    }


});

export { blogPost }