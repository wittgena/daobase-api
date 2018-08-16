import express from 'express';
import * as controller from './nonce.controller';

const router = express.Router();
router.get('/', controller.get);

module.exports = router;
