Seota = {};

var app = $.sammy(function() {
  // this.use(Sammy.Cache);

  this.get(/^#\/analyze\/([\w.-]+)$/, function() {
    var domain = this.params["splat"][0];
    $.getJSON("/analyze/" + domain, function(data) {
      var sitemap = new Seota.Sitemap(domain, data.sitemap);
      sitemap.render($("#sitemap ul"));
      $("#details").text("yup yup");
    });
  });

  this.get(/^#\/analyze\/([\w.-]+)\/page\/(.+)$/, function() {
    var domain = this.params["splat"][0];
    var path = this.params["splat"][1];
    $.getJSON("/analyze/" + domain + "/page/" + path, function(data) {
      var page = new Seota.Page(data);
      page.render($("#details"));
    });
  });

});

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
