import parseError from "../service/errorParsing.js";
import { fileService } from "../service/file.js";
import { formService } from "../service/form.js";


async function getFormsData(req, res) {
    try {
        const allForms = await formService.getAllForms();
        const payload = {
            results: allForms
        };
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

async function createNewForm(req, res) {
    try {
        const file = req.files.form || '';
        if (!file) {
            throw new Error(`No new form could be published because no file was sent.`);
        }
        const newFile = await fileService.saveIncommingFile(file);
        await formService.createNewForm(newFile._id);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'New file published.'
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

async function deleteForm(req, res) {
    try {
        const formId = req.params._id || '';
        if (!formId) {
            throw new Error(`No form could be deleted because no formId was sent. formId: "${formId}".`);
        }
        const fileIdToDelete = await formService.deleteFormByIdAndGetFileId(formId);
        await fileService.deleteFileByIdFormDBAndSystem(fileIdToDelete);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Form was deleted!.'
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

export const form = {
    getFormsData,
    createNewForm,
    deleteForm
}