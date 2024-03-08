import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dbConnection from './database/dbConnection.js';
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import fileUpload from 'express-fileupload';

dotenv.config({ path: "./config/config.env" });
const app = express();


//call Database ----------------------------------------------------------------
dbConnection();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//files upload krne k liyee ----------------------------------------------------------------
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

app.get("/", (req, res) => {
    res.status(200).json({
        succss: true,
        message: "Backend Running Successfully"
    })

});

// difind user routes----------------------------------------------------------------
app.use("/api/v1/user", userRouter);
// difind Blof routes----------------------------------------------------------------
app.use("/api/v1/blog", blogRouter);

app.use(errorMiddleware);


export default app;