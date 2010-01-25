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

  _word_density: function(class, label, collection) {
    var words_div = $("<div class='grid_6'>").addClass(class);
    words_div.append($("<label>").text(label));
    for(word in collection) {
      var density_div = $("<div class='density'>");
      density_div.append($("<div class='grid_4 alpha'>").text(word));
      density_div.append($("<div class='grid_2 omega'>").text(collection[word]));
      words_div.append(density_div);
    }
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
