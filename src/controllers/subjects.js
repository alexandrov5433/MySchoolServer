import parseError from "../service/errorParsing.js";
import { gradeService } from "../service/grade.js";
import { subjectService } from "../service/subject.js";
import { userService } from "../service/user.js";
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

async function getSubjectDetails(req, res) {
    try {
        const _id = req.params._id; //subject _id
        const payload = await subjectService.getSubjectById(_id);
        if (!payload) {
            throw new Error(`No subject with "_id":"${_id}" was found.`);
        }
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

async function maganeParticipation(req, res) {
    try {
        console.log(req.body);
        
        const subjectId = req.body.subjectId; //Subject _id
        const userId = req.body.userId; //User _id
        const action = req.body.action; //join or leave

        const subject = await subjectService.getSubjectById(subjectId);
        const user = await userService.getUserById(userId);
        if (!subject) {
            throw new Error(`No subject with "_id":"${subjectId}" was found.`);
        }
        if (!user) {
            throw new Error(`No user with "_id":"${userId}" was found.`);
        }
        if (!['leave', 'join'].includes(action)) {
            throw new Error(`The action "${action}" is not permited. Please try agian. Options are "leave" and "join".`);
        }
        const isAlreadyParticipant = Boolean(subject.participants.find( p => p._id == userId ));
        const actionsLib = {
            join: async () => {
                if (isAlreadyParticipant) {
                    throw new Error(`The user with _id: "${userId}" is already a participant in the subject with _id: "${subjectId}".`);
                }
                const addition = await subjectService.addParticipant(subjectId, userId);
                console.log('addition', addition);
                await gradeService.addGradingForStudentAndSubjectIfOneDoesNotExist(userId, subjectId);
                return 'A student has joined the subject.';
            },
            leave: async () => {
                if (!isAlreadyParticipant) {
                    throw new Error(`The user with _id: "${userId}" is not a participant in the subject with _id: "${subjectId}".`);
                }
                await subjectService.removeParticipant(subjectId, userId);
                return 'A student has left the subject.';
            }
        };
        const result = await actionsLib[action]();
        res.status(200);
        res.json(JSON.stringify({
            status: 'ok',
            msg: result
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
    createNewSubject,
    getSubjects,
    getSubjectDetails,
    maganeParticipation
};