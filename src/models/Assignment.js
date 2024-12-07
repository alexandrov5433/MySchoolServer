import { Schema, model } from 'mongoose';

const assignmentSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    resource: {
        type: Schema.Types.ObjectId,
        ref: 'File',
    },
    assignmentSubmitions: [{
        type: Schema.Types.ObjectId,
        ref: 'AssignmentSubmition',
    }]
});

const Assignment = model('Assignment', assignmentSchema);

export default Assignment;