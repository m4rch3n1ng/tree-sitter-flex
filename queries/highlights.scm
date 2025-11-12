(alias (identifier) @constant)

(alias (identifier) @keyword.directive
  (#match? @keyword.directive "^%"))

(rule) @constant.numeric
(string) @string

[
  "%{"
  "%}"
  "{"
  "}"
] @punctuation.bracket

"%%" @punctuation.delimiter

(line_comment) @comment
(block_comment) @comment
