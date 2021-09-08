// Configuration of apm is inside .env file variables.
const apm = require("elastic-apm-node/start");

import express from "express";
import { AddressInfo } from "net";
import * as http from "http";

import * as expressWinston from "express-winston";
import cors from "cors";
import Logger from "./Logger";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;

app.use(express.json({ limit: "64mb" }));

// adding middleware to allow cross-origin requests
app.use(cors());

// logging middleware configuration, which will automatically log all HTTP requests handled by Express.js
const visibleRequestMetas = ["url", "headers", "method", "httpVersion", "originalUrl", "query", "session"];

const loggerOptions: expressWinston.LoggerOptions = {
    transports: Logger.logsTransports(),
    format: Logger.logsFormat(),
    requestWhitelist: visibleRequestMetas,
};

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

const testEndpoint = (inputBody: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        Logger.info("testEndpoint called")
        resolve(inputBody);
    });
};

app.route(`/test`).post((req: express.Request, res: express.Response) => {
    testEndpoint(req.body)
        .then((results) => {
            res.status(200).send(results);
        })
        .catch((e) => {
            Logger.error(e.stack);
            res.status(500).send(e);
        });
});

server.listen(port, "0.0.0.0", () => {
    const addressInfo = server.address() as AddressInfo;
    let hostAddress = "";
    let hostPort = 0;

    if (addressInfo) {
        hostAddress = addressInfo.address;
        hostPort = addressInfo.port;
    }

    const runningMessage = `Server running at ${hostAddress}:${hostPort}`;
    Logger.info(runningMessage);
});
