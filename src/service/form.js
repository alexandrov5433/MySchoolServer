import Form from "../models/Form.js";

async function createNewForm(fileId) {
    return await Form.create({file: fileId});
}

async function getAllForms() {
    return await Form.find().populate('file');
}

async function deleteFormByIdAndGetFileId(formId) {
    const form = await Form.findById(formId).populate('file');
    const fileId = form.file._id;
    await Form.findByIdAndDelete(formId);
    return fileId;
}

export const formService = {
    createNewForm,
    getAllForms,
    deleteFormByIdAndGetFileId,
};