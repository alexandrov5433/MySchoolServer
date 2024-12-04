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
        const newSubject = await subjectService.createNewSubject({ teacher, title, displayId });
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

async function getSubjects(req, res) {
    try {
        const _id = req.cookies?.user?._id;
        const title = req.query.title;
        const subjectDisplayId = req.query.subjectDisplayId;
        const mySubjectsOnly = req.query.mySubjectsOnly;
        const payload = {
            results: []
        };
        let searchRes;
        if (mySubjectsOnly === 'true') {
            if (req.cookies?.user?.status === 'student') {
                searchRes = await subjectService.getSubjectsForParticipant(_id);
            } else if (req.cookies?.user?.status === 'teacher') {
                searchRes = await subjectService.getSubjectsForTeacher(_id);
            }
        } else {
            searchRes = await subjectService.getSubjectsByTitleAndDisplayId(title, subjectDisplayId);
        }
        // console.log(searchRes);
        // payload
        // {
        //     results: [
        //         {
        //             _id: string,
        //             teacher: string,
        //             title: string,
        //             displayId: string,
        //             backgroundImageNumber: string
        //         }
        //     ]
        // }
        payload.results = searchRes.reduce((acc, cur) => {
            acc.push({
                _id: cur._id,
                teacher: cur.teacher.firstName + ' ' + cur.teacher.lastName,
                title: cur.title,
                displayId: cur.displayId,
                backgroundImageNumber: cur.backgroundImageNumber,
            });
            return acc;
        }, []);
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

export const subjects = {
    createNewSubject,
    getSubjects
};