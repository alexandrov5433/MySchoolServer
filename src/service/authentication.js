import { teacherAuthCode } from "../config/serverConfig.js";
import bcrypt from 'bcrypt';

async function checkAuthCode(code) {
    if (code === '1') {
        return 'parent';
    } else if (code === teacherAuthCode) {
        return 'teacher';
    }
    return null;
}

async function comparePassToHash(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
}

export const authenticationSrvice = {
    checkAuthCode,
    comparePassToHash
};