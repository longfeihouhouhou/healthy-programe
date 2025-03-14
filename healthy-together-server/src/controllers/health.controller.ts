import { Request, Response } from 'express';
import HealthRecord from '../models/health.model';

// 添加运动记录
export const addExercise = async (req: Request, res: Response) => {
  try {
    const { type, duration, date } = req.body;
    const userId = req.user?.id;

    const record = await HealthRecord.create({
      user: userId,
      date: date || new Date(),
      type: 'exercise',
      data: {
        exerciseType: type,
        exerciseDuration: duration
      }
    });

    res.status(201).json({
      success: true,
      record
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 添加饮食记录
export const addDiet = async (req: Request, res: Response) => {
  try {
    const { type, calories, date } = req.body;
    const userId = req.user?.id;

    const record = await HealthRecord.create({
      user: userId,
      date: date || new Date(),
      type: 'diet',
      data: {
        dietType: type,
        calories
      }
    });

    res.status(201).json({
      success: true,
      record
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 获取用户的健康目标
export const getHealthGoals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const goals = await HealthRecord.findOne({
      user: userId,
      type: 'goals'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      goals: goals?.data || {
        exerciseMinutes: 30,
        exerciseDays: 5,
        calories: 2000
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 设置健康目标
export const setHealthGoals = async (req: Request, res: Response) => {
  try {
    const { exerciseMinutes, exerciseDays, calories } = req.body;
    const userId = req.user?.id;

    const goals = await HealthRecord.create({
      user: userId,
      date: new Date(),
      type: 'goals',
      data: {
        exerciseMinutes,
        exerciseDays,
        calories
      }
    });

    res.status(201).json({
      success: true,
      goals
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 获取健康记录
export const getHealthRecords = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { type, date, limit = 10 } = req.query;

    const query: any = { user: userId };
    let start: Date | undefined;
    let end: Date | undefined;

    if (type) {
      query.type = type;
    }
    if (date) {
      const [year, month, day] = (date as string).split('-').map(Number);
      start = new Date(year, month - 1, day, 0, 0, 0);  // 设置为当天 00:00 本地时间
      end = new Date(year, month - 1, day + 1, 0, 0, 0);  // 设置为第二天 00:00 本地时间
      query.date = { 
        $gte: start,
        $lt: end
      };
    }

    console.log('Query:', JSON.stringify(query, null, 2));
    console.log('Start:', start?.toISOString());
    console.log('End:', end?.toISOString());

    const records = await HealthRecord.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    console.log('Found records:', records);

    res.json({
      success: true,
      data: {
        records
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 获取体重历史记录
export const getWeightHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { days = 7 } = req.query; // 默认查询最近一周的数据

    // 获取今天的日期（北京时间）
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0); // 设置为北京时间早上8点，确保UTC时间在当天

    // 设置查询的开始时间为 days 天前
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (Number(days) - 1)); // 修改这里：减去 days-1 天，这样才能包含今天

    // 设置查询的结束时间为今天的最后一刻
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    console.log('Query dates:', {
      today: today.toISOString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    // 获取体重记录
    const records = await HealthRecord.find({
      user: userId,
      type: 'weight',
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    console.log('Found records:', records.map(r => ({
      date: r.date,
      weight: r.data?.weight
    })));

    // 生成日期数组（确保包含今天）
    const dates = [];
    const weights = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);
      
      // 如果这天有记录，使用记录的值；否则使用前一天的值
      const weight = records.find(record => record.date.toISOString().split('T')[0] === dateStr)?.data?.weight || null;
      weights.push(weight);
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const response = {
      success: true,
      data: {
        dates,
        weights
      }
    };

    console.log('Response:', {
      firstDate: dates[0],
      lastDate: dates[dates.length - 1],
      datesCount: dates.length,
      recordsCount: records.length,
      lastWeight: weights[weights.length - 1]
    });

    console.log('Debug Info:', {
      endDate: endDate.toISOString(),
      generatedDates: dates
    });

    res.json(response);
  } catch (error: any) {
    console.error('Error in getWeightHistory:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 添加体重记录
export const addWeight = async (req: Request, res: Response) => {
  try {
    const { weight } = req.body;
    const userId = req.user?.id;

    // 使用服务器当前时间（已设置为北京时间）
    const now = new Date();
    const recordDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0); // 设置为北京时间早上8点

    console.log('Adding weight record:', {
      serverTime: now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
      recordDate: recordDate.toISOString(),
      weight
    });

    const record = await HealthRecord.create({
      user: userId,
      date: recordDate,
      type: 'weight',
      data: {
        weight
      }
    });

    res.status(201).json({
      success: true,
      record
    });
  } catch (error: any) {
    console.error('Error in addWeight:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 获取用户的健康统计数据
export const getHealthStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // 获取本周运动记录
    const exerciseRecords = await HealthRecord.find({
      user: userId,
      type: 'exercise',
      date: { $gte: startOfWeek }
    });

    // 获取本周饮食记录
    const dietRecords = await HealthRecord.find({
      user: userId,
      type: 'diet',
      date: { $gte: startOfWeek }
    });

    // 获取最近的体重记录
    const latestWeight = await HealthRecord.findOne({
      user: userId,
      type: 'weight'
    }).sort({ date: -1 });

    // 获取前一周的平均体重
    const lastWeekStart = new Date(startOfWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekWeights = await HealthRecord.find({
      user: userId,
      type: 'weight',
      date: {
        $gte: lastWeekStart,
        $lt: startOfWeek
      }
    });

    const lastWeekAvg = lastWeekWeights.reduce((sum, record) => sum + record.data.weight, 0) / 
                       (lastWeekWeights.length || 1);

    const weightTrend = latestWeight ? 
      Number((latestWeight.data.weight - lastWeekAvg).toFixed(1)) : 0;

    res.json({
      success: true,
      data: {
        exercise: exerciseRecords.length,
        diet: dietRecords.length,
        weight: latestWeight?.data.weight || 0,
        weightTrend
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
