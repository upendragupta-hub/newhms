import Facility from "../models/Facility.js";

// GET All Facilities
const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();

    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch facilities",
      error: error.message,
    });
  }
};



// ADD Facility
const addFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);

    res.status(201).json(facility);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add facility",
      error: error.message,
    });
  }
};



// DELETE Facility
const deleteFacility = async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Facility Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete facility",
      error: error.message,
    });
  }
};



// UPDATE Facility
const updateFacility = async (req, res) => {
  try {
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedFacility);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update facility",
      error: error.message,
    });
  }
};



export  {
  getFacilities,
  addFacility,
  deleteFacility,
  updateFacility,
};