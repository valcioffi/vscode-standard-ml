# Change Log

All notable changes to the **ML/Standard ML** extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Unreleased

## 1.1.0 (2024-09-14)
### Added
 - Successor ML syntax support
    - Language contribution and configuraton
    - Enablement extension setting
    - Single-line/Inline comments highlighting

### Changed
 - Fix toupled arguments detection so that it does not detect comments
 - Fix type declaration highlighting so that it supports touples

## 1.0.0 (2024-07-23)
Initial release.
### Added
- Syntax Highlighting
- Snippets
    - Let-In-End Statement
    - If-Then-Else Statement
    - Function Definition
    - Signature Definition
    - Structure Definition

- snippets/ml.tmLanguage.js: JavaScript tmLanguage preprocessor for Syntax Hihlighting - for an easier grammar management
- README, LICENSE, CONTRIBUTING, CHANGELOG - for better documentation