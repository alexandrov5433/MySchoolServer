import path from 'node:path';

import { __basedir, bcryptSaltRounds } from "../config/serverConfig.js";
import parseError from "../service/errorParsing.js";
import { fileService } from "../service/file.js";
import { userService } from "../service/user.js";
import { genDisplayId } from "../util/idGenerator.js";
import { authenticationSrvice } from '../service/authentication.js';
import bcrypt from 'bcrypt';


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
        if (loginData.loginAs === 'student') {
            const isStudent = userService.isActiveStudent(loginData.email);
            if (!isStudent) {
                throw new Error(`There is no active student with this email address: "${loginData.email}". You may apply to become one. If you already have, we are still reviewing your application.`);
            }
        }
        const existingUser = await userService.findByLoginDetails(loginData);
        if (!existingUser) {
            throw new Error('A user with these credentials does not exist.');
        }
        const isPasswordCorrect = await authenticationSrvice.comparePassToHash(loginData.password, existingUser.password);
        if (!isPasswordCorrect) {
            throw new Error('Wrong password.');
        }
        const cookie = await authenticationSrvice.generateCookie(existingUser._id, existingUser.status);
        console.log(cookie);
        
        res.status(200);
        res.cookie('user', `${cookie}`, { secure: false, httpOnly: false });
        res.json(JSON.stringify({
            status: 200,
            msg: 'ok',
            user_id: existingUser._id
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
        registerData.displayId = genDisplayId();
        registerData.password = await bcrypt.hash(registerData.password, Number(bcryptSaltRounds));
        const newUser = await userService.createNewUser(registerData);
     
        if (registerData.status === 'parent') {
            console.log('TODO add parent to student'); //TODO add parent to student
        }

        const cookie = await authenticationSrvice.generateCookie(newUser._id, newUser.status);
        res.status(200);
        res.cookie('user', `${cookie}`, { secure: false, httpOnly: false });
        res.json(JSON.stringify({
            status: 200,
            msg: 'ok',
            user_id: newUser._id
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

async function logout(req, res) {
    try {
        if (!req.userSession) {
            throw new Error('There is no logged in user.')
        }
        res.status(200);
        res.cookie('user', '', { secure: false, httpOnly: false, maxAge: 0 });
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
    register,
    logout
};