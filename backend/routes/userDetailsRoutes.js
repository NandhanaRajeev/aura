import express from "express";
import {
    addUserDetails,
    getDetailsByEmail,
    updateDetailsByEmail,
} from "../controllers/user_detailsController.js";

const router = express.Router();

router.post("/", addUserDetails);
router.get("/:email", getDetailsByEmail);
router.put("/:email", updateDetailsByEmail);

export default router;
