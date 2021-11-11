const express = require('express');
const router = express.Router();
const {
    authenticateUser,
} = require('../middleware/auth');

const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
} = require('../controllers/review');

router
    .route('/')
    .get(getAllReviews)
    .post(authenticateUser, createReview);

router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = router;