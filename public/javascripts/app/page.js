Seota.Page = function(details) {
  this.details = details;
};

Seota.Page.prototype = $.extend({}, {
  render: function(container) {
    container.empty();
    container.append($("<div>").text(this.details.title));
    // container.append($("<div>").text(this.details.description));
    // container.append($("<div>").text(this.details.keywords));
    var words_div = $("<div>");
    for(word in this.details.single_word_density) {
      words_div.append($("<div>").text(word + " => " + this.details.single_word_density[word]));
    }
    container.append(words_div);
  }
});
