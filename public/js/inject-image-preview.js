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
