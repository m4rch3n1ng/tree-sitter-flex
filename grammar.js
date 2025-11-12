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
    source_file: $ => "hello"
  }
});
