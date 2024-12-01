import { Schema, model } from 'mongoose';

const teacherSchema = new Schema({
    userData: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Teacher = model('Teacher', teacherSchema);

export default Teacher;