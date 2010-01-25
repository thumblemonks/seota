var app = $.sammy(function() {
  // this.use(Sammy.Cache);

  this.get(/^#\/analyze\/([\w.-]+)$/, function() {
    var domain = this.params["splat"][0];
    $.get("/analyze/" + this.params["domain"], function(data) {
      $("#sitemap").text(data);
      $("#details").text("yup yup");
    });
  });

  this.get(/^#\/analyze\/([\w.-]+)\/page\/(.+)$/, function() {
    var domain = this.params["splat"][0];
    var path = this.params["splat"][1];
    $.get("/analyze/" + domain + "/page/" + path, function(data) {
      $("#details").text(data);
    });
  });

});

// $.extend(app, {});

$.input_prompt = function(inputElement) {
  inputElement.focus(function() {
    var element = $(this);
    if (element.data("label") == undefined) { element.data("label", element.attr("defaultValue")); }
    if (element.data("label") == element.val()) { element.val(""); }
  });

  inputElement.blur(function() {
    var element = $(this);
    if (element.val().length == 0) { element.val(element.data("label")); }
  });
};

$(document).ready(function() {
  $("input.input_prompt, textarea.input_prompt").each(function(i) { $.input_prompt($(this)); })

  $("#go_seota").submit(function() {
    window.location = "#/analyze/" + $("#domain_name").val();
    return false;
  });

  app.run(); // Sammy!
});
