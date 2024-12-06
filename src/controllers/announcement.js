import { announcementSrvice } from "../service/announcement.js";

async function publishAnnouncement(req, res) {
    try {
        console.log(req.body);
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
        if (errorFieds.length) {
            throw new Error(`The announcement can not be published. The following fields are missing: ${errorFieds.join(', ')}.`);
        }
        await announcementSrvice.createNewAnnouncement(data);
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

export const announcement = {
    publishAnnouncement
}