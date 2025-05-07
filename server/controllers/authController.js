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
            user: newUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login request received:", { email, password });
        console.log("Successfully passed the first log."); 

        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = signToken(user._id);
        console.log("JWT_SECRET is:", process.env.JWT_SECRET ? "Defined ✅" : "Undefined ❌");


        try {
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax", // safe in same-origin
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        } catch (err) {
        console.error("Error setting cookie:", err);
        }

        console.log("Setting cookies:", res.getHeaders());

        const safeUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            genderPreference: user.genderPreference
};


        console.log("User logged in successfully:", user);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token, // For testing purposes only
            user: safeUser,
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};