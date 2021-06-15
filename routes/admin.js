const router = require("express").Router();
const controller = require("../controllers/adminController");
const { upload, uploadMultiple } = require("../middleware/multer");

router.get("/", controller.viewDashboard);
router.get("/categories", controller.viewCategory);
router.post("/categories", controller.addCategory);
router.put("/categories/:id", controller.updateCategory);
router.delete("/categories/:id", controller.deleteCategory);
router.get("/banks", controller.viewBank);
router.post("/banks", upload, controller.addBank);
router.put("/banks/:id", upload, controller.updateBank);
router.delete("/banks/:id", controller.deleteBank);
router.get("/items", controller.viewItem);
router.post("/items", uploadMultiple, controller.addItem);
router.put("/items/:itemId", uploadMultiple, controller.updateItem);
router.delete("/items/:itemId", controller.deleteItem);
router.get("/items/:itemId/media", controller.viewMedia);
router.post("/items/:itemId/media", uploadMultiple, controller.addMedia);
router.delete("/items/:itemId/media/:mediaId", controller.deleteMedia);
router.get("/bookings", controller.viewBooking);

module.exports = router;
