import User from "../models/User.js"
export const swipeRight = async (req, res) => {
    //TODO: check if both of them like each other so can make a notification + getMatches right away(Real time)
    try {
        const {likedUserId} = req.params;
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);
        if (!likedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (currentUser.likes.includes(likedUserId)) {
            return res.status(400).json({
                success: false,
                message: "User already liked",
            });
        }
        currentUser.likes.push(likedUserId);
        await currentUser.save();
        if (likedUser.likes.includes(currentUser.id)) {
            currentUser.matches.push(likedUserId);
            likedUser.matches.push(currentUser._id.toString());
            await Promise.all([
                await currentUser.save(),
                await likedUser.save()
            ])
            return res.status(200).json({
                success: true,
                user: currentUser,
                message: "User matched successfully",
            });

        }
        res.status(200).json({
            success: true,
            user: currentUser,
            message: "User liked successfully",
        });

        
    } catch (error) {
        console.log("Error in swipeRight: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }
}

export const swipeLeft = async (req, res) => {
    try {
        const {dislikeUserId} = req.params;
        const currentUser = await User.findById(req.user.id);
        if (currentUser.dislikes.includes(dislikeUserId)) {
            return res.status(400).json({
                success: false,
                message: "User already disliked",
            });
        }
        currentUser.dislikes.push(dislikeUserId);
        await currentUser.save();
        res.status(200).json({
            success: true,
            user: currentUser,
            message: "User disliked successfully",
        });
    } catch (error) {
        console.log("Error in swipeLeft: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }
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
                    gender: currentUser.preferredGender === "both" ? { $in:["male","female"] } : currentUser.preferredGender
                },
                {genderPreference: {$in: [currentUser.gender, "both"]}}, //always find the same entity that same preference
            ],
        }
        );
        res.status(200).json({
            success: true,
            users: users,
        });
    } catch (error) {
        console.error("Error in getUserProfiles: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }
}