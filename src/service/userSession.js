import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/serverConfig.js';

function checkCookie(req, res, next) {
    if (req.cookies.user) {
        jwt.verify(req.cookies.user, jwtSecret, (err, token) => {
            if (err) {
                console.log(err);
                req.userSession = false;
                res.locals.userSession = false;
                next();
            } else {
                req.userSession = true;
                res.locals.userSession = true;
                req.cookies.user = token;
                next();
            }
        });
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
