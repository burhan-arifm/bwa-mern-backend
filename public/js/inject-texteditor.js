const textEditor = document
  .getElementById("addModal")
  .querySelector("textarea.editor");

if (textEditor)
  ClassicEditor.create(textEditor).catch((error) => {
    console.error(error);
  });
