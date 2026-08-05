const express = require('express');
const adminAuthRoutes = require('./adminAuthRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const questionRoutes = require('./questionRoutes');
const activationRoutes = require('./activationRoutes');
const applicationRoutes = require('./applicationRoutes');
const gameRoutes = require('./gameRoutes');
const syncRoutes = require('./syncRoutes');
const trainingRoutes = require('./trainingRoutes');

const router = express.Router();

router.use('/admin/auth', adminAuthRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);
router.use('/activate', activationRoutes);
router.use('/game', gameRoutes);
router.use('/sync', syncRoutes);
router.use('/training', trainingRoutes);
router.use('/questions', questionRoutes);

module.exports = router;
