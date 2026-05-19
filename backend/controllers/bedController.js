import Bed from "../models/Bed.js";

export const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find().sort({ ward: 1, roomNumber: 1 });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bed inventory.",
      error: error.message,
    });
  }
};

export const getBedSummary = async (req, res) => {
  try {
    const total = await Bed.countDocuments();
    const available = await Bed.countDocuments({ status: "available" });
    const occupied = await Bed.countDocuments({ status: "occupied" });
    const maintenance = await Bed.countDocuments({ status: "maintenance" });

    res.status(200).json({
      success: true,
      summary: {
        total,
        available,
        occupied,
        maintenance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bed summary.",
      error: error.message,
    });
  }
};

export const addBed = async (req, res) => {
  try {
    const { ward, roomNumber, type, status, patientName, notes } = req.body;

    if (!roomNumber) {
      return res.status(400).json({
        success: false,
        message: "Room number is required.",
      });
    }

    const bed = await Bed.create({
      ward: ward || "General",
      roomNumber,
      type: type || "General",
      status: status || "available",
      patientName: patientName || "",
      notes: notes || "",
    });

    res.status(201).json({ success: true, bed });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add the bed.",
      error: error.message,
    });
  }
};

export const updateBed = async (req, res) => {
  try {
    const updates = req.body;
    const bed = await Bed.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found.",
      });
    }

    res.status(200).json({ success: true, bed });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update bed details.",
      error: error.message,
    });
  }
};

export const deleteBed = async (req, res) => {
  try {
    const deletedBed = await Bed.findByIdAndDelete(req.params.id);

    if (!deletedBed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bed deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete bed.",
      error: error.message,
    });
  }
};
