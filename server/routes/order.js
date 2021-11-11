const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizeRoles,
} = require('../middleware/auth');

const {
    createOrder,
    updateOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
} = require('../controllers/order');

router
    .route('/')
    .post(authenticateUser, createOrder)
    .get([authenticateUser, authorizeRoles('admin')], getAllOrders);

router
    .route('/showAllMyOrders')
    .get(authenticateUser, getCurrentUserOrders);

router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);

module.exports = router;