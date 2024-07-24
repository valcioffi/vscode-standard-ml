# Contributing to ML/Standard ML for Visual Studio Code

Thank you for your interest in contributing to the ML/Standard ML extension for Visual Studio Code! This document provides guidelines for contributing to the project.

## Setting Up Your Development Environment

1. Clone the repository to your local machine.
2. Ensure you have Node.js installed. You can download it from [https://nodejs.org/](https://nodejs.org/).
3. Run `npm install` in the project root to install all necessary dependencies.

## Contributing Code

### Working with the Codebase

- The main language syntax definitions are located in [syntaxes/ml.tmLanguage.js](syntaxes/ml.tmLanguage.js). If you wish to contribute to the syntax highlighting, this is where you would make changes. Run `npm run build` to generate [syntaxes/ml.tmLanguage.json](syntaxes/ml.tmLanguage.json).

    > **⚠️ Warning:** Any direct changes to `ml.tmLanguage.json` will be overwritten; only edit it for testing and debugging purposes.
- Snippets are defined in [snippets/ml.tmSnippet.json](snippets/ml.tmSnippet.json). Feel free to add more snippets that could be helpful for ML/Standard ML development.

### Coding Guidelines

- Please try follow existing coding styles and conventions.
    - **Indentation**: two spaces
    - **Variables names**: camelCase
- Write clean, readable code and ensure it is well-commented.
- Test your changes thoroughly before submitting a pull request.

## Submitting Pull Requests

1. Fork the repository on GitHub.
2. Create a new branch for your changes.
3. Commit your changes to the branch.
4. Push the branch to GitHub.
5. Submit a pull request to the main repository.
6. Describe your changes in detail in the pull request description.

## Reporting Issues

If you find any bugs or have feature requests, please create an issue on the GitHub repository. Be sure to include detailed steps to reproduce any bugs, and suggest how the feature would be beneficial.
> 🌱 Be **newcomer friendly**: if help is wanted and the issue does not appear complex, please consider adding the `#good-first-issue` tag!

---

Thank you for contributing to the ML/Standard ML extension for Visual Studio Code! **Enjoy coding!** ⚡