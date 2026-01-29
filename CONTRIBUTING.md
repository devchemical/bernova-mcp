# Contributing to Bernova MCP

First off, thank you for considering contributing to Bernova MCP! It's people like you that make this tool better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct: be respectful, inclusive, and professional.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List examples of how it would be used**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, ensure it compiles without errors
3. Ensure your code follows the existing style
4. Update the documentation if needed
5. Write a clear commit message

#### Development Process

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/bernova-mcp.git
cd bernova-mcp

# Install dependencies
npm install

# Make your changes in src/

# Build and test
npm run build
node dist/index.js

# Commit your changes
git add .
git commit -m "Description of changes"
git push origin your-branch-name
```

#### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

Examples:
```
Add support for nested media queries

Fix validation error when using dynamic values (#123)

Update README with new tool examples
```

## Style Guide

### TypeScript Style

- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use async/await instead of promises
- Use meaningful variable names
- Add JSDoc comments for public functions

### File Organization

- One tool per file in `src/tools/`
- Utilities in `src/utils/`
- Types in `src/types/`
- Keep functions small and focused

### Error Handling

All tool functions should return `ToolResponse`:

```typescript
export async function myTool(): Promise<ToolResponse> {
  try {
    // Implementation
    return {
      success: true,
      data: result,
      message: 'Success message'
    };
  } catch (error) {
    return {
      success: false,
      error: `Error: ${error}`
    };
  }
}
```

## Documentation

- Update README.md for user-facing changes
- Update EXAMPLES.md if adding new tools
- Update DEVELOPMENT.md for development-related changes
- Add JSDoc comments to new functions

## Questions?

Feel free to open an issue with the question label or start a discussion.

Thank you for contributing! 🎉
