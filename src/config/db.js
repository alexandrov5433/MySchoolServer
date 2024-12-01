import { connect } from "mongoose";
import { dbDomain, dbName, dbPort } from './src/config/serverConfig.js';

async function configDb() {
    try {
        // await connect('mongodb://127.0.0.1:27017/someDBName');
        await connect(`mongodb://${dbDomain}:${dbPort}/${dbName}`);
        console.log('Connection to DB successfull!');
        return true;
    } catch (error) {
        console.error(`Failed to connect to DB: Error: ${error}`);
        return false;
    }
}

export default configDb;