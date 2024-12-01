import { Schema, model } from 'mongoose';

const gradeSchema = new Schema({
    value: {
        type: Number,
        required: true
    }
});

const Grade = model('Grade', gradeSchema);

export default Grade;