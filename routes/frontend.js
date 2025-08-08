import express from "express";
import Cloth from "../models/cloth.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Order from "../models/order.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
// Middleware to check for user from JWT
router.use(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.locals.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("cart.items.cloth");

    res.locals.user = user || null;
    next();
  } catch (error) {
    console.error("JWT middleware error:", error);
    res.locals.user = null;
    return next();
  }
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = 8; // Clothes per page
  const skip = (page - 1) * limit;

  const [clothes, total] = await Promise.all([
    Cloth.find().skip(skip).limit(limit),
    Cloth.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.render("index", {
    clothes,
    currentPage: page,
    totalPages,
  });
});

router.get("/profile", auth(["user"]), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.cloth")
      .sort({ createdAt: -1 });

    res.render("profile", { user: req.user, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server error");
  }
});

router.get("/user", async (req, res) => {
  res.redirect("/");
});

router.get("/about-us", async (req, res) => {
  res.render("about-us");
});

router.get("/contact-us", async (req, res) => {
  res.render("contact-us");
});

router.get("/admin", auth(["admin"]), async (req, res) => {
  res.render("admin", {
    users: await User.find(),
    clothes: await Cloth.find(),
    orders: await Order.find().populate("user").sort({ createdAt: -1 }),
  });
});

export default router;
