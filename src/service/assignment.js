import Assignment from "../models/Assignment.js";
import { fileService } from "./file.js";
import { assignmentSubmitionService } from "./assignmentSubmition.js";

async function createNewAssignment(data) {
    return await Assignment.create(data);
}

async function getAssignmentById(_id) {
    return await Assignment.findById(_id);
}

async function addSolution(assignmentSubmitionId, assignmentId) {
    const assignment = await Assignment.findById(assignmentId);
    assignment.assignmentSubmitions.push(assignmentSubmitionId);
    assignment.save();
    return assignment;
}

async function deleteAssignmentSubmitionOfStudent(assignmentId, studentId) {
    const assignment = await Assignment.findById(assignmentId).populate({ path: 'assignmentSubmitions', populate: { path: 'document'}});
    const assignmentSubmition = assignment.assignmentSubmitions.find( a => a.student == studentId); //student is not populated -> only string ID
    // assignmentSubmition = {
    //     _id: new ObjectId('675467cbaac04dc166e62700'),
    //     student: new ObjectId('6751dd938a4ccb0c14d08fe5'),
    //     document: {
    //       _id: new ObjectId('675467cbaac04dc166e626fe'),
    //       originalName: 'First.pdf',
    //       uniqueName: 'f6a27bc3-c677-41fc-b136-4035fef91d6eFirst.pdf',
    //       pathToFile: 'D:\\Code Files\\Angular - Oct 2024\\Project MySchool\\MySchoolServer\\storage\\f6a27bc3-c677-41fc-b136-4035fef91d6eFirst.pdf',
    //       mimeType: 'application/pdf',
    //       encoding: '7bit',
    //       __v: 0
    //     },
    //     __v: 0
    //   }
    if (assignmentSubmition) {
        fileService.deleteFileFromSystem(assignmentSubmition.document.pathToFile); //pormise, but no need to await
        const idToRemove = assignmentSubmition._id;
        await assignmentSubmitionService.deleteAssignmentSubmitionById(assignmentSubmition._id);
        const assignmentSame = await Assignment.findById(assignmentId);
        assignmentSame.assignmentSubmitions = assignmentSame.assignmentSubmitions.reduce((acc, cur) => {
            if (cur.toString() == idToRemove.toString()) {
                return acc;
            }
            acc.push(cur);
            return acc;
        }, []); 
        //cur = _id because assignmentSubmitions is not populated
        const newAssignment = await assignmentSame.save();
        return true;
    }
    return false;
}

export const assignmentService = {
    createNewAssignment,
    getAssignmentById,
    addSolution,
    deleteAssignmentSubmitionOfStudent
}