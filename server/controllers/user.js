const Errors = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const {
    createTokenUser,
    checkPermissions,
    attachCookiesToResponse,
} = require('../utils');

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users, count: users.length });
}

const getSingleUser = async (req, res) => {
    const { id: userId } = req.params;

    const user = await User.findOne({ _id: userId }).select('-password');
    if (!user) {
        throw new Errors.NotFoundError(`No user with id : ${userId}`);
    }

    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
}

const showCurrentUser = async (req, res) => {
    const userId = req.user.userId;

    const user = await User.findOne({ _id: userId }).select('-password');
    if (!user) {
        throw new Errors.NotFoundError(`No user with id : ${userId}`);
    }

    res.status(StatusCodes.OK).json({ user });
}

const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new Errors.BadRequestError('Please provide name and email');
    }

    const user = await User.findOne({ _id: req.user.userId }).select('-password');
    user.name = name;
    user.email = email;
    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({ user });
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new Errors.BadRequestError('Please provide old and new password');
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
    updateUser,
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUserPassword,
}