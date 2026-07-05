import express from 'express';
import { listDirectory } from './network.controller.js';

const router = express.Router();

router.get('/', listDirectory);

export default router;
