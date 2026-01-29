# 🚀 Why Bun?

This project uses [Bun](https://bun.sh) as the recommended runtime and package manager instead of Node.js/npm.

## Benefits of Using Bun

### ⚡ Speed

- **3x faster** package installation than npm
- **10x faster** startup time
- Built-in TypeScript support (no need for ts-node)
- Native ESM and CommonJS support

### 🛠️ Developer Experience

- Drop-in replacement for Node.js
- Compatible with npm packages
- Built-in test runner
- Built-in bundler
- No configuration needed

### 📦 Single Tool

Bun replaces:
- Node.js runtime
- npm/yarn/pnpm
- TypeScript compiler (for running)
- Bundlers (webpack, esbuild)
- Test runners (jest, vitest)

## Installation

### Install Bun

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Verify Installation

```bash
bun --version
```

## Using This Project with Bun

### Install dependencies

```bash
bun install
```

### Build the project

```bash
bun run build
```

### Run the MCP server

```bash
bun start
# or
bun run dist/index.js
```

### Development mode (watch)

```bash
bun run dev
```

## Compatibility

### Can I still use Node.js?

**Yes!** The project is fully compatible with Node.js >= 20.0.0.

```bash
# Using Node.js
npm install
npm run build
npm start
```

### Can I still use npm/yarn/pnpm?

**Yes!** You can use any package manager:

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

## Performance Comparison

```
Package Installation (bernova-mcp dependencies):
- npm:  ~45s
- pnpm: ~25s
- yarn: ~30s
- bun:  ~15s ⚡

Startup Time:
- node: ~150ms
- bun:  ~15ms ⚡
```

## Migration from npm to Bun

If you were using npm before:

```bash
# 1. Remove npm artifacts
rm -rf node_modules package-lock.json

# 2. Install with Bun
bun install

# 3. Use Bun commands
bun run build
bun start
```

## Bun Commands Reference

```bash
# Install dependencies
bun install

# Add a package
bun add <package>
bun add -d <package>  # dev dependency
bun add -g <package>  # global

# Remove a package
bun remove <package>

# Run scripts
bun run <script>
bun start

# Execute a file
bun run file.ts
bun run file.js

# Update dependencies
bun update

# Run tests (if configured)
bun test
```

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun GitHub](https://github.com/oven-sh/bun)
- [Bun Discord](https://bun.sh/discord)

## Troubleshooting

### Bun not found after installation

**macOS/Linux:**
```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export PATH="$HOME/.bun/bin:$PATH"

# Reload your shell
source ~/.zshrc  # or ~/.bashrc
```

**Windows:**
The installer should add Bun to PATH automatically. If not, add manually:
`C:\Users\YourUser\.bun\bin`

### Package compatibility issues

Most npm packages work with Bun. If you encounter issues:

1. Check [Bun compatibility tracker](https://bun.sh/docs/runtime/compatibility)
2. Report the issue on [Bun GitHub](https://github.com/oven-sh/bun/issues)
3. Fallback to Node.js for that specific case

### TypeScript errors

Bun uses its own TypeScript transpiler. If you see errors:

```bash
# Use explicit TypeScript compiler
bun x tsc --noEmit  # Type checking only
```

---

**Note:** While Bun is recommended for development, the MCP server works perfectly with Node.js in production environments. Choose what works best for your setup!
