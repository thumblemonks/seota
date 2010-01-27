module Seota
  class UnprocessableSitemap < Exception; end

  module XmlSitemapSupport
    def page_urls
      @page_urls ||= find_page_urls
    end
  private
    def find_page_urls
      document = Nokogiri::XML(body)
      document.search("urlset url loc").map { |loc| loc.content }
    end
  end # XmlSitemapSupport

  class Sitemap < Resource
    
    # TODO: gz sitemap files and sitemap indexes

    def initialize(url)
      super(url)
      puts self["content-type"]
      if self["content-type"] =~ /\/xml$/
        (class << self; self; end).instance_eval { include XmlSitemapSupport }
      end
    end

    def page_urls
      raise UnprocessableSitemap, "Unable to determine format of #{url}"
    end
  end # Sitemap

end # Seota
