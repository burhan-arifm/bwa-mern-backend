document.querySelectorAll("textarea.editor").forEach((element) =>
  ClassicEditor.create(element).catch((error) => {
    console.error(error);
  })
);
