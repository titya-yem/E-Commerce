import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${process.env.MONGODB_URI}`);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;