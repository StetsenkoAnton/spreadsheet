import express from "express";
import documentRouter from "./document/document.router.mjs";

//const documentRouter = require('./document/document.router.mjs');

const API_V_1 = express.Router();

API_V_1.use('/document', documentRouter);

export default API_V_1;