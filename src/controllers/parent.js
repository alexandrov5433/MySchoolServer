import parseError from "../service/errorParsing.js";
import { userService } from "../service/user.js";


async function getChildren(req, res) {
    try {
        const parentId = req.params.parentId || '';
        if (!parentId) {
            throw new Error(`ParentId is missing. Value provided for parentId: "${parentId}".`);
        }
        const payload = {};
        const children = await userService.getChildrenForParent(parentId);
        if (!children) {
            throw new Error(`Parent with _id:"${parentId}" does not exist.`)
        }
        payload.results = children;
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
async function addChildForParent(req, res) {
    try {
        const parentId = req.params.parentId || '';
        const authCode = req.body.authCode || '';
        if (!parentId) {
            throw new Error(`ParentId is missing. Value provided for parentId: "${parentId}".`);
        }
        if (!authCode) {
            throw new Error(`Parental authentication code is missing. Value provided for authCode: "${authCode}".`);
        }
        await userService.checkCodeAndAddChild(parentId, authCode);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Student added!'
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

export const parent = {
    getChildren,
    addChildForParent
};