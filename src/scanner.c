#include "tree_sitter/parser.h"

enum TokenType {
    EMBEDDED_CODE,
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

bool tree_sitter_flex_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
    if (valid_symbols[ERROR_SENTINEL]) {
        return false;
    }

    if (valid_symbols[EMBEDDED_CODE]) {
        return scan_embedded_code(lexer);
    }

    return false;
}
