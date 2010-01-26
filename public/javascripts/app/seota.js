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

        $("#sites").append(
          $("<li></li>").append( $("<a></a>").attr("href", "#/analyze/" + domain).text(domain) )
        );

        sitemap = new Seota.Sitemap(domain, data.sitemap);
        sitemap.render($("#pages"));
        $("#navigation").data("current-domain", domain);
      });
    }
    $("#details").text("Basic site statistics coming");
  });

  this.bind("load-page", function(evt, request) {
    var details_div = $("#details");
    var page = details_div.data("pages")[request.path];
    if (!page) {
      $.getJSON("/analyze/" + request.domain + "/page/" + request.path, function(data) {
        page = new Seota.Page(data);
        details_div.data("pages")[request.path] = page;
      });
    }
    page.render(details_div);
    $(".density.below_1_percent").hide();
  });

  this.get(/^#\/analyze\/([\w.-]+)$/, function() {
    var domain = this.params["splat"][0];
    this.trigger("load-sitemap", domain);
    this.trigger("load-page", {"domain": domain, "path": "/"});
  });

  this.get(/^#\/analyze\/([\w.-]+)\/page\/(.*)$/, function() {
    var domain = this.params["splat"][0];
    var path = this.params["splat"][1];
    this.trigger("load-sitemap", domain);
    this.trigger("load-page", {"domain": domain, "path": path});
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

  $("#page_filter").keyup(function() {
    var value = $(this).val();
    $("#pages li").show();
    if (!(value == "" || value == $(this).data("label"))) {
      $("#pages li").hide();
      $("#pages li[data-path*=" + $(this).val() + "]").show();
    }
  });

  app.run(); // Sammy!
});
