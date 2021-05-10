const fs = require("fs-extra");
const path = require("path");

const Category = require("../models/Category");
const Bank = require("../models/Bank");

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
        headers: [
          { title: "Name", name: "name", type: "text", isRequired: true },
        ],
        url: req.originalUrl,
        sets: categories,
        alert: { message: alertMessage, status: alertStatus },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/categories");
    }
  },
  addCategory: async (req, res) => {
    try {
      const {
        body: { name },
      } = req.body;

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
      const {
        body: { name },
        params: { id },
      } = req;
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
      const {
        params: { id },
      } = req;
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
  viewBank: async (req, res) => {
    try {
      const banks = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      res.render("admin/table_page", {
        title: "Bank",
        headers: [
          { title: "Bank", name: "name", type: "text", isRequired: true },
          {
            title: "Bank Logo",
            name: "image",
            type: "file",
            isRequired: true,
          },
          {
            title: "Account",
            name: "accountNumber",
            type: "text",
            isRequired: true,
          },
          {
            title: "Account Holder",
            name: "accountOwner",
            type: "text",
            isRequired: true,
          },
        ],
        url: req.originalUrl,
        sets: banks,
        alert: { message: alertMessage, status: alertStatus },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/banks");
    }
  },
  addBank: async (req, res) => {
    try {
      const {
        body: { name, accountNumber, accountOwner },
        file: { filename },
      } = req;

      await Bank.create({
        name,
        imageUrl: `/images/${filename}`,
        accountNumber,
        accountOwner,
      });
      req.flash(
        "alertMessage",
        `New Bank Account Added: ${name} ${accountNumber} - ${accountOwner}`
      );
      req.flash("alertStatus", "success");
      res.redirect("/admin/banks");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/banks");
    }
  },
  updateBank: async (req, res) => {
    try {
      const {
        body: { name, accountNumber, accountOwner },
        file,
        params: { id },
      } = req;
      const bank = await Bank.findOne({ _id: id });
      const oldName = bank.name;
      const oldAccountNumber = bank.accountNumber;
      const oldAccountOwner = bank.accountOwner;

      if (file !== undefined) {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.imageUrl = `/images/${file.filename}`;
      }
      bank.name = name;
      bank.accountNumber = accountNumber;
      bank.accountOwner = accountOwner;
      await bank.save();
      req.flash(
        "alertMessage",
        `Bank Updated: ${oldName} ${oldAccountNumber} - ${oldAccountOwner} → ${bank.name} ${bank.accountNumber} - ${bank.accountOwner}`
      );
      req.flash("alertStatus", "success");
      res.redirect("/admin/banks");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/banks");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      const bank = await Bank.findOne({ _id: id });
      const { name, imageUrl, accountNumber, accountOwner } = bank;
      await fs.unlink(path.join(`public/${imageUrl}`));

      await bank.remove();
      req.flash(
        "alertMessage",
        `Bank Deleted: ${name} ${accountNumber} - ${accountOwner}`
      );
      req.flash("alertStatus", "success");
      res.redirect("/admin/banks");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/banks");
    }
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
