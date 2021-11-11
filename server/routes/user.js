const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizeRoles,
} = require('../middleware/auth');

const {
    updateUser,
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUserPassword,
} = require('../controllers/user');

router
    .route('/')
    .get([authenticateUser, authorizeRoles('admin')], getAllUsers);

router
    .route('/showMe')
    .get(authenticateUser, showCurrentUser);

router
    .route('/updateUser')
    .patch(authenticateUser, updateUser);

router
    .route('/updateUserPassword')
    .patch(authenticateUser, updateUserPassword);

router
    .route('/:id')
    .get(authenticateUser, getSingleUser);

module.exports = router;