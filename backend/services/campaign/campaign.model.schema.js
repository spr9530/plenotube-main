const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    totalReward: { type: Number, required: true },
    rewardPerK: { type: Number, required: true },
    maxCampaignPayout: { type: Number, required: true },
    minCampaignPayout: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    type: { type: String, enum: ['Clipping'], required: true },
    platforms: [
        { type: String, enum: ['YouTube', 'Instagram', 'Facebook'], required: true }
    ],
    createdAt: { type: Date, default: Date.now, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
    deadline: { type: Date},
    requirements: [
        { type: String, required: true }
    ],
    rating: { type: Number, default: 0, required: true },
    requiredView:{ type: Number, default: 0, required: true },
    totalViews: { type: Number, default: 0, required: true },
    reviews: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
    ],
    status: { type: String, enum: ['Active', 'Paused', 'Completed'], default: 'Active', required: true },
    tags: [{ type: String }],
    applicants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            appliedAt: { type: Date, default: Date.now },
            status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
            media: { type: String, required: true},
            views: { type: Number, default: 0 },
            rewardEarned: { type: Number, default: 0 },
            link:{type:String, required:true},
        }
    ],
})

campaignSchema.index({platforms: 1});
campaignSchema.index({category:1});
campaignSchema.index({ createdAt: -1 });
campaignSchema.index({title: 'text', description:'text'}, { weights: { title: 5, description: 1 } });

const Campaign = mongoose.model('Campaign', campaignSchema)
module.exports = Campaign;