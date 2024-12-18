import 'dotenv/config'
import express from 'express';
import cors from 'cors';

import pool from './src/db/db.js';
import initTables from './src/db/initialization.js';
import * as serverConfig from './src/config/serverConfig.js';
import configExpress from './src/config/express.js';
import router from './src/router/index.js';

(async function runServer() {
    try {
        await initTables();
        const app = express();
        configExpress(app);
        app.use(cors({
            origin: serverConfig.origin,
            credentials: true
        }));
        app.use('/', router);
        app.listen(serverConfig.port, () => console.log(`Server started on port:${serverConfig.port}.`));
    } catch (error) {
        console.error(error);
    }
})();

