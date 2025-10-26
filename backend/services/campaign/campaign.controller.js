const redisClient = require("../../config/redis.client");
const Campaign = require("./campaign.model.schema");

exports.createNewCampaign = async (req, res) => {
    try {
        const user = req.user;
        const data = req.validatedData;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const duplicate = await Campaign.findOne({ tittle: data.title, createdBy: user._id });
        if (duplicate) {
            return res.status(409).json({ success: false, message: "Duplicate campaign title for same creator" });
        }

        const newCampaign = new Campaign({
            ...data,
            createdBy: user._id,
        });

        await newCampaign.save();


        // replaced with message queue if user base increases to 10k
        queueMicrotask(async () => await cacheCampaign(newCampaign));


        res.status(201).json({
            success: true,
            message: "Campaign created successfully",
            campaign: newCampaign
        });
        return res.status(201).json({ success: true, message: "Campaign created successfully", campaign: newCampaign });
    } catch (error) {
        console.log('Error while creating campign fn: CreateNewCampaign', error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

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
