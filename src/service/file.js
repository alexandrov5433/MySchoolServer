import File from "../models/File.js";

async function createNewFile(data) {
    return await File.create(data);
}

export const fileService = {
    createNewFile
};