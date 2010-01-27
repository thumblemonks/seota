module Seota
  class Site < Resource
    include WhyValidationsSuckIn96::ValidationSupport

    setup_validations do
      validates_presence_of :robots, :message => "should provide a robots.txt"
      validates_length_of :sitemaps, :minimum => 1, :message => "should provide a sitemap of some sort"
    end

    def initialize(url)
      uri = URI.parse(url)
      super(uri.to_s.sub(%r[#{uri.path}$], '/'))
    end

    def robots
      @robots ||= Robots.new_or_nil(url)
    end

    def sitemaps
      @sitemaps ||= find_sitemaps
    end
  private
    def find_sitemaps
      sitemap_urls = (robots && robots.sitemap_urls) || default_sitemap_urls
      sitemap_urls.map do |sitemap_url|
        puts sitemap_url
        Sitemap.new_or_nil(sitemap_url)
      end.compact
    end

    def default_sitemap_urls
      @default_sitemap_urls ||= [replace_path("/sitemap.xml"), replace_path("/sitemap.txt")]
    end
  end # Site
end # Seota
