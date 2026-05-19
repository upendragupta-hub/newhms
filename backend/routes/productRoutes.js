import express from "express";
import { getSingleProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/:id", getSingleProduct);

export default router;