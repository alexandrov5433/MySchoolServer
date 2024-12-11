import File from "../models/File.js";
import path from 'node:path';
import fsp from 'node:fs/promises';
import { genId } from "../util/idGenerator.js";
import { __basedir } from "../config/serverConfig.js";

async function createNewFile(data) {
    return await File.create(data);
}

async function deleteFileByIdFormDBAndSystem(_id) {
    const path = (await File.findById(_id)).pathToFile;
    await File.findByIdAndDelete(_id);
    await deleteFileFromSystem(path);
    return true;
}

async function deleteFileDocumentOnlyFromDB(_id) {
    return await File.findByIdAndDelete(_id);
}

/**
 * Returns a document of File.
 * @param {string} _id
 * The _id of the File document in the DB.
 */
async function getFileById(_id) {
    return await File.findById(_id);
}
/**
 * Acceps the file object (express-fileupload), saves it, creates a new File document in the DB and returns this File document.
 * @param {Object} file 
 * @returns {Promise<Document>}
 */
async function saveIncommingFile(file) {
    const originalName = file.name;
    const uniqueName = genId() + file.name;
    const pathToFile = path.normalize(
        path.join(__basedir, '/storage/', uniqueName)
    );
    const mimeType = file.mimetype;
    const encoding = file.encoding;
    const documentData = {
        originalName,
        uniqueName,
        pathToFile,
        mimeType,
        encoding
    };
    const newFile = await fileService.createNewFile(documentData);
    await file.mv(documentData.pathToFile);
    return newFile; //returns File document from BD
    // resource: {
    //     name: 'Second.pdf',
    //     data: <Buffer 25 50 44 46 2d 31 2e 35 65 73 20 32 20 ... 1995861 more bytes>,
    //     size: 1995911,
    //     encoding: '7bit',
    //     tempFilePath: '',
    //     truncated: false,
    //     mimetype: 'application/pdf',
    //     md5: '4b5d87ef5a4cb3365f2b9d147ed28643',
    //     mv: [Function: mv]
    //   }
}

async function deleteFileFromSystem(path) {
    return await fsp.unlink(path);
}

export const fileService = {
    createNewFile,
    getFileById,
    saveIncommingFile,
    deleteFileFromSystem,
    deleteFileByIdFormDBAndSystem,
    deleteFileDocumentOnlyFromDB
};