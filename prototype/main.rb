#!/usr/bin/env ruby
require 'rubygems'

require 'net/http'
require 'nokogiri'
require 'open-uri'

class Site
  attr_reader :uri
  def initialize(requested_url)
    @uri = URI.parse(requested_url)
  end

  def base_uri; "#{uri.scheme}://#{uri.host}"; end
  def resource(path) "#{base_uri}#{pad_with_slash(path)}"; end

  def resource_exists?(resource)
    response = nil
    Net::HTTP.start(uri.host, uri.port) { |http| response = http.head(pad_with_slash(resource)) }
    response.kind_of?(Net::HTTPSuccess) ? resource : nil
  end
private
  def pad_with_slash(path)
    "/#{path.gsub(/^\//, '')}"
  end
end # Site

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

class Page
  attr_reader :uri
  def initialize(url)
    @uri = URI.parse(url)
  end

  def path; uri.path.gsub(/^$/, "/"); end

  def title; document.css("head title").inner_text; end
  def description; read_meta_attribute("description", "content"); end
  def keywords; read_meta_attribute("keywords", "content"); end

  def exists?
    response = nil
    Net::HTTP.start(uri.host, uri.port) { |http| response = http.head(path) }
    response.kind_of?(Net::HTTPSuccess)
  end

  # TODO: Push this stuff into a word analysis class
  def word_count; get_words.length; end

  def single_word_density
    get_words.inject(Hash.new(0)) { |dict, word| dict[word] += 1; dict }
  end

  def double_word_density
    dict = Hash.new(0)
    get_words[0..-2].each_with_index do |word, i|
      dict["#{word} #{get_words[i+1]}"] += 1
    end
    dict
  end
private
  def document; @document ||= Nokogiri::HTML(uri.open); end

  def get_words
    @words ||= document.css("body").inner_text.gsub(/\W/i, ' ').gsub(/ +/, ' ').strip.split
  end

  def read_meta_attribute(name, attribute_name)
    node = document.css("head meta[name=#{name}]")
    node.empty? ? "" : node.attr(attribute_name)
  end
end # Page

#
# Main

requested_url = ARGV[0]

site = Site.new(requested_url)
puts "Preparing to analyze #{site.base_uri}"

#
# Collection page urls from sitemap

sitemap = Sitemap.new(site)
(puts " ! No sitemap found"; exit(1)) unless sitemap.found?
puts " + Using sitemap: #{sitemap.path}"

#
# Analyze each page

sitemap.pages.each do |page|
  if page.exists?
    puts " > #{page.uri}"
    puts "   Title: #{page.title}"
    puts "   Meta(description): #{page.description}"
    puts "   Meta(keywords): #{page.keywords}"
    puts "   Word Count: #{page.word_count}"
    puts "   Single word density: #{page.single_word_density.inspect}"
    puts "   Double word density: #{page.double_word_density.inspect}"
  else
    puts " ! Page not found: #{page.uri}"
  end
end # sitemap_resource
