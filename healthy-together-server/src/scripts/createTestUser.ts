import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';

// 加载环境变量
dotenv.config();

async function createTestUser() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // 创建测试用户
    const testUser = new User({
      username: 'test',
      email: 'test@example.com',
      password: 'test123',
      healthData: {
        weight: [],
        weightDates: [],
        exerciseDays: [],
        dietDays: []
      },
      social: {
        followers: [],
        following: []
      },
      settings: {
        notifications: {
          exercise: true,
          diet: true,
          weight: true
        },
        goals: {
          weight: 65,
          exercise: 5
        }
      }
    });

    await testUser.save();
    console.log('Test user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
