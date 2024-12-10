import { Schema, model } from "mongoose";

const faqEntrySchema = new Schema({
    question: {
        type: String,
        rerquired: true
    },
    answer: {
        type: String,
        rerquired: true
    }
});

const FaqEntry = model('FaqEntry', faqEntrySchema);

export default FaqEntry;