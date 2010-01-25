require "sinatra"
require 'haml'

module Seota
  class App < Sinatra::Base
    set :root, File.dirname(__FILE__)
    enable :dump_errors
    enable :static

    get("/") { haml(:index) }

    get %r{^/analyze/([\w.-]+)$} do |domain|
      "foo #{domain}"
    end

    get %r{^/analyze/([\w.-]+)/page/(.+)$} do |domain, path|
      "bar #{domain}/#{path}"
    end
  end # App
end
