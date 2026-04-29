import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import '../database/config.js';

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares(); 
  }

 
  middlewares() {
    this.app.use(cors()); 
    this.app.use(morgan("dev")); 
    this.app.use(express.json()); 
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    console.log(__filename);
    console.log(__dirname);
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

 
  listen() {
    this.app.listen(this.port, () => {
      console.info(`server inciiado: http://127.0.0.1:${this.port}`);
    });
  }
}