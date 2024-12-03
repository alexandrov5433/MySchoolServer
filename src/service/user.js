import User from "../models/User.js";

async function createNewUser(data) {
    return await User.create(data);
}

async function findByLoginDetails(data) {
    // {
    //     loginAs: req.body.loginAs,
    //     email: req.body.email,
    //     password: req.body.password
    // }
    return await User.findOne({ status: data.loginAs, email: data.email });
}

export const userService = {
    createNewUser,
    findByLoginDetails
};