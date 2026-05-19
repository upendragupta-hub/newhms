import DemoRequest from '../models/DemoRequest.js'; // ध्यान दें: ES Module में .js लिखना जरूरी होता है

// @desc    Create a new demo request
// @route   POST /api/demo/book
// @access  Public
export const bookDemo = async (req, res) => {
  try {
    const { fullName, email, phone, hospitalName, preferredDate, notes } = req.body;

    if (!fullName || !email || !phone || !hospitalName || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the required fields.'
      });
    }

    const newDemoRequest = await DemoRequest.create({
      fullName,
      email,
      phone,
      hospitalName,
      preferredDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Demo request scheduled successfully!',
      data: newDemoRequest
    });

  } catch (error) {
    console.error('Error in bookDemo Controller:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again later.',
      error: error.message
    });
  }
};


export const getAllDemoRequests = async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};