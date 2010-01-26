Seota.Page = function(details) {
  this.details = details;
};

Seota.Page.prototype = $.extend({}, {
  // Meta information rendering

  _labeled_tag: function(class, label, field) {
    var template = "<div class='key_value {{ class }}'>" +
        "<label>{{ label }}</label>" +
        "<div class='failures'>{{ failures }}</div>" +
        "<div class='value'>{{ value }}</div>" +
      "</div>";
    return $(Mustache.to_html(template,
        {"class" : class, "label" : label, "value" : field.value, "failures" : field.failures.join(", ")}
      ));
  },

  _title_tag: function() {
    return this._labeled_tag("title", "Title", this.details.title);
  },

  _description_tag: function() {
    return this._labeled_tag("description", "Description", this.details.description);
  },

  _keywords_tag: function() {
    return this._labeled_tag("keywords", "Keywords", this.details.keywords);
  },

  // Density rendering

  _density_sum: function(collection) {
    var sum = 0;
    for(word in collection) { sum += collection[word]; }
    return sum;
  },

  _density_sort: function(collection) {
    var sorted = [];
    for(word in collection) { sorted.push([word, collection[word]]); }
    return sorted.sort(function(a, b) { return(b[1] - a[1]); });
  },

  _density_tag: function(class, word, percent, count) {
    var percent_class = percent < 1.00 ? "below_1_percent" : "1_percent";
    var template = "<div class='density clearfix {{ class }}'>" +
        "<div class='half word'>{{ word }}&nbsp;</div>" +
        "<div class='quarter percent'>{{ percent }}</div>" +
        "<div class='quarter omega count'> {{ count }}</div>" +
      "</div>";
    return $(Mustache.to_html(template,
      {"class" : [class, percent_class].join(" "), "word" : word, "percent" : percent, "count" : count}
    ));
  },

  _word_density: function(class, collection) {
    var that = this;
    var words_div = $("<div></div>").addClass(class);
    var sum = that._density_sum(collection);
    words_div.append(that._density_tag("total", "", "100.00", sum));
    $.each(that._density_sort(collection), function(i, word_and_count) {
      var percent = ((word_and_count[1] / sum) * 100).toPrecision(3);
      words_div.append(that._density_tag("line", word_and_count[0], percent, word_and_count[1]));
    });
    return words_div;
  },

  _single_word_density_tag: function() {
    return this._word_density("single_word_density alpha", this.details.single_word_density);
  },

  _double_word_density_tag: function() {
    return this._word_density("double_word_density omega", this.details.double_word_density);
  },

  _densities_tag: function() {
    var toggle_density = function() {
      $(".density_button.selected").removeClass("selected").data("table").hide();
      $(this).addClass("selected").data("table").show();
    };

    var single_word_table = this._single_word_density_tag();
    var single_word_button = $("<label>Single Word Density</label>").
      addClass("density_button selected").data("table", single_word_table).click(toggle_density);

    var double_word_table = this._double_word_density_tag().hide();
    var double_word_button = $("<label>Double Word Density</label>").
      addClass("density_button").data("table", double_word_table).click(toggle_density);

    var caption = $("<div></div>").addClass("caption").text("Only showing word(s) with density above 1%");

    return $("<div></div>").addClass("densities").append(single_word_button).append(double_word_button).
      append(single_word_table).append(double_word_table).append(caption);
  },

  // Main render

  render: function(container) {
    container.empty();
    container.append(Mustache.to_html("<h5><a href='{{ uri }}' target='_blank'>{{ uri }}</a></h5>",
      {"uri": this.details.uri}));
    if (this.details.exists) {
      var meta_div = $("<div></div>").addClass("half").
        append(this._title_tag()).append(this._description_tag()).append(this._keywords_tag());
      container.append(meta_div).append($("<div></div>").addClass("half").append(this._densities_tag()));
    } else {
      container.append($("<p></p>").text("Page could not be found"));
    }
  }
});
