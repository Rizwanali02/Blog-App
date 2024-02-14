import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dbConnection from './database/dbConnection.js';
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(cors({
    origin: [],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//call Database ----------------------------------------------------------------
dbConnection();

//files upload krne k liyee ----------------------------------------------------------------
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/"
}));

// difind user routes----------------------------------------------------------------
app.use("/api/v1/user", userRouter);  
// difind Blof routes----------------------------------------------------------------
app.use("/api/v1/blog", blogRouter);  

app.use(errorMiddleware);


export default app;