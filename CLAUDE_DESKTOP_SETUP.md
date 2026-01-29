# Claude Desktop Configuration

To use the Bernova MCP Server with Claude Desktop, add this configuration to your Claude Desktop config file.

## Configuration File Location

### macOS
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Windows
`%APPDATA%\Claude\claude_desktop_config.json`

### Linux
`~/.config/Claude/claude_desktop_config.json`

## Configuration

Add the following to your `claude_desktop_config.json`:

### Option 1: Using Bun (Recommended - Faster)

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": [
        "run",
        "/absolute/path/to/bernova-mcp/dist/index.js"
      ]
    }
  }
}
```

### Option 2: Using Node.js

```json
{
  "mcpServers": {
    "bernova": {
      "command": "node",
      "args": [
        "/absolute/path/to/bernova-mcp/dist/index.js"
      ]
    }
  }
}
```

## Using with package managers (if installed globally or in project)

### With Bun:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bunx",
      "args": ["bernova-mcp"]
    }
  }
}
```

### With npm:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "npx",
      "args": ["-y", "bernova-mcp"]
    }
  }
}
```

## Using from local project

If you're developing the MCP server locally:

### Windows (Bun):
```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": [
        "run",
        "C:\\Users\\YourUser\\path\\to\\bernova-mcp\\dist\\index.js"
      ]
    }
  }
}
```

### Windows (Node):
```json
{
  "mcpServers": {
    "bernova": {
      "command": "node",
      "args": [
        "C:\\Users\\YourUser\\path\\to\\bernova-mcp\\dist\\index.js"
      ]
    }
  }
}
```

## Verification

After adding the configuration:

1. Restart Claude Desktop
2. The Bernova MCP server should appear in the available tools
3. You can verify by asking: "What tools do you have available?"
4. You should see all 15 Bernova tools listed

## Example Usage in Claude Desktop

Once configured, you can interact with Claude like this:

**You:** "Create a new Bernova configuration with a button component"

**Claude will:**
1. Use `create_config` to initialize the project
2. Use `add_css_variable` to add color tokens
3. Use `create_component` to create the button
4. Use `compile_styles` to generate the CSS

**You:** "Add a card component with hover effects"

**Claude will:**
1. Use `create_component` with the card styles
2. Include `$pseudoClasses` for hover
3. Compile the new styles

## Troubleshooting

### Server not starting

Check the Claude Desktop logs:
- macOS: `~/Library/Logs/Claude/mcp*.log`
- Windows: `%APPDATA%\Claude\logs\mcp*.log`

### Runtime requirements

**If using Bun:**
```bash
bun --version  # Should be >= 1.0.0
```

**If using Node.js:**
```bash
node --version  # Should be >= 20.0.0
```

### Permissions

On Unix systems, ensure the script is executable:
```bash
chmod +x /path/to/bernova-mcp/dist/index.js
```

### Testing manually

You can test the server manually:

**Using Bun:**
```bash
bun run /path/to/bernova-mcp/dist/index.js
```

**Using Node:**
```bash
node /path/to/bernova-mcp/dist/index.js
```

The server should output:
```
Bernova MCP Server running on stdio
```

## Multiple MCP Servers

You can run multiple MCP servers simultaneously:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "npx",
      "args": ["-y", "bernova-mcp-server"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    }
  }
}
```

## Environment Variables

If you need to pass environment variables:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```
