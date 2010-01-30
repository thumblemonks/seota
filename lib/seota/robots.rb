module Seota
  class Robots < Resource
    def initialize(url)
      super(url.sub(/\/?$/, "/robots.txt"))
    end

    def sitemap_urls
      @sitemaps_urls ||= find_sitemap_urls
    end

  private
    def find_sitemap_urls
      urls = body.scan(/^(?:Sitemap:\s+)(.+)$/).flatten
      urls.map { |url| make_url(url) }
    end
  end # Robots
end # Seota
