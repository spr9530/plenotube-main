const { Review } = require("../../common/review.model.schema");
const Campaign = require("../campaign/campaign.model.schema");

exports.addReview = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { rating, comment, campaignId } = req.body;

        if (!rating || !campaignId) {
            return res.status(400).json({ success: false, message: "Rating and campaignId are required" });
        }

        // Fetch campaign with reviews
        const campaign = await Campaign.findById(campaignId).populate('reviews');
        if (!campaign) {
            return res.status(404).json({ success: false, message: "No Campaign Found" });
        }

        // Check if user already reviewed
        const userReview = campaign.reviews.find(
            (rev) => rev.user.toString() === user._id.toString()
        );

        // 1️⃣ User has previous review(s)
        if (userReview) {
            if (userReview.count >= 3) {
                return res.status(400).json({
                    success: false,
                    message: "Review limit reached (max 3 reviews)"
                });
            }

            // Create new review
            const newReview = await Review.create({
                user: user._id,
                comment,
                rating,
                count: userReview.count + 1
            });

            campaign.reviews.push(newReview._id);
            await campaign.save();

            return res.status(200).json({
                success: true,
                message: "Review added successfully"
            });
        }

        // 2️⃣ First time user is giving review
        const newReview = await Review.create({
            user: user._id,
            comment,
            rating,
            count: 1
        });

        campaign.reviews.push(newReview._id);
        await campaign.save();

        return res.status(200).json({
            success: true,
            message: "Review added successfully"
        });

    } catch (error) {
        console.log("Error in addReview:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// UPDATE REVIEW
exports.updateReview = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        if (!reviewId) {
            return res.status(400).json({ success: false, message: "Review ID is required" });
        }

        // Find review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Permission check
        if (review.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to modify this review"
            });
        }

        // Update fields
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;

        await review.save();

        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });

    } catch (error) {
        console.error("Error in updateReview:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { reviewId, campaignId } = req.params;

        if (!reviewId || !campaignId) {
            return res.status(400).json({
                success: false,
                message: "Review ID and Campaign ID are required"
            });
        }

        // Find the review
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Permission check
        if (review.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this review"
            });
        }

        // Remove review reference from campaign
        await Campaign.findByIdAndUpdate(
            campaignId,
            { $pull: { reviews: reviewId } },
            { new: true }
        );

        // Delete review document
        await review.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteReview:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


