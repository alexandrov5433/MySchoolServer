import { announcementSrvice } from "../service/announcement.js";
import { subjectService } from "../service/subject.js";

async function publishAnnouncement(req, res) {
    try {
        const subjectId = req.body.subjectId || '';
        const data = {
            teacher: req.body.teacher || '',
            title: req.body.title || '',
            description: req.body.description || '',
            dateTime: req.body.dateTime || ''
        };
        const errorFieds = [];
        for (let [k, v] of Object.entries(data)) {
            if (!v) {
                errorFieds.push(k);
            }
        }
        if (!subjectId) {
            errorFieds.push('subjectId');
        }
        if (errorFieds.length) {
            throw new Error(`The announcement can not be published. The following fields are missing: ${errorFieds.join(', ')}.`);
        }
        const subjectExists = await subjectService.getSubjectById(subjectId);
        if (!subjectExists) {
            throw new Error(`A subject with "_id":"${subjectId}" could not be found.`);
        }
        const announ = await announcementSrvice.createNewAnnouncement(data);
        await subjectService.addAnnouncement(subjectId, announ._id);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'New Announcement Published!'
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

async function deleteAnnouncement(req, res) {
    try {
        // {
        //     subjectId: '675091d308014008e1005a78',
        //     announId: '6753ff53f689695ead1ef5bd'
        // }
        const subjectId = req.query.subjectId || '';
        const announId = req.query.announId || '';
        if (!subjectId || !announId) {
            throw new Error(`Can not delete announcement because of missing information. The provided values: subjectId: "${subjectId}"; announId: "${announId}".`);
        }
        const subjectExists = await subjectService.getSubjectById(subjectId);
        if (!subjectExists) {
            throw new Error(`A subject with "_id":"${subjectId}" could not be found.`);
        }
        await subjectService.removeAnnouncement(subjectId, announId);
        await announcementSrvice.deleteAnnouncementById(announId);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Announcement removed!'
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

export const announcement = {
    publishAnnouncement,
    deleteAnnouncement
}