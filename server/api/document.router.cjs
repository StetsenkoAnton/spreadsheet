const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    return res.json(['doc', 'doc2', 'doc3']);
});

module.exports = router;