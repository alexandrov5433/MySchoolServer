import parseError from "../service/errorParsing.js";
import { fileService } from "../service/file.js";
import { gradeService } from "../service/grade.js";
import { userService } from "../service/user.js";

async function getUserData(req, res) {
    try {
        const userId = req.query.userId || '';
        
        if (!userId) {
            throw new Error(`UserId is missing. Value provided for userId: "${userId}".`);
        }
        const payload = await userService.getUserById(userId);
        res.status(200);
        res.json(JSON.stringify(payload));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}
async function getUserDocuments(req, res) {
    try {
        const userId = req.params._id || '';
        if (!userId) {
            throw new Error(`UserId is missing. Value provided for userId: "${userId}".`);
        }
        const payload = {};
        const results = await userService.getUserUploadedDocuments(userId);
        payload.results = results;
        res.status(200);
        res.json(JSON.stringify(payload));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}
async function uploadDocument(req, res) {
    try {
        const userId = req.params._id || '';
        const document = req.files?.document || '';
        if (!userId) {
            throw new Error(`UserId is missing. Value provided for userId: "${userId}".`);
        }
        if (!document) {
            throw new Error(`Document is missing. Value provided for document: "${document}".`);
        }
        const newDocument = await fileService.saveIncommingFile(document);
        await userService.addUploadedDocumnetByUserId(userId, newDocument._id);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Document uploaded!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}
async function deleteDocument(req, res) {
    try {
        const userId = req.params._id || '';
        const fileId = req.params.fileId || '';
        if (!userId) {
            throw new Error(`UserId is missing. Value provided for userId: "${userId}".`);
        }
        if (!fileId) {
            throw new Error(`FileId is missing. Value provided for fileId: "${fileId}".`);
        }
        await userService.removeUploadedDocumnetByUserId(userId, fileId);
        await fileService.deleteFileByIdFormDBAndSystem(fileId);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Document deleted!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}

async function getUserGradings(req, res) {
    try {
        const userId = req.params._id || '';
        if (!userId) {
            throw new Error(`UserId is missing. Value provided for userId: "${userId}".`);
        }
        const payload = {};
        const results = await gradeService.getAllGradingsForStudent(userId);
        payload.results = results;
        res.status(200);
        res.json(JSON.stringify(payload));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}
async function addGradeForUserInGrading(req, res) {
    try {
        const gradingId = req.body.gradingId || '';
        const grade = req.body.grade || '';
        if (!gradingId) {
            throw new Error(`GradingId is missing. Value provided for gradingId: "${gradingId}".`);
        }
        if (!grade) {
            throw new Error(`Grade is missing. Value provided for grade: "${grade}".`);
        }
        await gradeService.addGradeToGrading(grade, gradingId);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Grade added!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}
async function editGrade(req, res) {
    try {
        const gradeId = req.body.gradeId || '';
        const newGrade = req.body.newGrade || '';
        if (!gradeId) {
            throw new Error(`GradeId is missing. Value provided for gradeId: "${gradeId}".`);
        }
        if (!newGrade) {
            throw new Error(`New grade is missing. Value provided for newGrade: "${newGrade}".`);
        }
        console.log('gradeId', gradeId);
        console.log('newGrade', newGrade);
        await gradeService.editGrade(gradeId, newGrade);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Grade edited!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}
async function dleteGrade(req, res) {
    try {
        const gradingId = req.params.gradingId || '';
        const gradeId = req.params.gradeId || '';
        if (!gradingId) {
            throw new Error(`GradingId is missing. Value provided for gradingId: "${gradingId}".`);
        }
        if (!gradeId) {
            throw new Error(`GradeId is missing. Value provided for gradeId: "${gradeId}".`);
        }
        await gradeService.deleteGradeAndRemoveFromGrading(gradeId, gradingId);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Grade deleted!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}



export const profile = {
    getUserData,
    getUserDocuments,
    uploadDocument,
    deleteDocument,
    getUserGradings,
    addGradeForUserInGrading,
    editGrade,
    dleteGrade
};