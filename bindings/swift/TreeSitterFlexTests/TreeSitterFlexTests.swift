import XCTest
import SwiftTreeSitter
import TreeSitterFlex

final class TreeSitterFlexTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_flex())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading flex grammar")
    }
}
