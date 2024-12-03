import { teacherAuthCode } from "../config/serverConfig.js";

async function checkAuthCode(code) {
    if (code === '1') {
        return 'parent';
    } else if (code === teacherAuthCode) {
        return 'teacher';
    }
    return null;
}

export const autorizationSrvice = {
    checkAuthCode
};