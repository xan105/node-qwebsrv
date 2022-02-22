#!/usr/bin/env node

/*
MIT License

Copyright (c) Anthony Beaumont

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
  port: isIntegerPositive(process.env.npm_package_config_port) ? process.env.npm_package_config_port : 80,
  proxy: process.env.npm_package_config_proxy || false,
  cors: process.env.npm_package_config_cors ?? true,
  root: isStringNotEmpty(process.env.npm_package_config_root) ? process.env.npm_package_config_root : "./docs",
  index: isArrayOfStringNotEmpty(process.env.npm_package_config_index) ? process.env.npm_package_config_index : ["index.html"], 
  etag: process.env.npm_package_config_etag || false,
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