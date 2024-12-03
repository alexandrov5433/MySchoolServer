import path from 'node:path';

import { __basedir } from "../config/serverConfig.js";
import parseError from "../service/errorParsing.js";
import { fileService } from "../service/file.js";
import { userService } from "../service/user.js";
import genId from "../util/idGenerator.js";
import { authenticationSrvice } from '../service/authentication.js';


async function login(req, res) {
    try {
        const loginData = {
            loginAs: req.body.loginAs,
            email: req.body.email,
            password: req.body.password
        }
        if (!['parent','student','teacher'].includes(loginData.loginAs)) {
            throw new Error(`The login status "${loginData.loginAs}" is invalid. Options are: parent, student or teacher.`);
        }
        
        const searchResult = await userService.findByLoginDetails(loginData);

        if (!searchResult) {
            throw new Error('A user with these credentials does not exist.');
        }
        const isPasswordCorrect = await authenticationSrvice.comparePassToHash(loginData.password, searchResult.password);
        if (!isPasswordCorrect) {
            throw new Error('Wrong password.');
        }
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: ['ok']
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

async function register(req, res) {
    try {
        const authenticationCode = req.body.authenticationCode || null;
        const registerData = {
            status: req.body.registerAs,
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
        const codeCheckResult = await authenticationSrvice.checkAuthCode(authenticationCode);
        if (codeCheckResult !== registerData.status) {
            throw new Error('Opps! Either the authentication code is wrong or you have selected the wrong status (parent or teacher).');
        }
        
        let newFile = null;
        if (req.files && Object.keys(req.files).length !== 0) {
            const file = req.files.profilePicture;
            const originalName = file.name;
            const uniqueName = genId() + file.name;
            const pathToFile = path.normalize(`${__basedir}/storage/${uniqueName}`);
            const mimeType = file.mimetype;
            const encoding = file.encoding;
            const newFileData = {
                originalName,
                uniqueName,
                pathToFile,
                mimeType,
                encoding,
            };
            newFile = await fileService.createNewFile(newFileData);
            await file.mv(pathToFile);
        } else {
            const newFileData = {
                originalName: 'default-profile-picture.jpg',
                uniqueName: 'default-profile-picture.jpg',
                pathToFile: path.normalize(
                    path.join(__basedir, '/assets/', 'default-profile-picture.jpg')
                ),
                mimeType: 'image/jpeg',
                encoding: '7bit',
            };
            newFile = await fileService.createNewFile(newFileData);
        }

        registerData.profilePicture = newFile._id;
        registerData.displayId = genId().slice(0, 12);
        await userService.createNewUser(registerData);
     
        if (registerData.registerAs === 'parent') {
            console.log('TODO add parent to student'); //TODO add parent to student
        }
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: ['ok']
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