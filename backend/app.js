import { configDotenv } from "dotenv";
configDotenv({quiet: true});

import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import {protectedTeamRouter, publicTeamRouter} from "./routes/aboutUs.route.js";

import {protectedRouter, publicRouter} from "./routes/event.route.js";
import adminRouter from "./routes/admin.route.js";
import {protectedPublicationRouter, publicPublicationRouter} from "./routes/publication.route.js";
import {protectedGalleryRouter, publicGalleryRouter} from "./routes/gallery.route.js";

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

app.use("/api/event", publicRouter);
app.use("/api/aboutUs", publicTeamRouter);
app.use("/api/gallery", publicGalleryRouter);
app.use("/api/publication", publicPublicationRouter);

app.use("/api/admin/aboutUs", protectedTeamRouter);
app.use("/api/admin/event", protectedRouter);
app.use("/api/admin/publication", protectedPublicationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/gallery", protectedGalleryRouter);

export default app;