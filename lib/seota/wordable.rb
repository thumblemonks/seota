module Seota
  module Wordable
    COMMON_WORDS = %w[the of and to a in that is was he for it with as his on be at by i this had not are but
      from or have an they which one you were her all she there would their we him been has when who will
      more no if]
    
    def parse_words(str)
      to_parse = str.downcase
      to_parse.gsub(/\W/i, ' ').gsub(/ +/, ' ').strip.split.reject { |word| COMMON_WORDS.include?(word) }
    end
  end # Wordable
end # Seota
