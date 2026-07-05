import express from 'express';
import { protect } from '../../middlewares/auth.js';
import { permit } from '../../middlewares/rbac.js';
import { listUsers, updateUserRole } from './admin.controller.js';

const router = express.Router();

router.get('/users', protect, permit('admin','superadmin'), listUsers);
router.patch('/users/:id/role', protect, permit('superadmin'), updateUserRole);

export default router;
