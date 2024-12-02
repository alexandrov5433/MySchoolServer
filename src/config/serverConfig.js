export const jwtSecret = process.env.JWT_SECRET || 'thisSecretShouldBeStoredInA.ENVFile';
export const authCookieName = process.env.AUTH_COOKIE_NAME || 'mySchoolAuthCookie';
export const port = process.env.PORT || 3000;
export const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/mySchoolProject';
export const bcryptSaltRounds = process.env.BCRYPT_SALT_ROUNDS || 9;
export const teacherAuthCode = process.env.TEACHER_AUTH_CODE || '123';
export const origin = process.env.ORIGIN.split(',') || ['http://localhost:5555', 'http://localhost:4200'];
