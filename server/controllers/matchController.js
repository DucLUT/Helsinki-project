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
        const { dislikedUserId } = req.params;
        const currentUser = await User.findById(req.user.id);
        console.log("Current User:", currentUser);
        console.log("Dislike User ID:", dislikedUserId );

        if (currentUser.dislikes.includes(dislikedUserId)) {
            return res.status(400).json({
                success: false,
                message: "User already disliked",
            });
        }

        currentUser.dislikes.push(dislikedUserId );
        await currentUser.save();
        res.status(200).json({
            success: true,
            user: currentUser,
            message: "User disliked successfully",
        });
    } catch (error) {
        console.log("Error in swipeLeft:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
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
				{ _id: { $ne: currentUser.id } }, // Exclude current user
				{ _id: { $nin: currentUser.likes } }, // Exclude users already liked
				{ _id: { $nin: currentUser.dislikes } }, // Exclude users already disliked
				{ _id: { $nin: currentUser.matches } }, // Exclude users already matched
				{
					gender:
						currentUser.genderPreference === "both"
							? { $in: ["male", "female"] }
							: currentUser.genderPreference,
				}, // Filter by gender preference
				{ genderPreference: { $in: [currentUser.gender, "both"] } }, // Exclude users who don't match the preference
			],
		});

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		console.log("Error in getUserProfiles: ", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};