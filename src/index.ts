require('dotenv').config();
import 'module-alias/register';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import createMongoConnection from '$helpers/mongo';
import log from '$helpers/log';
import config from '$config';
import logRequest from '$middlewares/logRequest';
import limiter from '$middlewares/limiter';
import './require';
import { RootRoute } from '$helpers/route';

const logger = log('Index');

const app = express();
const http = createServer(app);

createMongoConnection()
  .then(() => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    /* -------------------------------------------------------------------------- */
    /*                        Logging all request to server                       */
    /* -------------------------------------------------------------------------- */
    app.use(logRequest);

    /* -------------------------------------------------------------------------- */
    /*                     Limit maximum 300 req/1m from 1 IP                     */
    /* -------------------------------------------------------------------------- */
    app.use(limiter());

    /* -------------------------------------------------------------------------- */
    /*                            Register API endpoint                           */
    /* -------------------------------------------------------------------------- */
    app.use(RootRoute);

    /* -------------------------------------------------------------------------- */
    /*                                 Run server                                 */
    /* -------------------------------------------------------------------------- */
    http.listen(config.SERVER.PORT, () => {
      logger.info(
        `Express server started on port ${config.SERVER.PORT}. Environment: ${config.SERVER.NODE_ENV}`
      );
    });
  })
  .catch((error) => {
    logger.error(error);
  });
