import Application from "../models/Application.js";

async function createNewApplication(data) {
    return await Application.create(data);
}

export const applicationService = {
    createNewApplication
};