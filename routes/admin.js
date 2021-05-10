const router = require("express").Router();
const controller = require("../controllers/adminController");
const { upload } = require("../middleware/multer");

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
router.get("/bookings", controller.viewBooking);

module.exports = router;
