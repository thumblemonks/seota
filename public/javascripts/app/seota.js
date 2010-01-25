var app = $.sammy(function() {
  // this.use(Sammy.Cache);

  this.get(/^#\/analyze\/([\w.-]+)$/, function() {
    var domain = this.params["splat"][0];
    $.getJSON("/analyze/" + domain, function(data) {
      $.each(data.sitemap, function(i, path) {
        var link = $("<a>").attr("href", "#/analyze/" + domain + "/page" + path).text(path)
        $("#sitemap ul").append( $("<li>").append(link) );
      });
      $("#details").text("yup yup");
    });
  });

  this.get(/^#\/analyze\/([\w.-]+)\/page\/(.+)$/, function() {
    var domain = this.params["splat"][0];
    var path = this.params["splat"][1];
    $.getJSON("/analyze/" + domain + "/page/" + path, function(data) {
      $("#details").empty();
      $("#details").append($("<div>").text(data.title));
      // $("#details").append($("<div>").text(data.description));
      // $("#details").append($("<div>").text(data.keywords));
      var words_div = $("<div>");
      for(word in data.single_word_density) {
        words_div.append($("<div>").text(word + " => " + data.single_word_density[word]));
      }
      $("#details").append(words_div);
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
