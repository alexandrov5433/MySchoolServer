import { applicationService } from "../service/application.js";
import parseError from "../service/errorParsing.js";
import { userService } from "../service/user.js";
import { genDisplayId, genId } from "../util/idGenerator.js";
import path from 'node:path';
import { __basedir, bcryptSaltRounds } from "../config/serverConfig.js";
import { fileService } from "../service/file.js";
import { genParentalAuthCode } from "../util/parentalAuthCodeGenerator.js";
import bcrypt from 'bcrypt';

async function apply(req, res) {
    try {
        if (!req.files || Object.keys(req.files).length === 0 || req.body.documents === '') {
            throw new Error('The application cannot be submitted without documents.');
        }
        const data = {
            status: 'student', //only students can apply
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
        if (await userService.doesUserWithThisEmailExist(data.email)) {
            throw new Error(`A user with this email (${data.email}) alredy exists.`);
        }
        let profilePictureFile = null;
        const documentFiles = [];

        for (let file of Object.values(req.files)) {
            if (file.mimetype === 'application/pdf') {
                const originalName = file.name;
                const uniqueName = genId() + file.name;
                const pathToFile = path.normalize(
                    path.join(__basedir, '/storage/', uniqueName)
                );
                const mimeType = file.mimetype;
                const encoding = file.encoding;
                const documentData = {
                    originalName,
                    uniqueName,
                    pathToFile,
                    mimeType,
                    encoding
                };
                documentFiles.push(await fileService.createNewFile(documentData));
                await file.mv(documentData.pathToFile);
            } else if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
                if (profilePictureFile) {
                    continue;  //if somehow (hacked request) there is more than one png/jpeg
                }
                const originalName = file.name;
                const uniqueName = genId() + file.name;
                const pathToFile = path.normalize(
                    path.join(__basedir, '/storage/', uniqueName)
                );
                const mimeType = file.mimetype;
                const encoding = file.encoding;
                const uploadedPictureData = {
                    originalName,
                    uniqueName,
                    pathToFile,
                    mimeType,
                    encoding
                };
                profilePictureFile = await fileService.createNewFile(uploadedPictureData);
                await file.mv(uploadedPictureData.pathToFile);
            }
        }
        if (profilePictureFile === null) {
            //Profile picture missing
            const defaultProfilePictureData = {
                originalName: 'default-profile-picture.jpg',
                uniqueName: 'default-profile-picture.jpg',
                pathToFile: path.normalize(
                    path.join(__basedir, '/assets/', 'default-profile-picture.jpg')
                ),
                mimeType: 'image/jpeg',
                encoding: '7bit',
            };
            profilePictureFile = await fileService.createNewFile(defaultProfilePictureData);
            await file.mv(defaultProfilePictureData.pathToFile);
        }

        data.displayId = genDisplayId();
        data.activeStudent = false;
        data.uploadedDocuments = documentFiles.map(file => file._id);
        data.profilePicture = profilePictureFile._id;
        data.password = await bcrypt.hash(data.password, Number(bcryptSaltRounds));
        data.parentalAuthenticationCode = genParentalAuthCode();
        const newUser = await userService.createNewUser(data);
        const applicationData = {
            status: 'pending',
            applicationDocuments: documentFiles.map(file => file._id),
            applicant: newUser._id,
        };
        await applicationService.createNewApplication(applicationData);

        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'ok'
        }));
        res.end();
        console.log(`
            ##############################################################\n
            ####################   New Application   #####################\n
            \n
            ------------------------- User Data --------------------------\n
            _id: ${newUser._id}\n
            email: ${newUser.email}\n
            firstName: ${newUser.firstName}\n
            lastName: ${newUser.lastName}\n
            parentalAuthenticationCode: ${newUser.parentalAuthenticationCode}\n
            \n
            ##############################################################\n`);
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

async function getPendingApplications(req, res) {
    try {
        const studentFirstName = req.query.studentFirstName || '';
        const studentLastName = req.query.studentLastName || '';
        const studentDisplayId = req.query.studentDisplayId || '';
        const searchResults = await applicationService.getPendingApplications(studentFirstName, studentLastName, studentDisplayId);
        // payload = {
        //     results: [
        //         {
        //             _id: string,
        //             applicantName: string,
        //             displayId: string,
        //             profilePictureId: string
        //         }
        //     ]
        // }
        const payload = {};
        payload.results = searchResults.reduce((acc, cur) => {
            acc.push({
                _id: cur._id,
                applicantName: cur.applicant.firstName + ' ' + cur.applicant.lastName,
                displayId: cur.applicant.displayId,
                profilePictureId: cur.applicant.profilePicture
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

async function getPendingApplicationById(req, res) {
    try {
        const _id = req.params._id || '';
        const payload = await applicationService.getPendingApplicationById(_id);
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

async function manageApplication(req, res) {
    try {
        const _id = req.body._id || '';
        const action = req.body.action || '';
        if (!_id) {
            throw new Error(`For an application to be managed the "_id" must be present. The recieved value for "_id" is: "${_id}".`);
        } else if (!['accept', 'reject'].includes(action)) {
            throw new Error(`Incorrect "action". Possible values are "accept" and "reject". The recieved value for "action" is: "${action}".`);
        }
        const actionsLib = {
            accept: async (appId) => {
                const document = await applicationService.acceptPendingApplication(appId);
                if (document) {
                    const userId = document.applicant._id;
                    const applicantPromoted = await userService.promoteUserToStudent(userId);
                    if (applicantPromoted) {
                        return true;
                    }
                    throw new Error(`Could not promote user to student. User with "_id":"${userId}" not found.`);
                }
                return false;
            },
            reject: async (appId) => {
                const document = await applicationService.rejectPendingApplication(appId);
                return Boolean(document);
            }
        };
        const success = await actionsLib[action](_id);
        if (!success) {
            throw new Error(`A pending application with "_id":"${_id}" was not found. The "action":"${action}" could not be excuted. Please try again.`);
        }
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

export const application = {
    apply,
    getPendingApplications,
    getPendingApplicationById,
    manageApplication
};