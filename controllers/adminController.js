const ImageKit = require("imagekit");
const dataUri = require("datauri/sync");
const fs = require("fs-extra");

const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Media = require("../models/Media");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.IMAGEKIT_URI,
});

const uploader = async (file) => {
  const content = dataUri(file.path).content;

  return await imageKit
    .upload({
      file: content,
      fileName: file.originalname,
    })
    .then((response) => {
      fs.unlink(file.path);

      return {
        mediaId: response.fileId,
        url: response.url,
        thumbnail: response.thumbnailUrl,
      };
    })
    .catch((err) => err);
};
const deleteImage = async (imageId) =>
  await imageKit
    .deleteFile(imageId)
    .then((response) => {})
    .catch((err) => err);

module.exports = {
  viewDashboard: (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    res.render("admin/dashboard", {
      title: "Dashboard",
      alert: { message: alertMessage, status: alertStatus },
    });
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
      res.redirect("/admin");
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
      const fetchedBanks = await Bank.find().populate({
        path: "bankLogo",
        select: "url thumbnail",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const banks = fetchedBanks.map((bank) => {
        const { bankLogo, ...rest } = bank._doc;

        return {
          ...rest,
          imageThumbnail: bankLogo.thumbnail,
          imageUrl: bankLogo.url,
        };
      });

      console.log(banks);

      res.render("admin/table_page", {
        title: "Bank",
        headers: [
          { title: "Bank", key: "name" },
          {
            title: "Bank Logo",
            key: "imageThumbnail",
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
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin");
    }
  },
  addBank: async (req, res) => {
    try {
      const {
        body: { name, accountNumber, accountOwner },
        file,
      } = req;
      const media = await Media.create(await uploader(file));

      await Bank.create({
        name,
        bankLogo: media._id,
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
        await deleteImage(bank.bankLogo._id).then(async (result) => {
          const newMedia = await Media.create(await uploader(file));
          const oldBankLogo = await Media.findOne({ _id: bank.bankLogo });

          bank.bankLogo = newMedia._id;
          await deleteImage(oldBankLogo._id);
          await oldBankLogo.remove();
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
      const { name, bankLogo, accountNumber, accountOwner } = bank;
      const media = await Media.findOne({ _id: bankLogo });

      await deleteImage(media.mediaId);
      await media.remove();
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
      const items = await Item.find().populate({
        path: "category",
        select: `id name`,
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const shapedItems = items.map((item) => ({
        ...item._doc,
        categoryName: item.category.name,
        location: `${item.city}, ${item.country}`,
        storedImages: item.media.length,
      }));

      res.render("admin/table_page", {
        title: "Item",
        headers: [
          { title: "Title", key: "title" },
          { title: "Price", key: "price" },
          { title: "Category", key: "categoryName" },
          { title: "Location", key: "location" },
          { title: "Images", key: "storedImages" },
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
            { label: "Image", name: "image", type: "file", canMultiple: true },
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
        sets: shapedItems,
        alert: { message: alertMessage, status: alertStatus },
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin");
    }
  },
  addItem: async (req, res) => {
    try {
      const {
        body: { categoryId, title, price, city, country, description },
        files,
      } = req;
      const category = await Category.findOne({ _id: categoryId });
      const item = await Item.create({
        category: category._id,
        title,
        price,
        city,
        country,
        description,
      });

      category.items.push({ _id: item._id });
      await category.save();

      if (files.length > 0) {
        Promise.all(files.map(async (file) => await uploader(file)))
          .then((result) =>
            Promise.all(
              result.map(async (data) => {
                const media = await Media.create(data);

                return media._id;
              })
            ).then((data) => data)
          )
          .then(async (result) => {
            item.media.push({ $each: result });
            await item.save();

            req.flash(
              "alertMessage",
              `New Item Added: ${title}, ${city}, ${country}`
            );
            req.flash("alertStatus", "success");
            res.redirect("/admin/items");
          });
      } else {
        req.flash(
          "alertMessage",
          `New Item Added: ${title}, ${city}, ${country}`
        );
        req.flash("alertStatus", "success");
        res.redirect("/admin/items");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
  },
  updateItem: async (req, res) => {
    try {
      const {
        body: { categoryId, title, price, city, country, description },
        files,
        params: { itemId },
      } = req;
      const item = await Item.findOne({ _id: itemId });

      if (categoryId !== undefined && item.category !== categoryId) {
        const oldCategory = await Category.findOne({ _id: item.category });
        const newCategory = await Category.findOne({ _id: categoryId });

        oldCategory.items.pull(item._id);
        await oldCategory.save();
        newCategory.items.push({ _id: item._id });
        await newCategory.save();
        item.category = categoryId;
      }

      if (files.length > 0) {
        Promise.all(files.map(async (file) => await uploader(file)))
          .then((result) =>
            Promise.all(
              result.map(async (data) => {
                const media = await Media.create(data);

                return media._id;
              })
            ).then((data) => data)
          )
          .then(async (result) => {
            item.media.push({ $each: result });
            await item.save();

            if (title !== undefined) item.title = title;
            if (price !== undefined) item.price = price;
            if (city !== undefined) item.city = city;
            if (country !== undefined) item.country = country;
            if (description !== undefined) item.description = description;

            await item.save();
            req.flash(
              "alertMessage",
              `Item Updated: ${title}, ${city}, ${country}`
            );
            req.flash("alertStatus", "success");
            res.redirect("/admin/items");
          });
      } else {
        if (title !== undefined) item.title = title;
        if (price !== undefined) item.price = price;
        if (city !== undefined) item.city = city;
        if (country !== undefined) item.country = country;
        if (description !== undefined) item.description = description;

        await item.save();
        req.flash(
          "alertMessage",
          `Item Updated: ${title}, ${city}, ${country}`
        );
        req.flash("alertStatus", "success");
        res.redirect("/admin/items");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
  },
  deleteItem: async (req, res) => {
    try {
      const {
        params: { itemId },
      } = req;
      const item = await Item.findOne({ _id: itemId });
      const category = await Category.findOne({ _id: item.category });
      const { title, city, country } = item;

      item.media.forEach(async (mediaId) => {
        const media = await Media.findOne({ _id: mediaId });

        await deleteImage(media.mediaId);
        await media.remove();
      });
      category.items.pull(item._id);
      await category.save();
      await item.remove();

      req.flash("alertMessage", `Item removed: ${title}, ${city}, ${country}`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/items");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
  },
  viewMedia: async (req, res) => {
    try {
      const {
        params: { itemId },
        originalUrl,
      } = req;
      const { title, media } = await Item.findOne({ _id: itemId });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const relatedMedia = media.map(async (id) => {
        const media = await Media.findOne({ _id: id });
        const { __v, mediaId, ...rest } = media._doc;

        return { ...rest, imageId: mediaId };
      });

      Promise.all(relatedMedia).then((imageURLs) => {
        res.render("admin/media_page", {
          title: `${title}'s Media`,
          form: {
            size: "medium",
            inputs: [
              {
                label: "Image",
                name: "image",
                type: "file",
                isRequired: true,
                canMultiple: true,
              },
            ],
          },
          url: originalUrl,
          sets: imageURLs,
          alert: { message: alertMessage, status: alertStatus },
        });
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
  },
  addMedia: async (req, res) => {
    try {
      const {
        files,
        params: { itemId },
      } = req;
      const item = await Item.findOne({ _id: itemId });

      Promise.all(files.map(async (file) => await uploader(file)))
        .then((result) =>
          Promise.all(
            result.map(async (data) => {
              const media = await Media.create(data);

              return media._id;
            })
          ).then((data) => data)
        )
        .then(async (result) => {
          item.media.push({ $each: result });
          await item.save();

          req.flash(
            "alertMessage",
            `${files.length} new image${
              files.length > 1 ? "s" : ""
            } added successfully.`
          );
          req.flash("alertStatus", "success");
          res.redirect(req.originalUrl);
        });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/items");
    }
  },
  deleteMedia: async (req, res) => {
    try {
      const {
        headers: { referer },
        params: { itemId, mediaId },
      } = req;
      const item = await Item.findOne({ _id: itemId });
      const media = await Media.findOne({ _id: mediaId });

      item.media.pull(media._id);
      await item.save();
      await deleteImage(media.mediaId);
      await media.remove();

      req.flash("alertMessage", "An image removed successfully.");
      req.flash("alertStatus", "success");
      res.redirect(referer);
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
