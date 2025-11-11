const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    reward: { type: Number, required: true },
    maxPayout: { type: Number, required: true },
    minPayout: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    paidOut:{type:Number, default:0, required:true},
    type: { type: String, enum: ['Clipping'], required: true },
    platforms: [
        { type: String, enum: ['Youtube', 'Instagram', 'Facebook'], required: true }
    ],
    createdAt: { type: Date, default: Date.now, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
    requirements: [
        { type: String, required: true }
    ],
    requiredView:{ type: Number, default: 0, required: true },
    totalViews: { type: Number, default: 0, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Active', 'Paused', 'Completed'], default: 'Pending', required: true },
    tags: [{ type: String }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
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