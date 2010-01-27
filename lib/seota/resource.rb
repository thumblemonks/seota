module Seota
  class UnusableResource < Exception
    def initialize(url)
      super("#{url} is an unusable resource")
    end
  end

  class Resource
    def self.new_or_nil(url)
      new(url)
    rescue UnusableResource
      nil
    end

    attr_reader :url, :uri

    def initialize(url)
      @url = url
      @uri, @response = follow(url)
    end

    def [](header_key)
      @response[header_key]
    end

    def body
      @response.body
    end
  private
    def follow(url)
      uri = URI.parse(url)
      response = Net::HTTP.get_response(uri)
      if [Net::HTTPMovedPermanently, Net::HTTPFound].include?(response.class)
        follow(response["location"])
      elsif response.kind_of?(Net::HTTPSuccess)
        [uri, response]
      else
        raise UnusableResource, url
      end
    end

    def replace_path(new_path)
      uri.to_s.sub(%r[#{uri.path}$], new_path)
    end
  end # Resource
end # Seota
