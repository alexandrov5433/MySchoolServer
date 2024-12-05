import Application from "../models/Application.js";

async function createNewApplication(data) {
    return await Application.create(data);
}

 /**
  * 
  * Returns an array of applications with status "pending".
  * @param {String} firstName Students (User) first name.
  * @param {String} lastName Students (User) last name.
  * @param {String} displayId Students (User) displayId.
  */
async function getPendingApplications(firstName, lastName, displayId) {
    
}

export const applicationService = {
    createNewApplication,
    getPendingApplications
};