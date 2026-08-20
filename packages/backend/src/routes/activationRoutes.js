const express = require('express');
const activationController = require('../controllers/activationController');

const router = express.Router();

router.get('/:token', activationController.getActivation);
router.post('/:token', activationController.postActivation);

module.exports = router;
