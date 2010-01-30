Seota.Site = function(domain, sitemaps) {
  this.domain = domain;
  this.sitemaps = sitemaps;
};

Seota.Site.prototype = $.extend({}, {
  render: function(sitemap_list) {
    var that = this;
    sitemap_list.empty();
    $.each(that.sitemaps, function(i, url) {
      var link = $("<a>").attr("href", "#/analyze/" + that.domain + "/sitemap/" + url).text(url);
      sitemap_list.append( $("<li></li>").attr("data-path", url).append(link) );
    });
  }
});
