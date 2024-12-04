import { teacherAuthCode } from "../config/serverConfig.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret, jwtAlgorithm, jwtExparation } from '../config/serverConfig.js';

/**
 * Verifies the the authentication code by registration of parents and teachers.
 * @param {string} code
 * The authentication code with which the user registers as parent or teacher. 
 * @returns {string|null} 
 * Null return value is for wrong code. The strings 'parent' or 'teacher' mean that the code is valid for the given status as a returned string.
 */
async function checkAuthCode(code) {
    if (code === '1') {
        return 'parent';
    } else if (code === teacherAuthCode) {
        return 'teacher';
    }
    return null;
}

/**
 * Verifies the given password aginst the given hash.
 * @param {string} plainText 
 * Password in plaintext from client.
 * @param {string} hash
 * Password in ciphertext from DB. 
 * @returns 
 */
async function comparePassToHash(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
}

/**
 * Middleware which validates the JWT in the parsed coockie.
 * @param {Request} req 
 * @param {Response} res 
 * @param {import('express').NextFunction} next 
 */
async function checkCookie(req, res, next) {
    if (req.cookies.user) {
        try {
            const result = new Promise((resolve, reject) => {
                jwt.verify(req.cookies.user, jwtSecret, { algorithms: [`${jwtAlgorithm}`]}, (err, token) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(token);
                });
            });
            const token = await result;
            req.userSession = true;
            req.cookies.user = token;
            next();
        } catch (e) {
            console.error(e);
            req.userSession = false;
            next();
        }
    } else {
        req.userSession = false;
        next();
    }
}

/**
 * Returns a middleware that checks every request for the needed authentication.
 * @param {string} authType
 * Options: guest, allUsers or specificUserStatus. If guest or allUsers is given, second param is ignored.
 * @param {string} requiredStatus 
 * Options: parent, student or teacher.
 */
function authGuard(authType, requiredStatus='') {
    const funcs = {
        specificUserStatus: (req, res, next) => {
            const user = req.cookies.user;
            if (!user || user.status !== requiredStatus) {
                console.error('Unauthorized request.');
                res.status(401);
                res.json(JSON.stringify({
                    status: 401,
                    msg: [`This request is not authorized for non-users and users with status "${user.status}".`]
                }));
                res.end();
                return;
            }
            return next();
        },
        allUsers: (req, res, next) => {
            const user = req.cookies.user;
            if (!user || !['parent', 'teacher', 'student'].includes(user.status)) {
                console.error('Unauthorized request.');
                res.status(401);
                res.json(JSON.stringify({
                    status: 401,
                    msg: ['This request is not authorized for non-users. Please log in and try again.']
                }));
                res.end();
                return;
            }
            return next();
        },
        guest: (req, res, next) => {
            const user = req.cookies.user;
            if (user || user.status) {
                console.error('Unauthorized request.');
                res.status(401);
                res.json(JSON.stringify({
                    status: 401,
                    msg: ['This request is not authorizes. A user is already logged in.']
                }));
                res.end();
                return;
            }
            return next();
        }
    };
    return funcs[authType];
}
/**
 * Generates the JWT which will be set as a cookie 'user'.
 * @param {string} id 
 * The _id of this users User document in the DB.
 * @param {string} status 
 * Options: parent, teacher or student.
 */
async function generateCookie(id, status) {
    return new Promise((resolve, reject) => {
        jwt.sign({ id, status }, jwtSecret, { algorithm: jwtAlgorithm, expiresIn: jwtExparation }, (err, token) => {
            if (err) {
                return reject(err);
            }
            return resolve(token);
        });
    });
}

export const authenticationSrvice = {
    checkAuthCode,
    comparePassToHash,
    checkCookie,
    authGuard,
    generateCookie
};