import { Schema, model } from 'mongoose';

const gradeSchema = new Schema({
    value: {
        type: String,
        required: true
    }
});

const Grade = model('Grade', gradeSchema);

export default Grade;