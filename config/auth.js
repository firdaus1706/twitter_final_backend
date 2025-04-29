import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: "../config/env"
})

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not Authenticated!",
                success: false
            })
        }

        const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decode.userId;
        next();
    } catch (e) {
        console.log(e);
    }
}

export default isAuthenticated;