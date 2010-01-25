require "sinatra"
require "haml"
require "json"
require "seota"

module Seota
  class App < Sinatra::Base
    set :root, File.dirname(__FILE__)
    enable :dump_errors
    enable :static

    get("/") { haml(:index) }

    get %r{^/analyze/([\w.-]+)$} do |domain|
      sitemap = Sitemap.new(Site.new("http://#{domain}"))
      content_type 'application/json', :charset => 'utf-8'
      {:sitemap => sitemap.pages.map(&:path)}.to_json
    end

    get %r{^/analyze/([\w.-]+)/page/(.+)$} do |domain, path|
      page = Page.new("http://#{domain}/#{path}")
      content_type 'application/json', :charset => 'utf-8'
      {:title => page.title, :description => page.description, :keywords => page.keywords,
        :single_word_density => page.single_word_density,
        :double_word_density => page.double_word_density}.to_json
    end
  end # App
end
