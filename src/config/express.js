import { urlencoded, static as static_ } from "express";
import cookieParser from "cookie-parser";
import { checkCookie } from "../service/userSession.js";

function configExpress(app) {
    app.use(urlencoded({extended: false}));
    app.use('/static', static_('static'));
    app.use(cookieParser());
    app.use(checkCookie);
}

export default configExpress;