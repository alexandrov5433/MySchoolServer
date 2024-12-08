import Grading from '../models/Grading.js';
import Grade from '../models/Grade.js';

async function createNewGrading(userId, subjectId) {
    return await Grading.create({
        student: userId,
        subject: subjectId
    });
}

async function addGradeToGrading(grade, gradingId) {
    const newGrade = await Grade.create({ value: grade });
    const grading = await Grading.findById(gradingId);
    grading.grades.push(newGrade._id);
    return await grading.save();
}

async function deleteGradeAndRemoveFromGrading(gradeId, gradingId) {
    const grading = await Grading.findById(gradingId);
    grading.grades = grading.grades.filter(g => g._id != gradeId);
    await grading.save();
    await Grade.findByIdAndDelete(gradeId);
    return true;
}

async function editGrade(gradeId, newValue) {
    return await Grade.findByIdAndUpdate(gradeId, { value: newValue });
}

async function getGradingForUserAndSubject(userId, subjectId) {
    return await Grading.findOne({student: userId, subject: subjectId});
}

async function getAllGradingsForStudent(userId) {
    return await Grading.find({student: userId}).populate([{ path: 'subject', populate: 'teacher'}]);
}

async function addGradingForStudentAndSubjectIfOneDoesNotExist(userId, subjectId) {
    const gradingExists = await getGradingForUserAndSubject(userId, subjectId);
    if (!gradingExists) {
        return await createNewGrading(userId, subjectId);
    }
    return false;
}

export const gradeService = {
    createNewGrading,
    addGradeToGrading,
    deleteGradeAndRemoveFromGrading,
    editGrade,
    getGradingForUserAndSubject,
    getAllGradingsForStudent,
    addGradingForStudentAndSubjectIfOneDoesNotExist
};
