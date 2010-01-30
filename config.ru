ENV['RACK_ENV'] ||= "development"
 
$:.concat(["lib"])
require 'rubygems'
require 'app'

use Rack::ShowExceptions
# use Rack::CommonLogger, File.new("#{File.dirname(__FILE__)}/log/#{env}.log", 'a+')
 
use Seota::App
run Sinatra::Base
