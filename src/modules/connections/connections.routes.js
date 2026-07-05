import express from 'express';
import { protect } from '../../middlewares/auth.js';
import { sendRequest, listIncoming, respond, listConnections, removeConnection } from './connections.controller.js';

const router = express.Router();

router.post('/request', protect, sendRequest);
router.get('/requests', protect, listIncoming);
router.post('/:id/respond', protect, respond);
router.get('/my', protect, listConnections);
router.delete('/:id', protect, removeConnection);

export default router;
