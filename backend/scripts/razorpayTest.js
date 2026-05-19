import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

try {
  if (!keyId || !keySecret) {
    throw new Error('missing keys');
  }
  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await rzp.orders.create({ amount: 100, currency: 'INR', receipt: 'test_receipt', payment_capture: 1 });
  console.log('order', order);
} catch (err) {
  console.error('razorpay test error:', err);
}
