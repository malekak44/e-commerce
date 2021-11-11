const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizeRoles,
} = require('../middleware/auth');

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} = require('../controllers/product');
const {
    getSingleProductReviews,
} = require('../controllers/review');

router
    .route('/')
    .get(getAllProducts)
    .post([authenticateUser, authorizeRoles('admin')], createProduct);

router
    .route('/uploadImage')
    .post([authenticateUser, authorizeRoles('admin')], uploadImage);

router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizeRoles('admin')], updateProduct)
    .delete([authenticateUser, authorizeRoles('admin')], deleteProduct);


router
    .route('/:id/reviews')
    .get(getSingleProductReviews);

module.exports = router;