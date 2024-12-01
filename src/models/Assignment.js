import { Schema, model } from 'mongoose';

const assignmentSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
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
        required: true
    },
    assignmentSubmitions: [{
        type: Schema.Types.ObjectId,
        ref: 'AssignmentSubmition',
        required: true
    }]
});

const Assignment = model('Assignment', assignmentSchema);

export default Assignment;