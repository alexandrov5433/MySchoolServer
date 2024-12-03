import { Schema, model } from 'mongoose';

const studentSchema = new Schema({
    userData: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentalAuthenticationCode: {
        type: String,
        required: true
    },
    uploadedDocuments: [{
        type: Schema.Types.ObjectId,
        ref: 'File',
    }],
    displayId: {
        type: String,
        required: true
    },
    parents: [{
        type: Schema.Types.ObjectId,
        ref: 'NonStudent',
    }]
});

const Student = model('Student', studentSchema);

export default Student;