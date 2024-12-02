import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
    originalName: {
        type: String,
        required: true
    },
    uniqueName: {
        type: String,
        required: true
    },
    pathToFile: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    encoding: {
        type: String,
        required: true
    },
});

const File = model('File', fileSchema);

export default File;