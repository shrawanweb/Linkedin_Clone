import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";

import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

// DNS servers
dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use("/",userRoutes);
app.use(express.static("uploads"));

const start = async () => {
    try {

        await mongoose.connect(
            "mongodb+srv://shrawansaw89_db_user:zGOZG23LOv9POAf0@linkedinclone.oubnnb0.mongodb.net/?retryWrites=true&w=majority&appName=linkedinclone",
            {
                serverSelectionTimeoutMS: 5000,
                family: 4
            }
        );

        console.log("MongoDB Connected");

        app.listen(9090, () => {
            console.log("Server is running on port 9090");
        });

    } catch (error) {
        console.log(error);
    }
};

start();