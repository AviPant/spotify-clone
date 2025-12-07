import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import {clerkMiddleware} from '@clerk/express';
import path from "path";
import cors from 'cors'
import { createServer } from "http";

import { initializeSocket } from "./lib/socket.js";

dotenv.config();

import userRoutes from "./routes/user.Route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";



const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT

const httpServer = createServer(app);
initializeSocket(httpServer)

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));

app.use(express.json());
app.use(clerkMiddleware());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use("/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/songs", songRoutes); 
app.use("/uploads", express.static("uploads"));
app.use("/api/albums", albumRoutes)
app.use("/api/stats", statRoutes)




//error handler 
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal Server error" : err.message });
})

httpServer.listen(PORT, () => {
    console.log("Server is running on port  " + PORT);
    connectDB();
})