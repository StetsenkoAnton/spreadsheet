import express from "express";

import DocumentController from "../../controller/document.controller.mjs";

const documentRouter = express.Router();

documentRouter
  .get("/", (req, res, next) => {
    const documentController = new DocumentController();
    documentController
      .getDocuments()
      .then((files) => res.json(files))
      .catch((error) => {
        next(error);
      });
  })
  .get("/:name", (req, res) => {
    const documentController = new DocumentController();
    res.json(documentController.getDocument(req.params.name, req.session.sid));
  });

export default documentRouter;