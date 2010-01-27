module Seota
  class Page < Resource
    include Seota::Wordable
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

    def path; uri.path.gsub(/^$/, "/"); end

    def title; document.css("head title").inner_text; end
    def description; read_meta_attribute("description", "content"); end
    def keywords; read_meta_attribute("keywords", "content"); end
  private
    def document; @document ||= Nokogiri::HTML(body); end

    def read_meta_attribute(name, attribute_name)
      node = document.css("head meta[name=#{name}]")
      node.empty? ? "" : node.attr(attribute_name)
    end
  end # Page
end # Seota
