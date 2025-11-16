(directive (identifier) @keyword.directive)
(definition (identifier) @variable)

(state (identifier) @constant)

(rule) @string.regexp
(rule ["+" "*" "?" "|" "^" "-"] @operator)
(rule ["[" "]" "{" "}" "(" ")"] @punctuation.bracket)
(rule (escaped) @constant.character.escape)
(rule (interpolation (identifier) @variable))

(string) @string

[
  "%{"
  "%}"
  "{"
  "}"
] @punctuation.bracket

"%%" @punctuation.delimiter

(comment) @comment
