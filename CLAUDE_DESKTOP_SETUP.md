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

```json
{
  "mcpServers": {
    "bernova": {
      "command": "node",
      "args": [
        "/absolute/path/to/bernova-mcp-server/dist/index.js"
      ]
    }
  }
}
```

## Using with npx (if installed globally or in project)

```json
{
  "mcpServers": {
    "bernova": {
      "command": "npx",
      "args": [
        "-y",
        "bernova-mcp-server"
      ]
    }
  }
}
```

## Using from local project

If you're developing the MCP server locally:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "node",
      "args": [
        "C:\\Users\\YourUser\\path\\to\\bernova-mcp-server\\dist\\index.js"
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

### Node version

Ensure you have Node.js >= 20.0.0:
```bash
node --version
```

### Permissions

On Unix systems, ensure the script is executable:
```bash
chmod +x /path/to/bernova-mcp-server/dist/index.js
```

### Testing manually

You can test the server manually:
```bash
node /path/to/bernova-mcp-server/dist/index.js
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
