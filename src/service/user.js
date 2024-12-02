import User from "../models/User.js";
import NonStudent from "../models/NonStudent.js";

async function registerNewUser(data) {
    return await User.create(data);
}

async function createNewNonStudent(data) {
    return await NonStudent.create(data);
}

export const userService = {
    registerNewUser,
    createNewNonStudent,
};