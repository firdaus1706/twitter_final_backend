import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/userRoutes.js"
import tweetRoute from "./routes/tweetRoutes.js"

dotenv.config({
    path: ".env"
})

databaseConnection();
const app = express();

//middlewares
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cookieParser());
// const corsOptions = {
//     origin: "http://localhost:3000",
//     credentials: true
// }
// app.use(cors(corsOptions));

const allowedOrigins = [
    'http://localhost:3000',
    'https://twitterfinalclone.netlify.app'
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS!'));
            }
        },
        credentials: true
    })
)

app.get('/', (req, res) => {
    res.send("Welcome to the API!")
})

// api
app.use('/api/v1/user', userRoute)
app.use('/api/v1/tweet', tweetRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server listen at port ${process.env.PORT}`);
})