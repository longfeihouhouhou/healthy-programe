import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  addExercise,
  addDiet,
  getHealthGoals,
  setHealthGoals,
  getHealthRecords,
  getWeightHistory,
  addWeight,
  getHealthStats
} from '../controllers/health.controller';

const router = express.Router();

// 运动相关路由
router.post('/exercise', protect, addExercise);

// 饮食相关路由
router.post('/diet', protect, addDiet);

// 体重相关路由
router.post('/weight', protect, addWeight);
router.get('/weight/history', protect, getWeightHistory);

// 健康目标相关路由
router.get('/goals', protect, getHealthGoals);
router.post('/goals', protect, setHealthGoals);

// 健康记录相关路由
router.get('/records', protect, getHealthRecords);
router.get('/stats', protect, getHealthStats);

export default router;
