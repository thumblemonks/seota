Seota.Sitemap = function(domain, pages) {
  this.domain = domain;
  this.pages = pages;
};

Seota.Sitemap.prototype = $.extend({}, {
  render: function(sitemap_list) {
    var that = this;
    $.each(that.pages, function(i, path) {
      var link = $("<a>").attr("href", "#/analyze/" + that.domain + "/page/" + path).text(path);
      sitemap_list.append( $("<li>").append(link) );
    });
  }
});
