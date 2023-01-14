import express from "express";

import DocumentController from "../../controller/document.controller.mjs";

const documentRouter = express.Router();

documentRouter
  .get("/", (req, res) => {
    const documentController = new DocumentController();
    return documentController
      .getDocuments()
      .then((response) => res.json(response))
      .catch((error) => {
        res.json(error);
      });
  })
  .get("/:name", async (req, res) => {
    const documentController = new DocumentController();
    res.json(
      await documentController.getDocument(req.params.name, req.session.sid)
    );
  });

export default documentRouter;