# Contributing Guide

## Code Style

### JavaScript/Node.js
- Use 2-space indentation
- Use ES6+ syntax
- Follow ESLint rules

### Naming Conventions
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Classes: PascalCase
- Files: kebab-case (lowercase)

## Commit Messages

Follow this format:
```
[type]: [scope] - [description]

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance

Example:
```
feat: inventory - add low stock alerts

Implement automatic alerts when inventory reaches minimum threshold.
Alerts are sent via email and displayed in dashboard.

Closes #123
```

## Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation

3. **Commit Changes**
   ```bash
   git commit -m "feat: description of changes"
   ```

4. **Push to Remote**
   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create Pull Request**
   - Fill PR template
   - Link related issues
   - Request review

6. **Address Feedback**
   - Make requested changes
   - Push updates
   - Request re-review

7. **Merge**
   - Squash commits if needed
   - Delete branch

## Testing

### Unit Tests
```bash
cd backend
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Coverage
```bash
npm run test:coverage
```

## Documentation Standards

### Code Comments
```javascript
// Use single-line comments for brief explanations

/**
 * Multi-line comments for function documentation
 * @param {Type} name - Description
 * @returns {Type} Description
 */
function example(name) {
  // Implementation
}
```

### README Standards
- Clear project description
- Installation instructions
- Usage examples
- Feature list
- Contributing guidelines
- License

## Issue Reporting

### Bug Report Template
```
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior

## Actual Behavior

## Screenshots (if applicable)

## Environment
- OS: 
- Browser: 
- Version: 
```

### Feature Request Template
```
## Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How it should work

## Alternatives
Other possible solutions
```

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Changes are well-documented
- [ ] Tests are included and passing
- [ ] No debugging code left
- [ ] Performance impact considered
- [ ] Security implications reviewed
- [ ] Database migrations included
- [ ] API documentation updated

## Release Process

1. **Update Version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update Changelog**
   - Add new features
   - Add bug fixes
   - Add breaking changes

3. **Create Release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Deploy**
   - Merge to main
   - Deploy to production
   - Monitor for issues
