import express from "express";

import {
  getCustomers,
  getCustomerById,
} from "../controllers/customerController.js";

const router = express.Router();

// GET /api/customers
router.get("/", getCustomers);

// GET /api/customers/:id
router.get("/:id", getCustomerById);

export default router;