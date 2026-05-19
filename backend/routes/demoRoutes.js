import express from 'express';
import { bookDemo, getAllDemoRequests } from '../controllers/demoController.js'; // .js एक्सटेंशन याद रखें

const router = express.Router();

// पब्लिक रूट - डेमो बुक करने के लिए
router.post('/book', bookDemo);

// एडमिन रूट - सारे डेमो देखने के लिए
router.get('/all', getAllDemoRequests);

export default router;