import User from "../models/User.js";

async function createNewUser(data) {
    return await User.create(data);
}

export const userService = {
    createNewUser
};