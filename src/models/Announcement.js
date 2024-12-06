import { Schema, model } from 'mongoose';

const announcementSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    }
});

const Announcement = model('Announcement', announcementSchema);

export default Announcement;