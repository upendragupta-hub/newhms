import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
  title: String,
  description: String,
   image: {
    type: String,
    required: true,
  },
});

 export default new mongoose.model("Facility", facilitySchema);