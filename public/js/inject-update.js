$("#dataTable").on("click", ".btn-update", function () {
  let dataset = $(this).data("item");
  let { _id, __v, imageThumbnail, ...rest } = dataset;
  let editModal = document.getElementById("editModal");

  $("form[id^=edit]").attr(
    "action",
    $("form[id^=edit]")
      .attr("action")
      .replace(
        /(\/admin\/[a-zA-Z]+\/)[a-zA-Z0-9]*(\?_method=PUT)/gi,
        `$1${_id}$2`
      )
  );
  Object.keys(rest).forEach((key) => {
    console.log(key);
    if (typeof rest[key] !== "object") {
      if (key === "imageUrl") {
        const imagePreviewContainer = editModal.querySelector(
          ".image-preview-container"
        );
        const image = document.createElement("img");

        document
          .querySelectorAll(".image-preview")
          .forEach((node) => imagePreviewContainer.removeChild(node));

        image.setAttribute("class", "img-fluid mt-1 image-preview");
        image.setAttribute("alt", "Preview Uploaded Image");
        image.setAttribute("src", rest[key]);

        imagePreviewContainer.appendChild(image);
      } else if (key === "description") {
        const textEditor = editModal.querySelector("textarea.editor");

        if (textEditor)
          ClassicEditor.create(textEditor)
            .then((editor) => editor.setData(rest[key]))
            .catch((error) => console.error(error));
      } else if (key === "categoryName") {
        console.log(rest.category._id);
        $(`select#editcategoryId`)[0].value = rest.category._id;
      } else {
        $(`input#edit${key}`)[0].value = rest[key];
      }
    }
  });
});
