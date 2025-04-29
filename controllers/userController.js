import bcryptjs, { compareSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        //basic validation
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required!!",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already exists!",
                success: false
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 16);

        await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created succesfully!",
            success: true,
        })
    } catch (e) {
        res.send(e)
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required!",
                success: false
            })
        };

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Incorrect Email or Password!",
                success: false
            });
        };

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect Email or Password!",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

         // ✅ Set token as cookie here:
         res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: "None", // important for cross-origin
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: `Welcome back ${user.name}`,
            user,
            success: true
        })
    } catch (e) {
        res.send(e)
    }
}

export const Logout = (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "User Logged Out Successfully!",
        success: true
    })
}

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);

        if (user.bookmarks.includes(tweetId)) {
            //remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks!!"
            });
        }
        else {
            //bookmark
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Saved to bookmarks!!"
            });
        }
    } catch (e) {
        console.log(e)
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })
    } catch (e) {
        console.log(e)
    }
}

export const getOtherUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");
        if (!otherUsers) {
            return res.status(401).json({
                message: "Currently no other users!"
            })
        };
        return res.status(200).json({
            otherUsers
        })
    } catch (e) {
        console.log(e)
    }
}

export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);//patel
        const user = await User.findById(userId);//keshav

        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });
        }
        else {
            return res.status(400).json({
                message: `User is already following ${user.name}`
            })
        };

        return res.status(200).json({
            message: `${loggedInUser.name} just followed ${user.name}`,
            success: true
        })
    } catch (e) {
        console.log(e);
    }
}

export const unFollow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const userId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);//patel
        const user = await User.findById(userId);//keshav

        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });
        }
        else {
            return res.status(400).json({
                message: `User has not followed yet`
            })
        };

        return res.status(200).json({
            message: `${loggedInUser.name} unfollowed ${user.name}`,
            success: true
        })
    } catch (e) {
        console.log(e);
    }
}