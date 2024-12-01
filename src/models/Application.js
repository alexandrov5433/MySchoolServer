import { Schema, model } from 'mongoose';

const applicationSchema = new Schema({
    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: 'The value "{VALUE}" is not acceptable as application status. Options are: "pending", "accepted" or "rejected".'
        },
        required: [true, 'Application status is required.']
    },
    applicationDocuments: [{
        type: Schema.Types.ObjectId,
        ref: 'File',
        required: [true, 'Application documents are required.']
    }],
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Applicant ID is required.']
    }
});

const Application = model('Application', applicationSchema);

export default Application;