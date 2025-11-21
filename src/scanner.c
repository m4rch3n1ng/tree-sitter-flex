#include "tree_sitter/parser.h"
#include <stdint.h>
#include <wctype.h>

enum TokenType {
    EMBEDDED_CODE,
    STRING_CONTENT,
    ERROR_SENTINEL,
};

void *tree_sitter_flex_external_scanner_create() {
    return NULL;
}

void tree_sitter_flex_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_flex_external_scanner_serialize(void *payload,
                                                     char *buffer) {
    return 0;
}

void tree_sitter_flex_external_scanner_deserialize(void *payload, char *buffer,
                                                   unsigned length) {}

static inline bool scan_embedded_code(TSLexer *lexer) {
    if (lexer->eof(lexer) || lexer->lookahead == '\n') {
        return false;
    } else if (lexer->lookahead == '|') {
        lexer->advance(lexer, false);
        while (iswspace(lexer->lookahead) && lexer->lookahead != '\n') {
            lexer->advance(lexer, false);
        }

        if (lexer->lookahead == '\n') {
            return false;
        }
    }

    while (lexer->lookahead != '\n' && !lexer->eof(lexer)) {
        if (lexer->lookahead == '{') {
            lexer->advance(lexer, false);

            uint32_t braces = 1;
            while (braces != 0 && !lexer->eof(lexer)) {
                if (lexer->lookahead == '{') {
                    braces += 1;
                } else if (lexer->lookahead == '}') {
                    braces -= 1;
                }

                lexer->advance(lexer, false);
            }

            if (lexer->eof(lexer)) {
                return false;
            }
        } else {
            lexer->advance(lexer, false);
        }
    }

    lexer->mark_end(lexer);
    lexer->result_symbol = EMBEDDED_CODE;
    return true;
}

static inline bool scan_string_content(TSLexer *lexer) {
    // taken from tree-sitter-rust
    bool has_content = false;
    for (;;) {
        if (lexer->eof(lexer) || lexer->lookahead == '\n') {
            return false;
        }
        if (lexer->lookahead == '"' || lexer->lookahead == '\\') {
            break;
        }

        has_content = true;
        lexer->advance(lexer, false);
    }

    lexer->result_symbol = STRING_CONTENT;
    lexer->mark_end(lexer);
    return has_content;
}

bool tree_sitter_flex_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
    if (valid_symbols[ERROR_SENTINEL]) {
        return false;
    }

    if (valid_symbols[EMBEDDED_CODE]) {
        return scan_embedded_code(lexer);
    }

    if (valid_symbols[STRING_CONTENT]) {
        return scan_string_content(lexer);
    }

    return false;
}
