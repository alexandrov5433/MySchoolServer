import { Schema, model } from "mongoose";

const formSchema = new Schema({
    file: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    }
});

const Form = model('Form', formSchema);

export default Form;