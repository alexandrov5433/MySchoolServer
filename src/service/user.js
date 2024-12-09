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

/**
 * 
 * @param {String} code The parentalAuthenticationCode of the student User.  
 * @returns The User document of the student or null.
 */
async function doesAuthCodeExistForActiveStudent(code) {
    return await User.findOne({ parentalAuthenticationCode: code, activeStudent: true });
}

/**
 * Checks if a parent User exists and if the code is correct (student exists) the student User is added as a child of the parent User. Also the parent User is added as such in the student User. 
 * @param {String} parentId The _id of the parent User to which the student should be added as a child.
 * @param {String} authCode The parentalAuthenticationCode of the student User who is the child.
 */
async function checkCodeAndAddChild(parentId, authCode) {
    const parent = await User.findById(parentId);
    if (!parent) {
        throw new Error(`A user parent with _id: "${parentId}" does not exist.`);
    }
    const student = await doesAuthCodeExistForActiveStudent(authCode);
    if (!student) {
        throw new Error(`A user student with authentication code: "${authCode}" either does not exist or the student application is still being reviewed.`);
    }
    await addParentToStudent(student._id, parentId);
    await addStudentToParent(student._id, parentId);
    return true;
}

async function addParentToStudent(studentId, parentId) {
    const student = await User.findById(studentId);
    student.parents.push(parentId);
    return await student.save();
}

async function addStudentToParent(studentId, parentId) {
    const parent = await User.findById(parentId);
    parent.children.push(studentId);
    return await parent.save();
}

async function doesUserWithThisEmailExist(givenEmail) {
    return await User.findOne({ email: givenEmail });
}

async function getChildrenForParent(parentId) {
    const parent = await User.findById(parentId).populate('children');
    if (!parent) {
        return null;
    }
    return parent.children;
}

async function getAllActiveStudents() {
    return await User.find({
        status: 'student',
        activeStudent: true
    });
}

async function getActiveStudents(firstName, lastName, displayId) {
    const firstNameRegex = new RegExp(`${firstName}`);
    const lastNameRegex = new RegExp(`${lastName}`);
    const displayIdRegex = new RegExp(`${displayId}`);
    return await User.find({
        status: 'student',
        activeStudent: true,
        firstName: { $regex: firstNameRegex, $options: 'i' },
        lastName: { $regex: lastNameRegex, $options: 'i' },
        displayId: { $regex: displayIdRegex, $options: 'i' }
    });
}

export const userService = {
    createNewUser,
    getUserById,
    findByLoginDetails,
    promoteUserToStudent,
    isActiveStudent,
    getUserUploadedDocuments,
    addUploadedDocumnetByUserId,
    removeUploadedDocumnetByUserId,
    doesAuthCodeExistForActiveStudent,
    addParentToStudent,
    doesUserWithThisEmailExist,
    getChildrenForParent,
    checkCodeAndAddChild,
    getAllActiveStudents,
    getActiveStudents
};