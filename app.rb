require "sinatra"
require 'haml'

module Seota
  class App < Sinatra::Base
    set :root, File.dirname(__FILE__)
    enable :dump_errors
    enable :static

    get("/") { haml(:index) }

    get "/site/:domain" do
      "hello"
    end
  end # App
end
