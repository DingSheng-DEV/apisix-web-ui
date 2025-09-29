# Contributing Guide

Welcome to contribute to the APISIX Web UI project! This document provides guidelines for participating in project contributions.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. Check the [issue tracker](https://github.com/your-username/apisix-web-ui/issues) for existing similar issues
2. Provide a clear and descriptive title
3. Include steps to reproduce the issue
4. Describe expected vs actual behavior
5. Include relevant system information (OS, Node.js version, etc.)

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `develop`
2. **Make changes** following our coding standards
3. **Test thoroughly** your changes
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

### Development Environment Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/apisix-web-ui.git
cd apisix-web-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Coding Standards

- Use consistent indentation (2 spaces)
- Follow Vue.js style guide
- Write meaningful commit messages
- Add comments for complex logic
- Ensure proper code formatting

### Commit Message Format

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(router): add route validation

- Add input validation for route paths
- Improve error messages for invalid routes
- Update tests for new validation logic
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Include unit tests and integration tests where applicable

### Documentation

- Update README.md if adding new features
- Add JSDoc comments for new functions
- Update CHANGELOG.md for significant changes

## Project Structure

```
src/
├── components/     # Reusable Vue components
├── views/         # Page-level components
├── api/           # API service modules
├── utils/         # Utility functions
├── route/         # Vue Router configuration
└── style.css      # Global styles
```

## Need Help?

- Check existing [issues](https://github.com/your-username/apisix-web-ui/issues)
- Join our community discussions
- Read the [documentation](README.md)

Thank you for contributing to APISIX Web UI!
