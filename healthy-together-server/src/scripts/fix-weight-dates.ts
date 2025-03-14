import mongoose from 'mongoose';
import HealthRecord from '../models/health.model';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function fixWeightDates() {
  try {
    // 连接数据库
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthy-together';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 获取所有体重记录
    const records = await HealthRecord.find({ type: 'weight' });
    console.log(`Found ${records.length} weight records`);

    // 修改每条记录的时间
    for (const record of records) {
      const originalDate = new Date(record.date);
      
      // 获取年月日
      const year = originalDate.getUTCFullYear();
      const month = originalDate.getUTCMonth();
      const day = originalDate.getUTCDate();
      
      // 创建北京时间零点的新日期
      const newDate = new Date(Date.UTC(year, month, day, -8, 0, 0));

      console.log(`Converting date:`, {
        recordId: record._id,
        weight: record.data?.weight,
        originalDate: originalDate.toISOString(),
        newDate: newDate.toISOString()
      });

      // 更新记录
      await HealthRecord.updateOne(
        { _id: record._id },
        { $set: { date: newDate } }
      );
    }

    console.log('All weight records have been updated');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixWeightDates();
