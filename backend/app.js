import { configDotenv } from "dotenv";
configDotenv({quiet: true});

import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import aboutUsRouter from "./routes/aboutUs.route.js";

import eventRouter from "./routes/event.route.js";
import adminRouter from "./routes/admin.route.js";
import publicationRouter from "./routes/publication.route.js";
import galleryRouter from "./routes/gallery.route.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser()); 

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static('public'));

app.use("/api/admin/aboutUs", aboutUsRouter);
app.use("/api/admin/event", eventRouter);
app.use("/api/admin/publication", publicationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/gallery", galleryRouter);

export default app;