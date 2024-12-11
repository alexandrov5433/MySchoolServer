import path from 'node:path';

import { __basedir, bcryptSaltRounds } from "../config/serverConfig.js";
import parseError from "../service/errorParsing.js";
import { fileService } from "../service/file.js";
import { userService } from "../service/user.js";
import { genDisplayId } from "../util/idGenerator.js";
import { authenticationService } from '../service/authentication.js';
import bcrypt from 'bcrypt';
import { genId } from '../util/idGenerator.js';


async function login(req, res) {
    try {
        const loginData = {
            loginAs: req.body.loginAs,
            email: req.body.email,
            password: req.body.password
        }
        if (!['parent', 'student', 'teacher'].includes(loginData.loginAs)) {
            throw new Error(`The login status "${loginData.loginAs}" is invalid. Options are: parent, student or teacher.`);
        }
        if (loginData.loginAs === 'student') {
            const isStudent = await userService.isActiveStudent(loginData.email);
            if (!isStudent) {
                throw new Error(`There is no active student with this email address: "${loginData.email}". You may apply to become one. If you already have, we are still reviewing your application.`);
            }
        }
        const existingUser = await userService.findByLoginDetails(loginData);
        if (!existingUser) {
            throw new Error('A user with these credentials does not exist.');
        }
        const isPasswordCorrect = await authenticationService.comparePassToHash(loginData.password, existingUser.password);
        if (!isPasswordCorrect) {
            throw new Error('Wrong password.');
        }
        const cookie = await authenticationService.generateCookie(existingUser._id, existingUser.status);
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
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            dateOfBirth: req.body.dateOfBirth.trim(),
            email: req.body.email.trim(),
            mobileNumber: req.body.mobileNumber.trim(),
            homeNumber: req.body.homeNumber.trim(),
            street: req.body.street.trim(),
            houseNumber: req.body.houseNumber.trim(),
            city: req.body.city.trim(),
            password: req.body.password.trim()
        }
        if (await userService.doesUserWithThisEmailExist(registerData.email)) {
            throw new Error(`A user with this email (${registerData.email}) alredy exists.`);
        }
        if (!['parent', 'teacher'].includes(registerData.status)) {
            throw new Error(`You have given a wrong status. Options are: parent or teacher. Given status:"${registerData.registerAs}".`);
        }
        let codeCheckResult;
        if (registerData.status === 'teacher') {
            codeCheckResult = authenticationService.checkAuthCodeForTeacher(authenticationCode);
        } else if (registerData.status === 'parent') {
            codeCheckResult = await authenticationService.checkAuthCodeForParent(authenticationCode);
        }
        if (registerData.status === 'teacher' && !codeCheckResult) {
            throw new Error('Opps! Either the authentication code is wrong or you have selected the wrong status (parent or teacher).');
        } else if (registerData.status === 'parent' && !codeCheckResult) {
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
        if (registerData.status === 'parent') {
            registerData.children = [`${codeCheckResult._id}`];
        }
        const newUser = await userService.createNewUser(registerData);

        if (registerData.status === 'parent') {
            await userService.addParentToStudent(codeCheckResult._id, newUser._id);
        }
        const cookie = await authenticationService.generateCookie(newUser._id, newUser.status);
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