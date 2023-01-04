import express from "express";
import { logger } from "../../logger.mjs";

import DocumentController from "../../controller/document.controller.mjs";

const documentRouter = express.Router();

documentRouter
  .get("/", (req, res, next) => {
    const documentController = new DocumentController();
    documentController
      .getDocuments()
      .then((files) => res.json(files))
      .catch((error) => {
        logger.error(error);
        next(error);
      });
  })
  .get("/:name", async (req, res) => {
    const documentController = new DocumentController();
    res.json(
      await documentController.getDocument(req.params.name, req.session.sid)
    );
  });

export default documentRouter;