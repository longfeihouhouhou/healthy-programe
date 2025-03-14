import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['weight', 'exercise', 'diet'],
    required: true
  },
  data: {
    weight: Number,
    exerciseType: String,
    exerciseDuration: Number,
    dietType: String,
    calories: Number
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
healthRecordSchema.index({ user: 1, date: -1, type: 1 });

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;
