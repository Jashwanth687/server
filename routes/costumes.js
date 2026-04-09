var express = require('express');
var router = express.Router();
var costume_controller = require('../controllers/costume');

// A little function to check if we have an authorized user and continue on
router.get('/', costume_controller.costume_view_all_Page);

module.exports = router;
