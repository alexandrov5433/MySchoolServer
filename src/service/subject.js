import Subject from "../models/Subject.js";

async function createNewSubject(data) {
    return await Subject.create(data);
}
/**
 * Get the Subject documents in which the user with _id is a participant.
 * @param {string} _id
 * This is the _id of the User document in the DB. 
 * @returns 
 */
async function getSubjectsForParticipant(_id) {
    return await Subject.find({ participants: { $elemMatch: { _id } } }).populate('teacher');
}

async function getSubjectsByTitleAndDisplayId(title, displayId) {
    const titleRegex = new RegExp(`${title}`);
    const displayIdRegex = new RegExp(`${displayId}`);
    return await Subject.find({
        title: { $regex: titleRegex, $options: 'i' },
        displayId: { $regex: displayIdRegex, $options: 'i' }
    }).populate('teacher');
}

async function getSubjectById(_id) {
    return await Subject.findById(_id).populate(['teacher', 'materials', 'participants', 'assignments', 'announcements']);
}
/**
 * Get the Subject documents in which the user with _id is a teacher (creator).
 * @param {string} _id
 * This is the _id of the User document in the DB. 
 * @returns 
 */
async function getSubjectsForTeacher(_id) {
    return await Subject.find({ teacher: _id }).populate('teacher');
}

async function addParticipant(subjectId, userId) {
    const subject = await Subject.findById(subjectId);
    subject.participants.push(userId);
    return subject.save();
}

async function removeParticipant(subjectId, userId) {
    const subject = await Subject.findById(subjectId);
    subject.participants = subject.participants.filter(p => p._id != userId);
    return subject.save();
}

export const subjectService = {
    createNewSubject,
    getSubjectsForParticipant,
    getSubjectsByTitleAndDisplayId,
    getSubjectById,
    getSubjectsForTeacher,
    addParticipant,
    removeParticipant
};