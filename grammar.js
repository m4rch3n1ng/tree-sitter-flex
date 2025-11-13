/**
 * @file a tree-sitter grammar for gnu flex
 * @author may
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "flex",

  rules: {
    source_file: $ => seq(
      $.section1,
      $.section2,
      optional($._space),
      optional(alias($.trailing_code, $.embedded_code)),
    ),

    _whitespace: _ => /[ \t\r\v\f]+/,
    _newline: _ => /\n/,
    _space: _ => /\s+/,

    identifier: _ => /(\p{XID_Start}|%)\p{XID_Continue}*/,

    line_comment: $ => seq("//", token(/[^\n]*/), $._newline),
    block_comment: _ => seq("/*", token(/([^*]|\*[^/])*/), "*/"),
    _comment: $ => choice($.line_comment, $.block_comment),

    prologue: $ => seq(
      "%{",
      alias($.prologue_body, $.embedded_code),
      "%}"
    ),

    prologue_body: _ => token(/([^%]|%[^}])*/),

    alias: $ => seq(
      optional($._whitespace),
      $.identifier,
      optional($._whitespace),
      $.rule,
    ),

    section1: $ => seq(
      optional($._space),
      optional($.prologue),
      optional($._space),
      repeat(seq(
        $.alias,
        optional($._whitespace),
        optional($._comment),
        $._space,
      )),
      optional($._whitespace),
      "%%",
    ),

    rule: _ => /[^"]\S*?/,

    string: _ => seq(
      '"',
      token(/[^"]*/),
      '"'
    ),

    embedded_code: _ => seq(
      '{',
      // TODO: allow { in code blocks if balanced
      token(/[^}]*/),
      '}'
    ),

    declaration: $ => seq(
      choice(
        $.string,
        $.rule,
      ),
      optional($._whitespace),
      optional($.embedded_code),
      optional($._comment),
      optional($._newline),
    ),

    section2: $ => seq(
      optional($._space),
      repeat($.declaration),
      optional($._space),
      "%%",
    ),

    trailing_code: _ => /(.|\n)+/,
  }
});
