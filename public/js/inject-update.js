$("#dataTable").on("click", ".btn-update", function () {
  let dataset = $(this).data("item");
  let { _id, __v, ...rest } = dataset;
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
    if (key === "imageUrl") {
      $("img.image-preview")[1].src = rest[key];
    } else if (key === "longtext") {
      $("textarea.editor").innerHTML = rest[key];
    } else {
      $(`input#edit${key}`)[0].value = rest[key];
    }
  });
});
