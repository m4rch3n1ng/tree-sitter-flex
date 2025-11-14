/**
 * @file a tree-sitter grammar for flex
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

    comment: _ => seq("/*", optional(token(/([^*]|\*[^/])+/)), "*/"),
    _comments: $ => repeat1(seq($.comment, $._space)),

    identifier: _ => /(\p{XID_Start}|%)\p{XID_Continue}*/,

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
      optional($._comments),
      optional(seq(
        $.prologue,
        optional($._space),
        optional($._comments),
      )),
      optional(seq(
        repeat1(seq(
          $.alias,
          optional($._whitespace),
          optional($.comment),
          $._space,
        )),
        optional($._comments),
      )),
      optional($._space),
      "%%",
    ),

    rule: _ => /[^<"]\S*?/,

    state: $ => seq(
      "<",
      $.identifier,
      ">"
    ),

    string: _ => seq(
      '"',
      token(/[^"\n]*/),
      '"'
    ),

    embedded_code: _ => seq(
      '{',
      // TODO: allow { in code blocks if balanced
      token(/[^}]*/),
      '}'
    ),

    declaration: $ => seq(
      optional($.state),
      choice(
        $.string,
        $.rule,
      ),
      optional($._whitespace),
      optional($.embedded_code),
      optional($.comment),
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
