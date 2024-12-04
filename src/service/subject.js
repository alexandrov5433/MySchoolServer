import Subject from "../models/Subject.js";

async function createNewSubject(data) {
    return await Subject.create(data);
}

export const subjectService = {
    createNewSubject
};