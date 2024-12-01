import { Schema, model } from 'mongoose';

const parentSchema = new Schema({
    userData: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }]
});

const Parent = model('Parent', parentSchema);

export default Parent;