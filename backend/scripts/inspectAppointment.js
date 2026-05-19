import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';

dotenv.config();

const id = process.argv[2] || '6a0aaa79759f4721acddd7ff';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const appt = await Appointment.findById(id).lean();
    console.log(JSON.stringify(appt, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

run();
