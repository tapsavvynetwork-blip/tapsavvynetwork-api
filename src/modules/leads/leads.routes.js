import express from 'express';
import { protect } from '../../middlewares/auth.js';
import { createLead, listLeads, scanImage } from './leads.controller.js';

const router = express.Router();

router.post('/', protect, createLead);
router.get('/', protect, listLeads);
router.post('/scan', protect, scanImage);

export default router;
