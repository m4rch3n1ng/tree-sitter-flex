(directive (identifier) @keyword.directive)
(definition (identifier) @variable)

(condition (identifier) @constant)
(condition "," @punctuation.delimiter)
(condition "*" @string.special)

(pattern) @string.regexp

(pattern ["(" ")"] @punctuation.bracket)
(pattern ["+" "*" "?" "|" "/"] @operator)
(pattern ["^" "$"] @constant.character.escape)

(pattern (bracketed ["[" "]"] @punctuation.bracket))
(pattern (bracketed ["^" "-"] @operator))

(pattern (expansion ["{" "}"] @punctuation.bracket))
(pattern (expansion (identifier) @variable))

(escaped) @constant.character.escape

(quantifier (number) @constant.numeric)
(quantifier "," @punctuation.delimiter)

(string) @string
(eof) @string.special

[
  "%{"
  "%}"
  "{"
  "}"
] @punctuation.bracket

"%%" @punctuation.delimiter

(comment) @comment
