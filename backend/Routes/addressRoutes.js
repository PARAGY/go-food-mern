import express from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress } from "../controllers/addressController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .post(protect, addAddress)
  .get(protect, getAddresses);

router.route("/:id")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;
