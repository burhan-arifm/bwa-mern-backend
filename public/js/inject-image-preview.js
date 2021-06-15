const handleImageUpload = (input) => {
  if (input.files && input.files.length > 0) {
    const imagePreviewContainers = document.querySelectorAll(
      ".image-preview-container"
    );

    imagePreviewContainers.forEach((container) => {
      container
        .querySelectorAll(".image-preview")
        .forEach((node) => container.removeChild(node));
      Object.values(input.files).forEach((file) => {
        const image = document.createElement("img");
        const reader = new FileReader();

        image.setAttribute("class", "img-fluid mt-1 image-preview");
        image.setAttribute("alt", "Preview Uploaded Image");
        reader.onload = (e) => image.setAttribute("src", e.target.result);
        reader.readAsDataURL(file);

        container.appendChild(image);
      });
    });
  }
};

const handleImageClick = (data) => {
  let { _id, url } = data;
  const deleteForm = document.getElementById("delete-image");

  document.getElementById("image-preview").setAttribute("src", url);
  deleteForm.setAttribute(
    "action",
    deleteForm
      .getAttribute("action")
      .replace(
        /(\/admin\/[a-zA-Z]+\/[a-zA-Z0-9]*\/media\/)[a-zA-Z0-9]*(\?_method=DELETE)/gi,
        `$1${_id}$2`
      )
  );

  $("#imageModal").modal("show");
};
