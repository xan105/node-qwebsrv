#!/usr/bin/env node

/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import cors from "cors";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import { 
  isStringNotEmpty, 
  isArrayOfStringNotEmpty, 
  isIntegerPositive 
} from "@xan105/is";
import logger from "@xan105/log";
const debug = new logger({ console: true });

const options = {
  host: isStringNotEmpty(process.env.npm_package_config_localhost) ? process.env.npm_package_config_localhost : "localhost",
  port: isIntegerPositive(+process.env.npm_package_config_port) ? +process.env.npm_package_config_port : 80,
  proxy: process.env.npm_package_config_proxy === "true" ? true : false,
  cors: process.env.npm_package_config_cors === "false" ? false : true,
  root: isStringNotEmpty(process.env.npm_package_config_root) ? process.env.npm_package_config_root : "./docs",
  index: isArrayOfStringNotEmpty(process.env.npm_package_config_index?.split("\n\n")) ? process.env.npm_package_config_index.split("\n\n") : ["index.html"], 
  etag: process.env.npm_package_config_etag === "true" ? true : false,
  maxAge: isStringNotEmpty(process.env.npm_package_config_maxAge) ? process.env.npm_package_config_maxAge : "1m"
};

//Init express and related modules
const app = express();
app.disable('x-powered-by');
if (options.proxy) app.enable("trust proxy");
app.use(helmet());
if (options.cors) app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/", express.static(options.root, {
  index: options.index,
  etag: options.etag,
  maxAge: options.maxAge
}));

//Start the server
app.listen(options.port, options.host, () => { 
  debug.log(`Listening on [${options.host}]:${options.port}`);
}).on('error', (err) => debug.error(err));