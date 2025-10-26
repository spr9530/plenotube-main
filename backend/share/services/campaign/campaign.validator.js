// validation/campaignValidation.js
const Joi = require("joi");

exports.validateCampaign = () => {
    createCampaignSchema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        totalReward: Joi.number().positive().required(),
        rewardPerK: Joi.number().positive().required(),
        maxCampaignPayout: Joi.number().positive().required(),
        minCampaignPayout: Joi.number().positive().required(),
        imageUrl: Joi.string().uri().required(),
        type: Joi.string().valid("Clipping").required(),
        platforms: Joi.array().items(Joi.string().valid("Instagram", "YouTube", "Facebook", "Twitter", "LinkedIn")).min(1).required(),
        requirements: Joi.array().items(Joi.string()).min(2).required(),
        requiredView: Joi.number().positive().required(),
        tags: Joi.array().items(Joi.string()).optional(),
        deadline: Joi.date().optional(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map(err => err.message),
        });
    }

    req.validatedData = value;  // ✅ save validated data for controller
    next();
}
