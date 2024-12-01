import { Schema, model } from 'mongoose';

const subjectSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    materials: [{
        type: Schema.Types.ObjectId,
        ref: 'File',
    }],
    displayId: {
        type: String,
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    assignments: [{
        type: Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    announcements: [{
        type: Schema.Types.ObjectId,
        ref: 'Announcements'
    }],

});

const Subject = model('Subject', subjectSchema);

export default Subject;