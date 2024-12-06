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

async function promoteUserToStudent(_id) {
    return await User.findByIdAndUpdate(_id, { activeStudent: true });
}

/**
 * Checks if there is a user who is an active student.
 * @param {String} _id The _id of the User document. 
 * @returns
 */
async function isActiveStudent(email) {
    const document = await User.findOne({ email, activeStudent: true });
    return Boolean(document);
}

export const userService = {
    createNewUser,
    findByLoginDetails,
    promoteUserToStudent,
    isActiveStudent
};