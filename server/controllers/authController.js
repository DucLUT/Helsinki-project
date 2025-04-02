import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Add this import
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}
export const signup = async (req, res) => {
    const { name, userName, email, password, age, gender, genderPreference } = req.body;
    try {
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old to sign up" });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Remove `new` keyword here
        const newUser = await User.create({
            name,
            userName,
            email,
            passwordHash,
            age,
            gender,
            genderPreference,
        });

        const token = signToken(newUser._id);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token, //just for testing remember to delete this
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = signToken(user._id);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token, //just for testing remember to delete this
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};