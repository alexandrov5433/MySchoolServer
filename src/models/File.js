import { Schema, model } from 'mongoose';

const fileSchema = new Schema({

});

const File = model('File', fileSchema);

export default File;