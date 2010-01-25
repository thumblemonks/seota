Seota.Page = function(details) {
  this.details = details;
};

Seota.Page.prototype = $.extend({}, {
  _labeled_tag: function(class, label, value) {
    var template = "<div class='key_value {{ class }}'>" +
        "<label>{{ label }}</label>" +
        "<div class='value'>{{ value }}</div>" +
      "</div>";
    return $(Mustache.to_html(template, {"class" : class, "label" : label, "value" : value}));
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

  _word_density: function(class, label, collection) {
    var words_div = $("<div class='grid_6'>").addClass(class);
    words_div.append($("<label></label>").text(label));
    var sum = this._density_sum(collection);
    var total_div = $("<div></div>").addClass("density total clearfix").
      append($("<div class='grid_3 alpha word'></div>").text("Total")).
      append($("<div class='grid_2 percent'></div>").text("100.00")).
      append($("<div class='grid_1 omega count'></div>").text(sum));
    words_div.append(total_div);
    $.each(this._density_sort(collection), function(i, word_and_count) {
      var percent = ((word_and_count[1] / sum) * 100).toPrecision(3);
      var density_div = $("<div></div>").addClass("density clearfix").
        append($("<div class='grid_3 alpha word'></div>").text(word_and_count[0])).
        append($("<div class='grid_2 percent'></div>").text(percent)).
        append($("<div class='grid_1 omega count'></div>").text(word_and_count[1]));
      words_div.append(density_div);
    });
    return words_div;
  },

  _single_word_density_tag: function() {
    return this._word_density("single_word_density alpha", "Single Word Density",
      this.details.single_word_density);
  },

  _double_word_density_tag: function() {
    return this._word_density("double_word_density omega", "Double Word Density",
      this.details.double_word_density);
  },

  render: function(container) {
    container.empty();
    container.append(this._title_tag());
    container.append(this._description_tag());
    container.append(this._keywords_tag());
    container.append(this._single_word_density_tag());
    container.append(this._double_word_density_tag());
  }
});
