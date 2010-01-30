Seota.Sitemap = function(domain, pages) {
  this.domain = domain;
  this.pages = pages;
};

Seota.Sitemap.prototype = $.extend({}, {
  render: function(sitemap_list) {
    var that = this;
    $.each(that.pages, function(i, url) {
      var link = $("<a>").attr("href", "#/analyze/" + that.domain + "/page/" + url).text(url);
      sitemap_list.append( $("<li></li>").attr("data-path", url).append(link) );
    });
  }
});
