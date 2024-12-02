import { connect } from "mongoose";
import { dbUrl } from './serverConfig.js';

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