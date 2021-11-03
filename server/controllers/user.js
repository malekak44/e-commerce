const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const Errors = require('../errors');
const {
    createTokenUser,
    checkPermissions,
    attachCookiesToResponse,
} = require('../utils');

const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users });
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');

    if (!user) {
        throw new Errors.NotFoundError(`No user with id : ${req.params.id}`);
    }

    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
}

const showCurrentUser = (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
}

const updateUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new Errors.BadRequestError('Please provide all values');
    }

    const user = await User.findOne({ _id: req.user.userId });
    user.name = name;
    user.email = email;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ user: tokenUser });
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new Errors.BadRequestError('Please provide both values');
    }

    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new Errors.UnauthenticatedError('Invalid Credentials');
    }

    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}