import express from 'express';
import {
    blogPost,
    deleteBlog,
    getAllBlogs,
    getSingleBlog,
    getMyBlogs,
    updateBlogs
} from '../controllers/blogController.js';
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js"

const router = express.Router();

router.post("/post", isAuthenticated, isAuthorized("Author"), blogPost);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Author"), deleteBlog);
router.get("/all", getAllBlogs);
router.get("/single/:id", getSingleBlog);
router.get("/myblogs", isAuthenticated, isAuthorized("Author"), getMyBlogs);
router.put("/update/:id", isAuthenticated, isAuthorized("Author"), updateBlogs);

export default router;