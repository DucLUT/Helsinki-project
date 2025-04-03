import User from "../models/User.js"
export const swipeRight = async (req, res) => {
}

export const swipeLeft = async (req, res) => {
}

export const getMatches = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("matches", "name image");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            matches: user.matches,
        });
    } catch (error) {
        console.log("Error in getMatches: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getUserProfiles = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);  
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUser._id } }, // Exclude current user
                { _id: { $nin: currentUser.matches } }, // Exclude matched users
                { _id: { $nin: currentUser.likes } }, // Exclude like users
                { _id: { $nin: currentUser.dislikes } }, // Exclude dislike users
                {
                    gender: currentUser.preferredGender === "both" ? { $in:["make"]}
                }
            ],
        }
        )
    } catch (error) {
        
    }
}