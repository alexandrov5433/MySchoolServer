import { userService } from "../service/user.js";
import parseError from "../service/errorParsing.js";


async function getActiveStudents(req, res) {
    try {
        const firstName = req.query.firstName || '';
        const lastName = req.query.lastName || '';
        const displayId= req.query.displayId || '';
        const searchResults = await userService.getActiveStudents(firstName, lastName, displayId);
        const payload = {};
        payload.results = searchResults;
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

export const students = {
    getActiveStudents
}