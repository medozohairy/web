import Cloth from "../models/cloth.js";
import { validationResult } from "express-validator";

export const createCloth = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {

    const clothData = {
      ...req.body,
      image: req.file ? `/img/uploads/clothes/${req.file.filename}` : null,
    };

    const cloth = await Cloth.create(clothData);
    res.status(201).json(cloth);
  } catch (err) {
    console.error("Error creating cloth:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getClothes = async (req, res) => {
  const clothes = await Cloth.find();
  res.json(clothes);
};

export const getCloth = async (req, res) => {
  const cloth = await Cloth.findById(req.params.id);
  if (!cloth) return res.status(404).json({ message: "Cloth not found" });
  res.json(cloth);
};

export const updateCloth = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const updateData = { ...req.body };
    
    // Handle image upload if a new image is provided
    if (req.file) {
      updateData.image = `/img/uploads/clothes/${req.file.filename}`;
    }

    const cloth = await Cloth.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!cloth) return res.status(404).json({ message: "Cloth not found" });
    res.json(cloth);
  } catch (err) {
    console.error("Error updating cloth:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteCloth = async (req, res) => {
  const cloth = await Cloth.findByIdAndDelete(req.params.id);
  if (!cloth) return res.status(404).json({ message: "Cloth not found" });
  res.json({ message: "Cloth deleted" });
};
