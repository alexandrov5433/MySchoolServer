import User from "../models/User.js";

async function createNewUser(data) {
    return await User.create(data);
}

async function getUserById(_id) {
    const user = await User.findById(_id);
    user.password = '';
    return user;
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

async function getUserUploadedDocuments(userId) {
    const user = await User.findById(userId).populate('uploadedDocuments');
    return user.uploadedDocuments.reverse();
}

async function addUploadedDocumnetByUserId(userId, documentId) {
    const user = await User.findById(userId);
    user.uploadedDocuments.push(documentId);
    user.save();
    return true;
}
async function removeUploadedDocumnetByUserId(userId, documentId) {
    const user = await User.findById(userId);
    user.uploadedDocuments = user.uploadedDocuments.filter(d => d._id != documentId);
    user.save();
    return true;
}

export const userService = {
    createNewUser,
    getUserById,
    findByLoginDetails,
    promoteUserToStudent,
    isActiveStudent,
    getUserUploadedDocuments,
    addUploadedDocumnetByUserId,
    removeUploadedDocumnetByUserId
};