import parseError from "../service/errorParsing.js";

async function createNewSubject(req, res) {
    try {
        const title = req.body.title.trim();
        if (!title) {
            throw new Error('The subject title is missing. Please try again.');
        }
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: ['OK :)']
        }));
        res.end();




    } catch (error) {
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