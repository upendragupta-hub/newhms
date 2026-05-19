import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const appointmentId = process.argv[2] || '6a0aaa79759f4721acddd7ff';
const token = process.argv[3] || '';

const run = async () => {
  try {
    const res = await axios.post(
      `http://localhost:${process.env.PORT || 5000}/api/appointments/${appointmentId}/razorpay-order`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('STATUS', res.status);
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.error('RESPONSE STATUS', err.response.status);
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }
  }
};

run();
