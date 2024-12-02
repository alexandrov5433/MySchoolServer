import path from 'node:path';

import { __basedir } from "../config/serverConfig.js";
import parseError from "../service/errorParsing.js";
import { fileService } from "../service/file.js";
import { userService } from "../service/user.js";
import genId from "../util/idGenerator.js";
import { autorizationSrvice } from '../service/authorization.js';

async function login(req, res) {
    console.log('Received request at login.');
    console.log('Headers:', req.headers);
    console.log('Body', req.body);
    res.status(200);
    res.end();
}
const defaultUserPicPath = path.normalize(
    path.join(__basedir, '/storage/default/')
);
async function register(req, res) {
    try {
        const authenticationCode = req.body.authenticationCode || null;
        const registerData = {
            registerAs: req.body.registerAs,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            homeNumber: req.body.homeNumber,
            street: req.body.street,
            houseNumber: req.body.houseNumber,
            city: req.body.city,
            password: req.body.password
        }
        console.log(req.body);
        const codeCheckResult = await autorizationSrvice.checkAuthCode(authenticationCode);
        if (codeCheckResult !== registerData.registerAs) {
            throw new Error('Opps! Either the authentication code is wrong or you have selected the wrong status (parent or teacher).');
        }
        const newUser = await userService.registerNewUser(registerData);
        let newFile = null;
        if (req.files && Object.keys(req.files).length !== 0) {
            const file = req.files.profilePicture;
            const originalName = file.name;
            const uniqueName = genId() + file.name;
            const pathToFile = path.normalize(`${__basedir}/storage/${uniqueName}`);
            const mimeType = file.mimetype;
            const encoding = file.encoding;
            await file.mv(pathToFile);
            const newFileData = {
                originalName,
                uniqueName,
                pathToFile,
                mimeType,
                encoding,
            };
            newFile = await fileService.createNewFile(newFileData);
        } else {
            const newFileData = {
                originalName: 'default-profile-picture.jpg',
                uniqueName: 'default-profile-picture.jpg',
                pathToFile: path.normalize(
                    path.join(__basedir, '/storage/default/', 'default-profile-picture.jpg')
                ),
                mimeType: 'image/jpeg',
                encoding: 'none',
            };
            newFile = await fileService.createNewFile(newFileData);
        }
        const nonStudentData = {
            authStatus: registerData.registerAs,
            userData: newUser?._id,
            profilePicture: newFile._id
        };
        await userService.createNewNonStudent(nonStudentData)
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'ok'
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

export const user = {
    login,
    register
};