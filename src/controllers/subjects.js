import parseError from "../service/errorParsing.js";
import { subjectService } from "../service/subject.js";
import { genDisplayId } from "../util/idGenerator.js";

async function createNewSubject(req, res) {
    try {
        const title = req.body.title.trim();
        if (!title) {
            throw new Error('The subject title is missing. Please try again.');
        }
        const displayId = genDisplayId();
        const teacher = req.cookies?.user?._id;
        const newSubject = await subjectService.createNewSubject({teacher, title, displayId});
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'ok',
            newSubjectId: newSubject._id
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

export const subjects = {
    createNewSubject
};