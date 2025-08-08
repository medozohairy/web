import express from "express";
import {
  createCloth,
  getClothes,
  getCloth,
  updateCloth,
  deleteCloth,
} from "../controllers/cloth.js";
import {
  createClothValidator,
  updateClothValidator,
} from "../validators/cloth.validator.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single('image'), createClothValidator, createCloth);
router.get("/", getClothes);
router.get("/:id", getCloth);
router.put("/:id", upload.single('image'), updateClothValidator, updateCloth);
router.delete("/:id", deleteCloth);

export default router;
