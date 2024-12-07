import { assignmentService } from '../service/assignment.js';
import { assignmentSubmitionService } from '../service/assignmentSubmition.js';
import { fileService } from '../service/file.js';
import { subjectService } from '../service/subject.js';

async function createAssignment(req, res) {
    try {
        const subjectId = req.body.subjectId || '';
        const assignmentData = {
            teacher: req.body.teacher || '',
            title: req.body.title || '',
            description: req.body.description || '',
            deadline: req.body.deadline || ''
        }
        let resourceFile = null; // File document in DB
        if (req.files?.resource) {
            resourceFile = await fileService.saveIncommingFile(req.files.resource);
        }
        if (resourceFile) {
            assignmentData.resource = resourceFile._id;
        }
        const newAssignment = await assignmentService.createNewAssignment(assignmentData);
        await subjectService.addAssignment(subjectId, newAssignment._id);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Assignment created!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}

async function uploadSolution(req, res) {
    try {
        const assignmentId = req.body.assignmentId || '';
        const studentId = req.body.studentId || '';
        const file = req.files?.solution || '';
        if (!file) {
            throw new Error(`A file must be uploaded is order to post a solution.`);
        }
        if (!studentId) {
            throw new Error(`A Solution can not be posted without the students Id. Recieved studentId: "${studentId}".`);
        }
        if (!assignmentId) {
            throw new Error(`A Solution can not be posted without the assignments Id. Recieved assignmentId: "${assignmentId}".`);
        }
        //check if submition exists and if so, delete;
        const existingAssignmentWithSolution = await assignmentService.deleteAssignmentSubmitionOfStudent(assignmentId, studentId);
        //save solution
        const solutionFile = await fileService.saveIncommingFile(file);
        const assignmentSubmition = await assignmentSubmitionService.createNewAssignmentSubmition({
            student: studentId,
            document: solutionFile._id
        });
        const updatedAssignment = await assignmentService.addSolution(assignmentSubmition._id, assignmentId);
        if (!updatedAssignment) {
            throw new Error('The assignment could not be updated. Please try again.');
        }
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Solution uploaded!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}

export const assignment = {
    createAssignment,
    uploadSolution
}