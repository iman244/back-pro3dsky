import mongoose from 'mongoose';
export const DesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: true,
    },
    keyList: [
      {
        type: String,
        required: true,
        unique: true,
      },
    ],
  },
  { timestamps: true },
);
