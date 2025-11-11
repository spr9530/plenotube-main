const express = require('express');
const { createNewCampaign, getCampaigns, getUserCampaigns } = require('./campaign.controller');
const { authenticate } = require('../../middelware/authorization');
const campaign_router = express.Router();

// To Do Authentication before end point
campaign_router.post('/create-campaign',authenticate, createNewCampaign);
campaign_router.get('/get-user-campaigns',authenticate,  getUserCampaigns);
// campaign_router.get('/get-campaign/:id', getSingleCampaign)

module.exports = campaign_router;