import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campaign',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
export default reviewSchema;