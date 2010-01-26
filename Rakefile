require 'rubygems'

namespace :sitemap do
  desc "Ping Google with the latest sitemap"
  task :ping do
    require 'cgi'
    puts "Pinged no one"
    # sitemap_url = CGI.escape("http://seota.thumblemonks.com/sitemap.xml")
    # %x[curl -s -S "http://www.google.com/webmasters/tools/ping?sitemap=#{sitemap_url}"]
    # puts "Pinged google"
    # %x[curl -s -S "http://search.yahooapis.com/SiteExplorerService/V1/ping?sitemap=#{sitemap_url}"]
    # puts "Pinged yahoo"
    # %x[curl -s -S "http://www.bing.com/webmaster/ping.aspx?siteMap=#{sitemap_url}"]
    # puts "Pinged bing"
  end
end

begin
  require 'vlad' # But we really mean gabrielg-vlad
  require 'vlad/core'
  require 'vlad/git'
  require 'deploy/base.rb'
rescue LoadError => e
  puts "Unable to load Vlad the Deployer - #{e.message}."
end
