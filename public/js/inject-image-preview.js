const handleImageUpload = (input) => {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = (e) =>
      document
        .querySelectorAll(".image-preview")
        .forEach((element) => element.setAttribute("src", e.target.result));
    reader.readAsDataURL(input.files[0]);
  }
};
