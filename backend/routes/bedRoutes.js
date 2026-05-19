import express from "express";
import {
  getBeds,
  getBedSummary,
  addBed,
  updateBed,
  deleteBed,
} from "../controllers/bedController.js";

const router = express.Router();

router.get("/", getBeds);
router.get("/summary", getBedSummary);
router.post("/", addBed);
router.put("/:id", updateBed);
router.delete("/:id", deleteBed);

export default router;
