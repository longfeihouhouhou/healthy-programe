import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HealthRecord from '../models/health.model';
import User from '../models/user.model';

// 加载环境变量
dotenv.config();

async function initTestData() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    // 清除所有健康记录
    await HealthRecord.deleteMany({});
    console.log('Cleared all health records');

    // 查找测试用户
    const testUser = await User.findOne({ username: 'test' });
    console.log('Found test user:', testUser?._id);
    if (!testUser) {
      console.error('Test user not found');
      process.exit(1);
    }

    // 清除用户的健康数据
    testUser.healthData = {
      weight: [],
      weightDates: [],
      exerciseDays: [],
      dietDays: []
    };
    await testUser.save();
    console.log('Reset user health data');

    // 删除该用户现有的体重记录
    await HealthRecord.deleteMany({
      user: testUser._id,
      type: 'weight'
    });

    // 生成过去30天的体重数据
    const today = new Date();
    const weightRecords = [];
    
    // 基础体重在65-67之间波动
    let baseWeight = 66;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(8, 0, 0, 0); // 设置为每天早上8点
      
      // 添加一些随机波动，但保持在合理范围内
      const dailyVariation = (Math.random() - 0.5) * 0.4; // ±0.2kg的随机波动
      const trendVariation = (i - 15) * 0.02; // 添加轻微的趋势变化
      const weight = +(baseWeight + dailyVariation + trendVariation).toFixed(1);
      
      weightRecords.push({
        user: testUser._id,
        date,
        type: 'weight',
        data: { weight }
      });
    }

    // 批量插入记录
    await HealthRecord.insertMany(weightRecords);
    console.log('Successfully initialized test weight data');

    // 添加一些运动记录
    const exerciseTypes = ['跑步', '游泳', '骑行', '健身'];
    const exerciseRecords = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(18, 0, 0, 0); // 设置为每天晚上6点
      
      if (Math.random() > 0.3) { // 70%的概率有运动记录
        exerciseRecords.push({
          user: testUser._id,
          date,
          type: 'exercise',
          data: {
            exerciseType: exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)],
            exerciseDuration: Math.floor(Math.random() * 30) + 30 // 30-60分钟
          }
        });
      }
    }

    await HealthRecord.insertMany(exerciseRecords);
    console.log('Successfully initialized test exercise data');

    // 添加一些饮食记录
    const dietRecords = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(19, 0, 0, 0); // 设置为每天晚上7点
      
      if (Math.random() > 0.2) { // 80%的概率有饮食记录
        dietRecords.push({
          user: testUser._id,
          date,
          type: 'diet',
          data: {
            dietType: '健康饮食',
            calories: Math.floor(Math.random() * 500) + 1500 // 1500-2000卡路里
          }
        });
      }
    }

    await HealthRecord.insertMany(dietRecords);
    console.log('Successfully initialized test diet data');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing test data:', error);
    process.exit(1);
  }
}

initTestData();
