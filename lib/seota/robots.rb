module Seota
  class Robots < Resource
    def initialize(url)
      super(url.sub(/\/?$/, "/robots.txt"))
    end

    def sitemap_urls
      @sitemaps_urls ||= body.scan(/^(?:Sitemap:\s+)(.+)$/).flatten
    end
  end # Robots
end # Seota
