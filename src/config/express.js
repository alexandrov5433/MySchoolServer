import { urlencoded, json } from "express";
import cookieParser from "cookie-parser";
import { authenticationService } from '../service/authentication.js';
import fileUpload from "express-fileupload";

function configExpress(app) {
    app.use(urlencoded({extended: false}));
    app.use(json());
    app.use(cookieParser());
    app.use(authenticationService.checkCookie);
    app.use(fileUpload());
}

export default configExpress;