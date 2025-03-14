import express from 'express';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 临时路由，后续会添加具体功能
router.get('/feed', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Social routes working'
  });
});

export default router;
