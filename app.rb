require "sinatra"
require "haml"
require "json"
require "seota"

module Seota
  class App < Sinatra::Base
    set :root, File.dirname(__FILE__)
    # enable :dump_errors
    enable :static

    before do
      content_type 'application/json', :charset => 'utf-8'
    end

    error UnusableResource do
      status 427
      {:error => request.env['sinatra.error'].message}.to_json
    end

    get("/") do
      content_type 'text/html', :charset => 'utf-8'
      haml(:index)
    end

    get %r{^/analyze/([\w.-]+)/sitemap/(.*)$} do |domain, url|
      sitemap = Sitemap.new(url)
      {:pages => sitemap.page_urls}.to_json
    end

    get %r{^/analyze/([\w.-]+)/page/(.*)$} do |domain, url|
      page = Page.new(url)
      {:uri => page.uri, :valid => page.valid?,
        :title => {:value => page.title, :failures => page.failures_on(:title)},
        :description => {:value => page.description, :failures => page.failures_on(:description)},
        :keywords => {:value => page.keywords, :failures => page.failures_on(:keywords)},
        :single_word_density => page.single_word_density,
        :double_word_density => page.double_word_density
      }.to_json
    end

    get %r{^/analyze/([\w.-]+)$} do |domain|
      site = Site.new("http://#{domain}")
      {:sitemaps => site.sitemaps.map(&:url)}.to_json
    end

  end # App
end
