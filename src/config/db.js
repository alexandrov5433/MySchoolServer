import { connect } from "mongoose";
import { dbUrl } from './serverConfig.js';

//models
import Announcement from '../models/Announcement.js';
import Application from "../models/Application.js";
import Assignment from '../models/Assignment.js';
import AssignmentSubmition from "../models/AssignmentSubmition.js";
import File from "../models/File.js";
import Grade from '../models/Grade.js';
import Grading from '../models/Grading.js';
import Subject from "../models/Subject.js";
import User from "../models/User.js";
import FaqEntry from "../models/FaqEntry.js";
import Form from "../models/Form.js";

async function configDb() {
    try {
        await connect(dbUrl);
        console.log('Connection to DB successfull!');
        return true;
    } catch (error) {
        console.error(`Failed to connect to DB: Error: ${error}`);
        return false;
    }
}

export default configDb;