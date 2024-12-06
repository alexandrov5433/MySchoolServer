import { Schema, model } from 'mongoose';

const assignmentSubmitionSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    document: {
        type: Schema.Types.ObjectId,
        ref: 'File',
        required: true
    }
});

const AssignmentSubmition = model('AssignmentSubmition', assignmentSubmitionSchema);

export default AssignmentSubmition;