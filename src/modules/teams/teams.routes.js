import express from 'express';
import { protect } from '../../middlewares/auth.js';
import { createTeam, addMember, listTeams } from './teams.controller.js';

const router = express.Router();

router.post('/', protect, createTeam);
router.post('/:id/members', protect, addMember);
router.get('/', protect, listTeams);

export default router;
