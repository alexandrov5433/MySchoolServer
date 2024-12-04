import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/serverConfig.js';

async function checkCookie(req, res, next) {
    if (req.cookies.user) {
        try {
            const result = new Promise((resolve, reject) => {
                jwt.verify(req.cookies.user, jwtSecret, (err, token) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                });
            });
            const token = await result;
            req.userSession = true;
            res.locals.userSession = true;
            req.cookies.user = token;
            next();
        } catch (e) {
            console.error(e);
            req.userSession = false;
            res.locals.userSession = false;
            next();
        }
    } else {
        req.userSession = false;
        res.locals.userSession = false;
        next();
    }
}

function authentificationMonitor(authType) {
    const funcs = {
        user: (req, res, next) => {
            return req.userSession ? next() : res.redirect('/404-page-not-found');
        },
        guest: (req, res, next) => {
            return !req.userSession ? next() : res.redirect('/404-page-not-found');
        }
    };
    return funcs[authType];
}

export {
    checkCookie,
    authentificationMonitor
};
