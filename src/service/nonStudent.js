import NonStudent from "../models/NonStudent.js";

async function createNewNonStudent(data) {
    return await NonStudent.create(data);
}

export const nonStudentService = {
    createNewNonStudent
};