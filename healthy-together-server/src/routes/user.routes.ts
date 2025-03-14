import express from 'express';
import { protect } from '../middleware/auth.middleware';
import HealthRecord from '../models/health.model';

const router = express.Router();

// 获取用户个人资料
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// 获取体重历史记录
router.get('/weight-history', protect, async (req, res) => {
  try {
    const records = await HealthRecord.find({
      user: req.user._id,
      type: 'weight'
    }).sort({ date: 1 }); // 按日期升序排序

    // 格式化数据
    const dates = records.map(record => record.date.toISOString().split('T')[0]);
    const weights = records.map(record => record.data.weight);

    res.json({
      success: true,
      data: {
        dates,
        weights
      }
    });
  } catch (error) {
    console.error('Error fetching weight history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weight history'
    });
  }
});

export default router;
