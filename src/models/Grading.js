import { Schema, model } from 'mongoose';

const gradingSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    grades: [{
        type: Schema.Types.ObjectId,
        ref: 'Grade',
    }]
});

const Grading = model('Grading', gradingSchema);

export default Grading;