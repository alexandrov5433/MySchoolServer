export const jwtSecret = process.env.JWT_SECRET || 'thisSecretShouldBeStoredInA.ENVFile';
export const authCookieName = process.env.AUTH_COOKIE_NAME || 'mySchoolAuthCookie';
export const port = process.env.PORT || 3000;
export const dbName = process.env.DB_NAME || 'mySchoolProject';
export const dbPort = process.env.DB_PORT || '27017';
export const dbDomain = process.env.DB_DOMAIN || '127.0.0.1';
export const bcryptSaltRounds = process.env.BCRYPT_SALT_ROUNDS || 9;
export const teacherAuthCode = process.env.TEACHER_AUTH_CODE || '123';
