# MCP Configuration for IDEs

Configure Bernova MCP Server to work with AI-powered IDEs that support the Model Context Protocol.

## Supported IDEs

- ✅ **Claude Desktop** - Anthropic's desktop app
- ✅ **VS Code** - With Cline extension
- ✅ **Cursor** - AI-first code editor
- ✅ **Windsurf** - Codeium's IDE
- ✅ **Zed** - High-performance editor
- ✅ **Any MCP-compatible IDE**

---

## 🖥️ Claude Desktop

### Configuration File Location

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Configuration

#### Option 1: Using Bun (Recommended)

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/bernova-mcp/dist/index.js"]
    }
  }
}
```

#### Option 2: Using Node.js

```json
{
  "mcpServers": {
    "bernova": {
      "command": "node",
      "args": ["/absolute/path/to/bernova-mcp/dist/index.js"]
    }
  }
}
```

#### Windows Example

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "C:\\Users\\YourUser\\Projects\\bernova-mcp\\dist\\index.js"]
    }
  }
}
```

---

## 💻 VS Code (with Cline Extension)

[Cline](https://github.com/cline/cline) is a VS Code extension that supports MCP.

### 1. Install Cline

```bash
code --install-extension saoudrizwan.claude-dev
```

Or search "Cline" in VS Code Extensions marketplace.

### 2. Configure MCP

Open VS Code Settings (JSON) and add:

**File:** `settings.json`

```json
{
  "cline.mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/bernova-mcp/dist/index.js"]
    }
  }
}
```

**Windows Example:**

```json
{
  "cline.mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "C:\\Users\\YourUser\\Projects\\bernova-mcp\\dist\\index.js"]
    }
  }
}
```

### 3. Restart VS Code

After configuration, restart VS Code and open Cline panel.

---

## 🎯 Cursor

Cursor has native MCP support.

### Configuration File Location

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

**Linux:**
```
~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

### Configuration

Create or edit the MCP settings file:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/bernova-mcp/dist/index.js"]
    }
  }
}
```

### Alternative: Using Cursor Settings UI

1. Open Cursor Settings
2. Search for "MCP" or "Model Context Protocol"
3. Add new MCP server:
   - **Name:** `bernova`
   - **Command:** `bun` (or `node`)
   - **Args:** `["run", "/path/to/bernova-mcp/dist/index.js"]`

---

## 🌊 Windsurf (Codeium)

### Configuration File Location

**macOS:**
```
~/Library/Application Support/Windsurf/mcp_settings.json
```

**Windows:**
```
%APPDATA%\Windsurf\mcp_settings.json
```

**Linux:**
```
~/.config/Windsurf/mcp_settings.json
```

### Configuration

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/bernova-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

### Using Windsurf UI

1. Open Windsurf Settings (⚙️)
2. Navigate to **Extensions** → **MCP Servers**
3. Click **Add Server**
4. Configure:
   - **Name:** Bernova
   - **Command:** `bun run /path/to/bernova-mcp/dist/index.js`
5. Save and restart Windsurf

---

## ⚡ Zed Editor

Zed has built-in support for MCP servers.

### Configuration File Location

**macOS/Linux:**
```
~/.config/zed/settings.json
```

**Windows:**
```
%APPDATA%\Zed\settings.json
```

### Configuration

```json
{
  "context_servers": {
    "bernova": {
      "command": {
        "path": "bun",
        "args": ["run", "/absolute/path/to/bernova-mcp/dist/index.js"]
      }
    }
  }
}
```

### Alternative with Node.js

```json
{
  "context_servers": {
    "bernova": {
      "command": {
        "path": "node",
        "args": ["/absolute/path/to/bernova-mcp/dist/index.js"]
      }
    }
  }
}
```

---

## 🎨 Generic MCP Configuration

For any MCP-compatible IDE, use this general structure:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/bernova-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

---

## 🔧 Configuration Options

### Using Package Managers

#### With Bun (if installed globally):

```json
{
  "command": "bunx",
  "args": ["bernova-mcp"]
}
```

#### With npm (if installed globally):

```json
{
  "command": "npx",
  "args": ["-y", "bernova-mcp"]
}
```

### Environment Variables

Add custom environment variables:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "/path/to/bernova-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "DEBUG": "false"
      }
    }
  }
}
```

### Multiple MCP Servers

Run multiple MCP servers simultaneously:

```json
{
  "mcpServers": {
    "bernova": {
      "command": "bun",
      "args": ["run", "/path/to/bernova-mcp/dist/index.js"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

---

## ✅ Verification

After configuring your IDE:

1. **Restart the IDE completely**
2. Open the AI assistant panel
3. Check available tools/commands
4. You should see 15 Bernova tools:
   - `get_config`
   - `create_config`
   - `update_config`
   - `list_themes`
   - `compile_styles`
   - `build_styles`
   - `create_component`
   - `get_component`
   - `update_component`
   - `delete_component`
   - `list_components`
   - `add_css_variable`
   - `update_css_variable`
   - `get_css_variables`
   - `add_media_query`
   - `list_media_queries`
   - `validate_component_styles`

### Test Command

Try asking your AI assistant:

```
"What Bernova MCP tools do you have available?"
```

Or:

```
"Create a new Bernova configuration with a button component"
```

---

## 📖 Example Usage

Once configured, you can interact with the AI in your IDE:

**You:** "Create a new Bernova theme with primary colors"

**AI will:**
1. Use `create_config` to initialize
2. Use `add_css_variable` to add colors
3. Use `compile_styles` to generate CSS

**You:** "Add a responsive button component with hover effects"

**AI will:**
1. Use `create_component` with button styles
2. Add `$pseudoClasses` for hover
3. Add `$mediaQueries` for responsiveness
4. Compile the styles

---

## 🐛 Troubleshooting

### Server Not Starting

**Check logs:**

- **Claude Desktop:**
  - macOS: `~/Library/Logs/Claude/mcp*.log`
  - Windows: `%APPDATA%\Claude\logs\mcp*.log`

- **VS Code/Cursor:**
  - Output panel → Select "Cline" or "MCP"

- **Windsurf:**
  - Developer Console (Ctrl+Shift+I)

### Runtime Requirements

**If using Bun:**
```bash
bun --version  # Should be >= 1.0.0
```

**If using Node.js:**
```bash
node --version  # Should be >= 20.0.0
```

### Path Issues

- Always use **absolute paths** (full path from root)
- On Windows, use double backslashes: `C:\\Users\\...`
- Or use forward slashes: `C:/Users/...`

### Permissions (Unix/Linux/macOS)

```bash
chmod +x /path/to/bernova-mcp/dist/index.js
```

### Test Manually

**Using Bun:**
```bash
bun run /path/to/bernova-mcp/dist/index.js
```

**Using Node:**
```bash
node /path/to/bernova-mcp/dist/index.js
```

**Expected output:**
```
Bernova MCP Server running on stdio
```

### Common Errors

#### "Command not found: bun"

Install Bun:
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

Or use Node.js instead.

#### "ENOENT: no such file or directory"

- Check the path is correct
- Use absolute path, not relative
- Ensure `dist/index.js` exists (run `bun run build` first)

#### "Port already in use"

Another MCP server might be running. Restart your IDE.

---

## 🎯 IDE-Specific Tips

### Claude Desktop
- Supports multiple MCP servers natively
- Best performance with Bun
- Logs are easily accessible

### VS Code + Cline
- Can debug MCP servers with VS Code debugger
- Settings sync across devices
- Extensions marketplace has MCP tools

### Cursor
- Native MCP support in latest versions
- UI for managing MCP servers
- Fast startup and hot reload

### Windsurf
- Codeium AI integration
- Multi-model support
- Cloud sync for settings

### Zed
- Lightweight and fast
- Built-in collaboration
- Rust-based performance

---

## 📚 Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Bernova Documentation](https://github.com/kubit-ui/bernova)
- [Bun Documentation](https://bun.sh/docs)
- [Claude Desktop](https://claude.ai/download)
- [Cline (VS Code)](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
- [Cursor](https://cursor.sh)
- [Windsurf](https://codeium.com/windsurf)
- [Zed](https://zed.dev)

---

## 💡 Pro Tips

1. **Use Bun for best performance** - 3x faster than npm
2. **Keep MCP server updated** - `bun update bernova-mcp`
3. **Use absolute paths** - Avoid path resolution issues
4. **Restart IDE after config changes** - Ensures MCP reloads
5. **Check logs when debugging** - They contain helpful error messages
6. **Test server manually first** - Before configuring in IDE

---

## 🤝 Need Help?

- [Open an issue](https://github.com/devchemical/bernova-mcp/issues)
- Check [Examples](EXAMPLES.md) for usage patterns
- Read [Development Guide](DEVELOPMENT.md) for advanced setup
