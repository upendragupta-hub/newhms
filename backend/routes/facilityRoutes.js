import express from "express";

import {
  getFacilities,
  getFacility,
  addFacility,
  deleteFacility,
  updateFacility,
} from "../controllers/facilityController.js";

const router = express.Router();


// GET
router.get("/", getFacilities);
router.get("/:id", getFacility);


// POST
router.post("/", addFacility);


// DELETE
router.delete("/:id", deleteFacility);


// UPDATE
router.put("/:id", updateFacility);


export default router;