import { fileService } from "../service/file.js";
import { subjectService } from "../service/subject.js";

async function createMaterial(req, res) {
    try {
        const subjectId = req.body.subjectId || '';
        const file = req.files?.material || '';
        if (!subjectId || !file) {
            throw new Error(`Could not add material because of a missing value. Values recieved are subjectId:"${subjectId}" and file:"${file?.name}"`);
        }
        const newMaterial = await fileService.saveIncommingFile(file);
        await subjectService.addMaterial(subjectId, newMaterial._id);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Material added!'
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

async function removeMaterial(req, res) {
    try {
        const subjectId = req.query.subjectId || '';
        const materialId = req.query.materialId || '';
        if (!subjectId || !materialId) {
            throw new Error(`Could not remove material because of a missing value. Values recieved are subjectId:"${subjectId}" and materialId:"${materialId}"`);
        }
        await subjectService.removeMaterial(subjectId, materialId);
        await fileService.deleteFileByIdFormDBAndSystem(materialId);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Material removed!'
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

export const material = {
    createMaterial,
    removeMaterial
};