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



export const profile = {
    getUserData,
    getUserDocuments,
    uploadDocument,
    deleteDocument,
    getUserGradings
};