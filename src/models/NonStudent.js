import { Schema, model } from 'mongoose';

const nonStudentSchema = new Schema({
    authStatus: {
        type: String,
        required: true
    },
    userData: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    }
});

const NonStudent = model('NonStudent', nonStudentSchema);

export default NonStudent;