import 'dotenv/config'
import express from 'express';
import cors from 'cors';

import * as serverConfig from './src/config/serverConfig.js';
import configDb from './src/config/db.js';
import configExpress from './src/config/express.js';
import router from './src/router/index.js';

(async function runServer() {
    const isDBConnected = await configDb();
    if (isDBConnected) {
        const app = express();
        configExpress(app);
        app.use(cors({
            origin: serverConfig.origin,
            credentials: true
        }));
        app.use('/', router);
        app.listen(serverConfig.port, () => console.log(`Server started on port:${serverConfig.port}.`));
    }
})();

