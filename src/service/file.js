import File from "../models/File.js";

async function createNewFile(data) {
    return await File.create(data);
}

/**
 * Returns a document of File.
 * @param {string} _id
 * The _id of the File document in the DB.
 */
async function getFileById(_id) {
    return await File.findById(_id);
}

export const fileService = {
    createNewFile,
    getFileById
};