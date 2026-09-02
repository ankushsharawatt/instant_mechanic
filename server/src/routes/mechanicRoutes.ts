import express from "express";

import {
  getMechanics,
  getMechanicById,
} from "../controllers/mechanicController.js";

const router = express.Router();

// GET /api/mechanics
router.get("/", getMechanics);

// GET /api/mechanics/:id
router.get("/:id", getMechanicById);

export default router;