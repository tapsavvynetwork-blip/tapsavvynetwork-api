import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import connectionsRoutes from '../modules/connections/connections.routes.js';
import leadsRoutes from '../modules/leads/leads.routes.js';
import networkRoutes from '../modules/networkBook/network.routes.js';
import teamsRoutes from '../modules/teams/teams.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import localeRoutes from '../modules/locale/locale.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/connections', connectionsRoutes);
router.use('/leads', leadsRoutes);
router.use('/network-book', networkRoutes);
router.use('/teams', teamsRoutes);
router.use('/admin', adminRoutes);
router.use('/locale', localeRoutes);
router.get('/', (req, res) => res.json({ success: true, message: 'API is running' }));

export default router;
