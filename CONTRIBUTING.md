# Contributing to TaskForge AI

Thank you for your interest in contributing to TaskForge AI! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/TaskForge-sh.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in README.md

## Development Workflow

### Before Starting

1. Check existing issues to avoid duplicates
2. Create an issue to discuss major changes
3. Keep commits focused and descriptive

### Code Standards

- **TypeScript**: All code must be TypeScript
- **Formatting**: Run `npm run format` before committing
- **Linting**: Ensure `npm run lint` passes
- **Type Checking**: Ensure `npm run type-check` passes

### Component Guidelines

```typescript
// Use 'use client' for client components
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface MyComponentProps {
  children: ReactNode;
  className?: string;
}

export function MyComponent({ children, className }: MyComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```

### Service Layer Pattern

```typescript
// src/services/example.ts
import { supabase } from '@/lib/supabase/client';

export async function getExamples() {
  const { data, error } = await supabase
    .from('examples')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

### Custom Hook Pattern

```typescript
// src/hooks/useExample.ts
import { useQuery } from '@tanstack/react-query';
import { getExamples } from '@/services/example';

export function useExamples() {
  return useQuery({
    queryKey: ['examples'],
    queryFn: getExamples,
  });
}
```

## Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
- `feat: add task filtering by priority`
- `fix: resolve authentication redirect issue`
- `docs: update API documentation`
- `refactor: simplify task service`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all checks pass
4. Write clear PR description
5. Reference related issues
6. Request review from maintainers

### PR Title Format

```
[Type] Brief description

Example: [Feature] Add task priority filtering
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
How to test these changes

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
```

## Testing Guidelines

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('renders with children', () => {
    render(<MyComponent>Test</MyComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Areas for Contribution

### High Priority
- Complete task CRUD operations
- Implement advanced filtering
- Build collaboration features
- Add comprehensive testing

### Medium Priority
- Improve UI/UX
- Enhance animations
- Add keyboard shortcuts
- Optimize performance

### Lower Priority
- Documentation improvements
- Code refactoring
- Developer experience
- Testing coverage

## Reporting Issues

### Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information
- Screenshots if applicable

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative solutions
- Additional context

## Questions?

- Check documentation files
- Review existing code
- Ask in issue discussions
- Email support@taskforge.ai

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TaskForge AI! 🚀
