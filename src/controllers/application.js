import { applicationService } from "../service/application.js";
import parseError from "../service/errorParsing.js";
import { userService } from "../service/user.js";
import genId from "../util/idGenerator.js";
import path from 'node:path';
import { __basedir } from "../config/serverConfig.js";
import { fileService } from "../service/file.js";

async function apply(req, res) {
    try {
        if (!req.files || Object.keys(req.files).length === 0 || req.body.documents === '') {
            throw new Error('The application cannot be submitted without documents.');
        }
        const data = {
            registerAs: 'student', //only students can apply
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

export const application = {
    apply
};