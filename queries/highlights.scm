(alias (identifier) @variable)

(state (identifier) @constant)

(alias (identifier) @keyword.directive
  (#match? @keyword.directive "^%"))

(rule) @string.regexp
(rule ["+" "*" "?" "|" "^" "-"] @operator)
(rule ["[" "]"] @punctuation.bracket)
(rule (escaped) @constant.character.escape)

(string) @string

[
  "%{"
  "%}"
  "{"
  "}"
] @punctuation.bracket

"%%" @punctuation.delimiter

(comment) @comment
