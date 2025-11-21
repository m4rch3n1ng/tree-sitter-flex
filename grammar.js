/**
 * @file a tree-sitter grammar for flex
 * @author may
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "flex",

  externals: $ => [$.embedded_code, $._string_content, $.error_sentinel],

  rules: {
    source_file: $ => seq(
      repeat(choice(
        $._newline,
        seq(
          $._whitespace,
          optional($.embedded_code),
          $._newline
        ),
        seq(
          $.comment,
          optional($._whitespace),
          $._newline,
        ),
        $.code_block,
        $.top_block,
        $.directive,
        $.definition,
      )),
      optional(seq(
        "%%",
        repeat(seq(
          optional(seq($._whitespace, optional($.embedded_code))),
          $._newline
        )),
        optional(seq(
          $._declaration_or_condition,
          repeat(seq(choice(
            seq(
              $._whitespace,
              repeat(seq(
                $.comment,
                optional($._whitespace)
              )),
              $._newline,
            ),
            $._declaration_or_condition,
          ))),
        )),
        optional($._whitespace),
        optional(seq(
          "%%",
          optional($._space),
          optional(alias($.trailing_code, $.embedded_code)),
        )),
      )),
    ),

    _whitespace: _ => /[ \t\r\v\f]+/,
    _newline: _ => /\n/,
    _space: _ => /\s+/,

    comment: _ => seq("/*", optional(token(/([^*]|\*[^/])+/)), "*/"),
    _comments: $ => repeat1(seq($.comment, $._space)),
    _inline_comments: $ => repeat1(seq($.comment, optional($._whitespace))),

    identifier: _ => /[\p{XID_Start}_][\p{XID_Continue}\-]*/,
    _directive: _ => /%[\p{XID_Start}_][\p{XID_Continue}\-]*/,

    code_block: $ => seq(
      "%{",
      alias($.code_block_body, $.embedded_code),
      "%}"
    ),

    code_block_body: $ => seq(
      $._newline,
      repeat(seq(
        optional(/([^%]|%[^}]).*/),
        $._newline,
      )),
    ),

    top_block: $ => seq(
      "%top{",
      optional(alias(/[^}]+/, $.embedded_code)),
      "}",
    ),

    directive: $ => seq(
      alias(alias($._directive, $.identifier), $.identifier),
      optional($._whitespace),
      optional($._inline_comments),
      optional(seq(
        alias(token(/[^\s/]+/), $.value),
        optional($._whitespace),
        optional($._inline_comments),
      )),
      $._newline,
    ),

    definition: $ => seq(
      $.identifier,
      optional($._whitespace),
      optional($._inline_comments),
      optional(seq(
        $.pattern,
        optional($._whitespace),
        optional($._inline_comments),
      )),
      $._newline,
    ),

    escaped: _ => seq("\\",
      choice(
        /\d{3}|x[0-9a-fA-F]{2}|./,
        /x[0-9a-fA-F]{2}/,
        /./
      ),
    ),

    expansion: $ => seq("{", $.identifier, "}"),

    number: _ => token(/\d+/),
    quantifier: $ => seq("{", $.number, optional(seq(",", optional($.number))), "}"),

    _bracketed_token: $ => choice($.escaped, token(/[^\]\n]/)),
    _bracketed_tokens: $ => seq(choice("^", $._bracketed_token), repeat(choice("-", $._bracketed_token))),
    bracketed: $ => seq("[", optional($._bracketed_tokens), token("]")),

    _pattern_comment: _ => seq("(?#", optional(/[^)]+/), ")"),

    // TODO: properly parse groups
    _pattern_token: $ => choice(
      "+",
      "*",
      "?",
      "|",
      "/",
      alias($._pattern_comment, $.comment),
      "(",
      ")",
      $.escaped,
      token(/\S/)
    ),

    string: $ => seq(
      '"',
      repeat(choice(
        $.escaped,
        $._string_content,
      )),
      '"',
    ),

    eof: _ => "<<EOF>>",

    _pattern: $ => choice(
      $.string,
      $.expansion,
      $.quantifier,
      $.bracketed,
      $.eof,
      $._pattern_token,
    ),

    pattern: $ => choice(
      "^",
      seq(
        optional("^"),
        repeat(choice(alias("$", $.token), $._pattern)),
        choice(choice("$", $._pattern)),
      ),
    ),

    action: $ => choice(
      seq("|", optional($._whitespace), $._newline),
      seq($.embedded_code, $._newline),
    ),

    rule: $ => seq(
      $.pattern,
      choice(
        seq(
          optional($._whitespace),
          $._newline,
        ),
        seq(
          $._whitespace,
          $.action,
        ),
      ),
    ),

    condition: $ => seq(
      "<",
      choice(
        "*",
        seq($.identifier, repeat(seq(",", $.identifier))),
      ),
      ">",
      choice(
        seq(
          '{',
          repeat($.rule),
          '}',
          optional($._whitespace),
          $._newline,
        ),
        $.rule,
      ),
    ),

    _declaration_or_condition: $ => choice($.rule, $.condition),

    trailing_code: _ => /(.|\n)+/,
  }
});
