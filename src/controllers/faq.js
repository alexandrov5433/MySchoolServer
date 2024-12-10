import { faqService } from "../service/faq.js";


async function createNewFaqEntry(req, res) {
    try {
        const question = req.body.question || '';
        const answer = req.body.answer || '';
        if (!question || !answer) {
            throw new Error(`Faq entry can not be created as a needed value is missing. Values provided: question: "${question}", answer: "${answer}".`);
        }
        await faqService.createNewFaqEntry(question, answer);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'A new answer was published!'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}

async function getAllFaqData(req, res) {
    try {
        const searchResults = await faqService.getAllFaqEntries();
        const payload = {
            results: searchResults
        }
        console.log(payload);
        
        res.status(200);
        res.json(JSON.stringify(payload));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}

async function deleteFaqEntry(req, res) {
    try {
        const entryId = req.params._id || '';
        if (!entryId) {
            throw new Error(`The faq entry can not be deleted because the value for _id is not valid. _id:"${entryId}".`);
        }
        await faqService.deleteFaqEntryById(entryId);
        res.status(200);
        res.json(JSON.stringify({
            status: 200,
            msg: 'Faq entry deleted.'
        }));
        res.end();
    } catch (e) {
        console.log(e);
        res.status(400);
        res.json(JSON.stringify({
            status: 400,
            msg: parseError(e).errors
        }));
        res.end();
    }
}

export const faq = {
    createNewFaqEntry,
    getAllFaqData,
    deleteFaqEntry
};