const Category = require("../models/Category");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard", { title: "Dashboard" });
  },
  viewCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      res.render("admin/table_page", {
        title: "Category",
        headers: [{ title: "Name", type: "text", isRequired: true }],
        url: req.originalUrl,
        sets: categories,
        alert: { message: alertMessage, status: alertStatus },
      });
    } catch (error) {
      console.error(error);
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;

      await Category.create({ name });
      req.flash("alertMessage", `New Category Added: ${name}`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/categories");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/categories");
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      const oldName = category.name;

      category.name = name;
      await category.save();
      req.flash(
        "alertMessage",
        `Category Updated: ${oldName} → ${category.name}`
      );
      req.flash("alertStatus", "success");
      res.redirect("/admin/categories");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/categories");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      const oldName = category.name;

      await category.remove();
      req.flash("alertMessage", `Category Deleted: ${oldName}`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/categories");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/categories");
    }
  },
  viewBank: (req, res) => {
    res.render("admin/table_page", {
      title: "Bank",
      headers: [
        { title: "Bank", type: "text", isRequired: true },
        { title: "Bank Logo", type: "file", isRequired: true },
        { title: "Account", type: "text", isRequired: true },
        { title: "Account Holder", type: "text", isRequired: true },
      ],
      url: req.originalUrl,
    });
  },
  viewItem: (req, res) => {
    res.render("admin/table_page", {
      title: "Item",
      headers: [
        { title: "Title", type: "text", isRequired: true },
        { title: "Price", type: "text", isRequired: true },
        { title: "City", type: "text", isRequired: true },
        { title: "Country", type: "text", isRequired: true },
      ],
      url: req.originalUrl,
    });
  },
  viewBooking: (req, res) => {
    res.render("admin/table_page", {
      title: "Booking",
      headers: [
        { title: "Book Date", type: "text", isRequired: true },
        { title: "Item", type: "text", isRequired: true },
        { title: "Costumer", type: "text", isRequired: true },
        { title: "Payment", type: "text", isRequired: true },
        { title: "Status", type: "text", isRequired: true },
      ],
      url: req.originalUrl,
    });
  },
};
