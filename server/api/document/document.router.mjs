import express from "express";

import { DocumetController } from "../../controller/document.controller.mjs";

const documentRouter = express.Router();

documentRouter
.get('/', (req, res, next) => {
    const documentController = new DocumetController();
    documentController.getDocuments()
        .then(files => res.json(files))
        .catch(error => {
            next(error);
        })
})
.get('/:name', (req, res) => {
    const documentController = new DocumetController();
    res.json(documentController.getDocument(req.params.name));
})

documentRouter

export default documentRouter;