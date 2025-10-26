const express = require('express');
const { createNewCampaign, getCampaigns } = require('./campaign.controller');
const { validateCampaign } = require('./campaign.validator');

const campaign_router = express.Router();

// To Do Authentication before end point
campaign_router.post('/create-campaign', validateCampaign, createNewCampaign);
campaign_router.get('/get-campaigns', getCampaigns);
campaign_router.get('/get-campaign/:id', getSingleCampaign)