const router = require("express").Router();
const controller = require("../controllers/adminController");

router.get("/", controller.viewDashboard);
router.get("/categories", controller.viewCategory);
router.post("/categories", controller.addCategory);
router.put("/categories/:id", controller.updateCategory);
router.delete("/categories/:id", controller.deleteCategory);
router.get("/banks", controller.viewBank);
router.get("/items", controller.viewItem);
router.get("/bookings", controller.viewBooking);

module.exports = router;
