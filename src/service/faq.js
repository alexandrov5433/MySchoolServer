import FaqEntry from "../models/FaqEntry.js";

async function getAllFaqEntries() {
    const results = await FaqEntry.find();
    results.reverse();
    return results;
}

async function createNewFaqEntry(question, answer) {
    return await FaqEntry.create({question, answer});
}

async function deleteFaqEntryById(_id) {
    return await FaqEntry.findByIdAndDelete(_id);
}

export const faqService = {
    getAllFaqEntries,
    createNewFaqEntry,
    deleteFaqEntryById
};