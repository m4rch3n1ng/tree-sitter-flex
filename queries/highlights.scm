(directive (identifier) @keyword.directive)
(definition (identifier) @variable)

(condition (identifier) @constant)
(condition "," @punctuation.delimiter)
(condition "*" @string.special)

(pattern) @string.regexp
(pattern ["+" "*" "?" "|" "^" "-"] @operator)
(pattern ["[" "]" "{" "}" "(" ")"] @punctuation.bracket)
(pattern (escaped) @constant.character.escape)
(pattern (expansion (identifier) @variable))

(string) @string

[
  "%{"
  "%}"
  "{"
  "}"
] @punctuation.bracket

"%%" @punctuation.delimiter

(comment) @comment
