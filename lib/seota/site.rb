module Seota
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
end # Seota
