ENV['RACK_ENV'] ||= "development"
 
$:.concat(["lib"])
require 'rubygems'
require 'app'

# AnimalCracker::AssetHost.configure({"asset_path" => File.dirname(__FILE__) + "/public"})
 
use Rack::ShowExceptions
# use Rack::CommonLogger, File.new("#{File.dirname(__FILE__)}/log/#{env}.log", 'a+')
 
use Seota::App
run Sinatra::Base
