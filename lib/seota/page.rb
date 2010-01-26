require 'whyvalidationssuckin96'

module Seota
  class Page
    include Seota::Wordable

    attr_reader :uri
    include WhyValidationsSuckIn96::ValidationSupport

    setup_validations do
      validates_presence_of :title, :description
      validates_presence_of :keywords, :message => "were not present"
      validates_length_of :title, :maximum => 64, :message => "should probably be 64 characters or less"
      validates_length_of :description, :maximum => 160, :message => "should be no more than 160 characters"
    end

    def failures_on(attribute)
      failed_validations.select {|v| v.attribute == attribute }.map(&:message)
    end

    def initialize(*uri_parts)
      @uri = URI.join(*uri_parts)
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
      @words ||= parse_words(document.css("body").inner_text)
    end

    def read_meta_attribute(name, attribute_name)
      node = document.css("head meta[name=#{name}]")
      node.empty? ? "" : node.attr(attribute_name)
    end
  end # Page
end # Seota
