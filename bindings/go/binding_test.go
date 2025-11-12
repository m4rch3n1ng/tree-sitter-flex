package tree_sitter_flex_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_flex "github.com/m4rh3n1ng/flex/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_flex.Language())
	if language == nil {
		t.Errorf("Error loading flex grammar")
	}
}
