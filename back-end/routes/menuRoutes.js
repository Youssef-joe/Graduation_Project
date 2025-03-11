const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const authMiddleware = require("../middlewares/auth");

// Public routes
router.get("/", menuController.getMenu);
router.get("/category/:category", menuController.getMenuByCategory);

// Protected routes (admin only)
router.post("/", authMiddleware(["admin"]), menuController.addItem);
router.put("/:id", authMiddleware(["admin"]), menuController.updateItem);
router.delete("/:id", authMiddleware(["admin"]), menuController.deleteItem);
router.patch(
  "/:id/toggle",
  authMiddleware(["admin"]),
  menuController.toggleAvailability
);

module.exports = router;
