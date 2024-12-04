import { Schema, model } from 'mongoose';

const subjectSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
        ref: 'User'
    }],
    assignments: [{
        type: Schema.Types.ObjectId,
        ref: 'Assignment'
    }],
    announcements: [{
        type: Schema.Types.ObjectId,
        ref: 'Announcements'
    }],
    backgroundImageNumber: {
        type: String,
    }
});

subjectSchema.pre('save', async function () {
    const num = randomNumber(1, 7);
    this.backgroundImageNumber = `${num}.jpg`;
    function randomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

const Subject = model('Subject', subjectSchema);

export default Subject;