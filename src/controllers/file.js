import fsp from 'node:fs/promises';
import path from 'node:path';
import sp from 'node:stream/promises';
import { fileService } from '../service/file.js';

async function getFileStreamById(req, res) {
    try {
        const _id = req.params._id; //file _id
        if (!_id) {
            throw new Error('File ID missing. Provide an ID to recieve a file.');
        }
        const fileData = await fileService.getFileById(_id);
        if (!fileData) {
            throw new Error(`File with ID: ${_id} can not be found. Please try again.`);
        }
        const filePath = path.normalize(fileData.pathToFile);
        const fileStats = await fsp.stat(filePath);
        const fileHandle = await fsp.open(filePath, 'r');
        const fileReadStream = fileHandle.createReadStream() 

        res.status(200);
        res.set({
            'Content-Type': fileData.mimeType,
            'Content-Length': fileStats.size
        });

        await sp.pipeline(fileReadStream, res);

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

export const file = {
    getFileStreamById
}