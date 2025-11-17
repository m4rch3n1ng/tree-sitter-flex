/**
 * @file a tree-sitter grammar for flex
 * @author may
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "flex",

  externals: $ => [$.embedded_code, $.error_sentinel],

  rules: {
    source_file: $ => seq(
      optional($._space),
      optional($._comments),
      alias(
        repeat(seq(
          choice($.directive, $.definition, $.prologue),
          optional($._space),
          optional($._comments),
        )),
        $.section1
      ),
      optional(seq(
        "%%",
        alias(
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
          $.section2
        ),
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

    identifier: _ => /\p{XID_Start}\p{XID_Continue}*/,
    _directive: _ => /%\p{XID_Start}\p{XID_Continue}*/,

    prologue: $ => seq(
      "%{",
      alias($.prologue_body, $.embedded_code),
      "%}"
    ),

    prologue_body: _ => token(/([^%]|%[^}])*/),

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

    escaped: _ => seq("\\", token(/./)),

    expansion: $ => seq("{", $.identifier, "}"),

    _bracketed_token: $ => choice($.escaped, token(/[^\]\n]/)),
    _bracketed_tokens: $ => seq(choice("^", $._bracketed_token), repeat(choice("-", $._bracketed_token))),
    _bracketed: $ => seq("[", optional($._bracketed_tokens), token("]")),

    _pattern_comment: _ => seq("(?#", optional(/[^)]+/), ")"),

    // TODO: properly parse groups
    _pattern_token: $ => choice("+", "*", "?", "|", alias($._pattern_comment, $.comment), "(", ")", $.escaped, token(/\S/)),

    string: _ => seq(
      '"',
      token(/[^"\n]*/),
      '"'
    ),

    pattern: $ => repeat1(choice(
      $.string,
      $.expansion,
      $._bracketed,
      $._pattern_token,
    )),

    rule: $ => seq(
      $.pattern,
      choice(
        optional($._whitespace),
        seq(
          $._whitespace,
          $.embedded_code
        ),
      ),
      $._newline,
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
