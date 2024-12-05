import Application from "../models/Application.js";

async function createNewApplication(data) {
    return await Application.create(data);
}

/**
 * Returns an array of applications with status "pending".
 * @param {String} firstName Students (User) first name.
 * @param {String} lastName Students (User) last name.
 * @param {String} displayId Students (User) displayId.
 */
async function getPendingApplications(firstName, lastName, displayId) {
    const firstNameRegex = new RegExp(`${firstName}`);
    const lastNameRegex = new RegExp(`${lastName}`);
    const displayIdRegex = new RegExp(`${displayId}`);
    const result = await Application.find({ status: 'pending' })
        .populate({
            path: 'applicant',
            match: {
                $and: [
                    { firstName: { $regex: firstNameRegex, $options: 'i' } },
                    { lastName: { $regex: lastNameRegex, $options: 'i' } },
                    { displayId: { $regex: displayIdRegex, $options: 'i' } }
                ]
            }
        });
    return result.filter(doc => doc.applicant !== null);
}

/**
 * Returns one pending Application.
 * @param {String} _id The _id of the Application document in the DB.
 */
async function getPendingApplicationById(_id) {
    const result = await Application.findOne({ $and: [
        { _id: _id },
        { status: 'pending' }
    ] })
    .populate(['applicant', 'applicationDocuments']);
    result.applicant.password = '';
    return result;
}

export const applicationService = {
    createNewApplication,
    getPendingApplications,
    getPendingApplicationById
};