const redisClient = require("../../config/redis.client");
const uploadImageToCloudinary = require("../utils/uploadToCloud");
const Campaign = require("./campaign.model.schema.js")
const sanitize = require('sanitize-html');
const multer = require('multer');

// Use memory storage for temporary buffer
const upload = multer({ storage: multer.memoryStorage() }).single('imageFile');

exports.createNewCampaign = (req, res) => {
  upload(req, res, async (err) => {
    try {
      // 🧩 Handle file upload error
      if (err) {
        return res.status(400).json({ success: false, message: "File upload error" });
      }

      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = req.body;

      // 🧹 Sanitize input fields
      const safeTitle = sanitize(data.title);
      const safeDescription = sanitize(data.description);
      const safeCategory = sanitize(data.category);

      // 🔢 Validate numeric fields
      const budget = Number(data.budget);
      const reward = Number(data.reward);
      const minPayout = Number(data.minimumPayout);
      const maxPayout = Number(data.maximumPayout);
      const requiredView = Number(data.requiredView);

      if ([budget, reward, requiredView].some((v) => isNaN(v))) {
        return res.status(400).json({ success: false, message: "Invalid numeric values" });
      }

      // ✅ Business logic validations
      if (budget < 5000) {
        return res.status(400).json({
          success: false,
          message: "Budget cannot be less than 5000",
        });
      }

      if (minPayout > budget / 3) {
        console.log(minPayout, budget / 3)
        return res.status(400).json({
          success: false,
          message: "Minimum Payout must be enough for atleast 3 user",
        });
      }

      if (maxPayout < minPayout) {
        return res.status(400).json({
          success: false,
          message: "Maximum Payout cannot be less than Minimum Payout",
        });
      }

      // 🖼️ Image upload handling
      let imageUrl = "";

      if (req.file) {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: "Only JPG/PNG images allowed",
          });
        }

        const uploadResult = await uploadImageToCloudinary(req.file.buffer, "campaigns");
        if (!uploadResult.success) {
          return res.status(400).json({
            success: false,
            message: "Image upload failed",
          });
        }

        imageUrl = uploadResult.url;
      }

      // 🧭 Prepare campaign data
      const campaignData = {
        title: safeTitle,
        description: safeDescription,
        category: safeCategory,
        budget,
        reward,
        minPayout,
        maxPayout,
        requiredView,
        requirements: JSON.parse(data.requirements || "[]"),
        platforms: JSON.parse(data.platforms || "[]"),
        imageUrl,
        createdBy: user.userid,
        type: "Clipping",
      };

      // 🛡️ Prevent duplicate campaigns
      const duplicate = await Campaign.findOne({
        title: campaignData.title,
        createdBy: user._id,
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Duplicate campaign title for same creator",
        });
      }

      // 💾 Create new campaign
      const newCampaign = await Campaign.create(campaignData);

      res.status(201).json({
        success: true,
        message: "Campaign created successfully",
        campaign: newCampaign,
      });
    } catch (error) {
      console.error("Error while creating campaign:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};




exports.getCampaigns = async (req, res) => {
  try {
    const {
      limit = 12,
      search = '',
      platform,
      category,
      cursor,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const limitNum = parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    // 1️⃣ Build dynamic query
    const query = {};
    if (search) query.$text = { $search: search };
    if (platform) query.platforms = platform;
    if (category) query.category = category;
    if (cursor) {
      query[sortBy] = sortOrder === 1
        ? { $gt: cursor }   // ascending
        : { $lt: cursor };  // descending
    }

    // 2️⃣ Build Redis cache key
    const cacheKey = `campaigns:${JSON.stringify({ limit: limitNum, search, platform, category, cursor, sortBy, order })}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('Serving from cache');
      return res.status(200).json({ success: true, campaigns: JSON.parse(cached) });
    }

    // 3️⃣ Fetch campaigns from MongoDB
    const campaignsData = await Campaign.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limitNum)
      .populate('createdBy', 'name email username');

    // 4️⃣ Cache the result
    if (campaignsData.length > 0) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(campaignsData));
    }

    return res.status(200).json({ success: true, campaigns: campaignsData });

  } catch (error) {
    console.log('Error fetching campaigns:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUserCampaigns = async(req, res) => {
  try{
    const user = req.user;
    if(!user) return res.status(400).json({success:false, message:'Unauthorized'});

    const campaigns = await Campaign.find({createdBy: user.userid}).sort({createdAt:-1});

    return res.status(200).json({success:true, campaigns});
  }catch(error){
    console.log('Error in getUserCampaign:',error);
    return res.status(500).json({success:false, message:'Server error'});
  }
}

exports.getSingleCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Campaign ID is required' });
    }

    // 1️⃣ Check cache first
    const cachedCampaign = await redisClient.get(`campaign:${id}`);
    if (cachedCampaign) {
      return res.status(200).json({
        success: true,
        message: 'Campaign found (from cache)',
        campaign: JSON.parse(cachedCampaign),
      });
    }

    // 2️⃣ Fetch from DB
    const campaign = await Campaign.findById(id).populate('createdBy', 'name email username');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'No campaign found' });
    }

    // 3️⃣ Cache the result for 1 hour
    await redisClient.setEx(`campaign:${id}`, 3600, JSON.stringify(campaign));

    return res.status(200).json({ success: true, message: 'Campaign found', campaign });
  } catch (error) {
    console.log('Error in getSingleCampaign:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
