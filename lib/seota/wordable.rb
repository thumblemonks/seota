module Seota
  module Wordable
    COMMON_WORDS = %w[the of and to a in that is was he for it with as his on be at by i this had not are but
      from or have an they which one you were her all she there would their we him been has when who will
      more no if]

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

    def get_words
      @words ||= parse_words(document.css("body").inner_text)
    end

    def parse_words(str)
      to_parse = str.downcase
      to_parse.gsub(/\W/i, ' ').gsub(/ +/, ' ').strip.split.reject { |word| COMMON_WORDS.include?(word) }
    end
  end # Wordable
end # Seota
