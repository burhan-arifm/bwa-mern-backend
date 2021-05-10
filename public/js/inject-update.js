$("#dataTable").on("click", ".btn-update", function () {
  let dataset = $(this).data("item");
  let { _id, __v, ...rest } = dataset;
  $("form[id^=edit]").attr(
    "action",
    $("form[id^=edit]")
      .attr("action")
      .replace(
        /(\/admin\/categories\/)[a-zA-Z0-9]*(\?_method=PUT)/gi,
        `$1${_id}$2`
      )
  );
  Object.keys(rest).forEach((key) => {
    $(`input#${key}`)[1].value = rest[key];
  });
});
