Seota = {};

var app = $.sammy(function() {
  this.bind("run", function() {
    $(".runtime").hide();
    $.ajaxSetup({ "async": false });
  });

  this.bind("reset", function() {
    $("#navigation").removeData("current-domain"); // TODO: Move navigation stuff into it's own container
    $("#details").data("pages", {});
    $(".default").show();
    $(".runtime").hide();
    $(".runtime.clearable").text("");
  });

  this.bind("load-sitemap", function(evt, domain) {
    var current_domain = $("#navigation").data("current-domain");
    if (!current_domain || domain != current_domain) {
      this.trigger('reset');
      $.getJSON("/analyze/" + domain, function(data) {
        $(".default").hide();
        $(".runtime").show();
        sitemap = new Seota.Sitemap(domain, data.sitemap);
        sitemap.render($("#pages"));
        $("#details").text("Basic site statistics coming");
        $("#navigation").data("current-domain", domain);
      });
    }
  });

  this.get(/^#\/analyze\/([\w.-]+)$/, function() {
    var domain = this.params["splat"][0];
    this.trigger('reset');
    this.trigger("load-sitemap", domain);
  });

  this.get(/^#\/analyze\/([\w.-]+)\/page\/(.+)$/, function() {
    var domain = this.params["splat"][0];
    var path = this.params["splat"][1];
    this.trigger("load-sitemap", domain);
    var details_div = $("#details");
    var page = details_div.data("pages")[path];
    if (!page) {
      $.getJSON("/analyze/" + domain + "/page/" + path, function(data) {
        page = new Seota.Page(data);
        details_div.data("pages")[path] = page;
      });
    }
    page.render(details_div);
    $(".density.below_1_percent").hide();
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
