import AssignmentSubmition from "../models/AssignmentSubmition.js";

async function createNewAssignmentSubmition(data) {
    return await AssignmentSubmition.create(data);
}

async function deleteAssignmentSubmitionById(_id) {
    return await AssignmentSubmition.findByIdAndDelete(_id);
}

export const assignmentSubmitionService = {
    createNewAssignmentSubmition,
    deleteAssignmentSubmitionById
};