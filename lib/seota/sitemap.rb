module Seota
  class Sitemap
    # TODO: gz sitemap files and sitemap indexes
    attr_reader :path

    def initialize(site)
      # TODO: may convert these conditions to individual modules
      if @path = site.resource_exists?("/sitemap.xml")
        sitemap = Nokogiri::XML(open(site.resource(path)))
        @pages = sitemap.search("urlset url loc").map { |loc| loc.content }
      elsif @path = site.resource_exists?("/sitemap.txt")
        @pages = []
      end
    end

    def pages
      (@pages || []).map { |page_url| Page.new(page_url) }
    end

    def found?; !@path.nil?; end
  end # Sitemap
end # Seota
