const ImageKit = require("imagekit");
const dataUri = require("datauri/sync");
const fs = require("fs-extra");

const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URI,
});

const uploader = async (file) => {
  const content = dataUri(file.path).content;

  // console.log(content);
  return await imageKit
    .upload({
      file: content,
      fileName: file.originalname,
    })
    .then((response) => {
      fs.unlink(file.path);

      return response.fileId;
    })
    .catch((err) => err);
};
const getUrl = async (imageId) =>
  await imageKit
    .getFileDetails(imageId)
    .then((response) => response.url)
    .catch((err) => err);
const deleteImage = async (imageId) =>
  await imageKit
    .deleteFile(imageId)
    .then((response) => {})
    .catch((err) => err);

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
        headers: [{ title: "Name", key: "name" }],
        form: {
          size: "medium",
          inputs: [
            { label: "Name", name: "name", type: "text", isRequired: true },
          ],
        },
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
      const fetchedBanks = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const promises = fetchedBanks.map(async (bank) => {
        return { ...bank._doc, image: await getUrl(bank.imageId) };
      });

      Promise.all(promises).then((banks) => {
        res.render("admin/table_page", {
          title: "Bank",
          headers: [
            { title: "Bank", key: "name" },
            {
              title: "Bank Logo",
              key: "image",
            },
            {
              title: "Account",
              key: "accountNumber",
            },
            {
              title: "Account Holder",
              key: "accountOwner",
            },
          ],
          form: {
            size: "medium",
            inputs: [
              { label: "Bank", name: "name", type: "text", isRequired: true },
              {
                label: "Bank Logo",
                name: "image",
                type: "file",
                isRequired: true,
              },
              {
                label: "Account",
                name: "accountNumber",
                type: "text",
                isRequired: true,
              },
              {
                label: "Account Holder",
                name: "accountOwner",
                type: "text",
                isRequired: true,
              },
            ],
          },
          url: req.originalUrl,
          sets: banks,
          alert: { message: alertMessage, status: alertStatus },
        });
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
        file,
      } = req;

      await Bank.create({
        name,
        imageId: await uploader(file),
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
        await deleteImage(bank.imageId).then(async (result) => {
          bank.imageId = await uploader(file);
        });
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
      const { name, imageId, accountNumber, accountOwner } = bank;

      await deleteImage(imageId);
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
  viewItem: async (req, res) => {
    try {
      const items = await Item.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      res.render("admin/table_page", {
        title: "Item",
        headers: [
          { title: "Category", key: "categoryId" },
          { title: "Title", key: "title" },
          { title: "Price", key: "price" },
          { title: "City", key: "city" },
          { title: "Country", key: "country" },
        ],
        form: {
          size: "large",
          inputs: [
            { label: "Title", name: "title", type: "text", isRequired: true },
            {
              label: "Category",
              name: "categoryId",
              type: "select",
              isRequired: true,
            },
            { label: "Price", name: "price", type: "text", isRequired: true },
            { label: "City", name: "city", type: "text", isRequired: true },
            {
              label: "Country",
              name: "country",
              type: "text",
              isRequired: true,
            },
            { label: "Image", name: "image", type: "file", isRequired: true },
            {
              label: "Description",
              name: "description",
              type: "longtext",
              isRequired: true,
            },
          ],
          datasets: {
            categoryId: await Category.find(),
          },
        },
        url: req.originalUrl,
        sets: items,
        alert: { message: alertMessage, status: alertStatus },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
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
