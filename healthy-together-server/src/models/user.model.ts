import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  healthData: {
    weight: number[];
    weightDates: Date[];
    exerciseDays: Date[];
    dietDays: Date[];
  };
  social: {
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
  };
  settings: {
    notifications: {
      exercise: boolean;
      diet: boolean;
      weight: boolean;
    };
    goals: {
      weight?: number;
      exercise?: number;
    };
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  bio: {
    type: String,
    maxlength: 200
  },
  healthData: {
    weight: [Number],
    weightDates: [Date],
    exerciseDays: [Date],
    dietDays: [Date]
  },
  social: {
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  settings: {
    notifications: {
      exercise: { type: Boolean, default: true },
      diet: { type: Boolean, default: true },
      weight: { type: Boolean, default: false }
    },
    goals: {
      weight: Number,
      exercise: Number
    }
  }
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model<IUser>('User', userSchema);
