import { Request, Response } from 'express';
import HealthRecord from '../models/health.model';

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // 获取打卡天数（不同日期的记录数）
    const distinctDates = await HealthRecord.distinct('date', {
      user: userId
    });
    const daysCount = distinctDates.length;

    // 获取运动记录数
    const exerciseCount = await HealthRecord.countDocuments({
      user: userId,
      type: 'exercise'
    });

    // 获取饮食记录数
    const dietCount = await HealthRecord.countDocuments({
      user: userId,
      type: 'diet'
    });

    res.json({
      success: true,
      stats: {
        days: daysCount,
        exercise: exerciseCount,
        diet: dietCount
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
