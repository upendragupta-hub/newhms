import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const id = process.argv[2] || '6a0979282affd4b3621fe7f8';
const token = jwt.sign({ id }, process.env.JWT_SECRET || 'apni_secret_key', { expiresIn: '7d' });
console.log(token);
