const express = require('express');
const documentRouter = require('./document.router.cjs');

const router = express.Router();

router.use('/document', documentRouter);

module.exports = router;