const { authenticate } = require('../../middelware/authorization');
const { addReview } = require('./review.controller');

const review_router = require('express').Router();


// Review routes
router.post('/review', authenticate, addReview);

router.put('/review/:reviewId', authenticate, updateReview);

router.delete('/review/:campaignId/:reviewId', authenticate, deleteReview);

module.exports = review_router;