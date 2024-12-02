
async function checkAuthCode(code) {
    if (code === '1') {
        return 'parent';
    } else if (code === '2') {
        return 'teacher';
    }
    return null;
}

export const autorizationSrvice = {
    checkAuthCode
};