# Development Guide

## Project Structure

```
bernova-mcp-server/
├── src/
│   ├── index.ts              # MCP Server entry point
│   ├── tools/                # Tool implementations
│   │   ├── config.ts         # Configuration management
│   │   ├── compile.ts        # Compilation tools
│   │   ├── components.ts     # Component CRUD operations
│   │   └── variables.ts      # Variables & media queries
│   ├── types/
│   │   └── bernova.types.ts  # TypeScript type definitions
│   └── utils/
│       ├── file-system.ts    # File system utilities
│       └── validators.ts     # Validation functions
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── README.md                 # Main documentation
├── EXAMPLES.md              # Usage examples
├── CLAUDE_DESKTOP_SETUP.md  # Claude Desktop integration guide
└── LICENSE

```

## Development Commands

### Install dependencies
```bash
npm install
```

### Build (compile TypeScript)
```bash
npm run build
```

### Watch mode (auto-recompile on changes)
```bash
npm run dev
```

### Run the server
```bash
npm start
# or
node dist/index.js
```

## Adding New Tools

### 1. Create the tool function

Add your function to the appropriate file in `src/tools/`:

```typescript
// src/tools/my-feature.ts
import type { ToolResponse } from '../types/bernova.types.js';

export async function myNewTool(param: string): Promise<ToolResponse> {
  try {
    // Implementation
    return {
      success: true,
      data: result,
      message: 'Operation completed'
    };
  } catch (error) {
    return {
      success: false,
      error: `Error: ${error}`
    };
  }
}
```

### 2. Register the tool in the server

Edit `src/index.ts`:

```typescript
// 1. Import your tool
import * as myFeatureTools from './tools/my-feature.js';

// 2. Add to ListToolsRequestSchema handler
{
  name: 'my_new_tool',
  description: 'Description of what the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param: {
        type: 'string',
        description: 'Parameter description'
      }
    },
    required: ['param']
  }
}

// 3. Add to CallToolRequestSchema handler
case 'my_new_tool':
  result = await myFeatureTools.myNewTool(args?.param as string);
  break;
```

### 3. Rebuild and test

```bash
npm run build
node dist/index.js
```

## Code Style

### Naming Conventions

- **Files**: kebab-case (`my-feature.ts`)
- **Functions**: camelCase (`myFunction`)
- **Types/Interfaces**: PascalCase (`MyInterface`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)

### Function Structure

All tool functions should:
1. Accept typed parameters
2. Return `ToolResponse<T>`
3. Handle errors gracefully
4. Provide meaningful messages

```typescript
export async function toolName(
  param1: string,
  param2?: number
): Promise<ToolResponse<ResultType>> {
  try {
    // Validation
    if (!param1) {
      return {
        success: false,
        error: 'param1 is required'
      };
    }

    // Implementation
    const result = await doSomething(param1);

    // Success
    return {
      success: true,
      data: result,
      message: 'Operation successful'
    };
  } catch (error) {
    // Error handling
    return {
      success: false,
      error: `Error in toolName: ${error}`
    };
  }
}
```

## Type Safety

### Always define types

```typescript
// Bad
export async function myTool(data: any): Promise<any> { }

// Good
export async function myTool(data: MyDataType): Promise<ToolResponse<MyResultType>> { }
```

### Use type guards

```typescript
if (typeof value === 'string') {
  // TypeScript knows value is string here
}

if (Array.isArray(value)) {
  // TypeScript knows value is array here
}
```

## Testing

### Manual Testing

1. Create a test Bernova project:
```bash
mkdir test-project
cd test-project
npm init -y
npm install bernova
```

2. Start the MCP server:
```bash
node /path/to/bernova-mcp-server/dist/index.js
```

3. Test with MCP client or Claude Desktop

### Testing individual tools

You can test tools programmatically:

```typescript
import { createConfig } from './src/tools/config.js';

const result = await createConfig('test-theme');
console.log(result);
```

## Debugging

### Enable verbose logging

Add to `src/index.ts`:

```typescript
console.error('Debug:', JSON.stringify(args, null, 2));
```

### Check MCP client logs

- Claude Desktop logs are in application logs folder
- Check for connection errors or tool execution failures

### Common Issues

#### Module not found
```bash
# Rebuild the project
npm run build
```

#### Type errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

#### Runtime errors
```bash
# Check Node version
node --version  # Should be >= 20.0.0
```

## Performance Optimization

### File reading
- Use streaming for large files
- Cache frequently accessed data
- Avoid reading entire files when possible

### Compilation
- Only compile what changed (use `componentOnly` or `foundationOnly`)
- Use Bernova's minification options for production

## Security

### File system access
- Always validate paths
- Use `path.join()` and `path.resolve()` for path construction
- Never trust user input directly

### Configuration validation
- Validate all inputs before processing
- Use the validators in `src/utils/validators.ts`
- Return meaningful error messages

## Publishing

### Pre-publish checklist

- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] README.md is up to date
- [ ] Version bumped in package.json
- [ ] CHANGELOG updated
- [ ] License file present

### Publish to npm

```bash
npm run build
npm test  # If you have tests
npm publish
```

## Contributing

### Before submitting a PR

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update documentation
5. Test thoroughly
6. Submit PR with description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How the changes were tested

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] All tests pass
```

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- MAJOR version: incompatible API changes
- MINOR version: backwards-compatible functionality
- PATCH version: backwards-compatible bug fixes

## Resources

- [Bernova Documentation](https://github.com/kubit-ui/bernova)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

## Support

- GitHub Issues: For bugs and feature requests
- Discussions: For questions and community support

---

Happy coding! 🚀
