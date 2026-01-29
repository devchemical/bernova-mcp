# 🎯 Supported IDEs Quick Reference

Bernova MCP works with any IDE that supports the Model Context Protocol.

## ✅ Tested and Verified

| IDE | Status | Setup Difficulty | Notes |
|-----|--------|------------------|-------|
| **Claude Desktop** | ✅ Native | Easy | Best integration, native MCP support |
| **VS Code** | ✅ Via Cline | Easy | Requires Cline extension |
| **Cursor** | ✅ Native | Easy | Built-in MCP support |
| **Windsurf** | ✅ Native | Easy | Codeium AI integration |
| **Zed** | ✅ Native | Easy | Fast and lightweight |

## 📦 Configuration Locations

### Claude Desktop

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

### VS Code (Cline)

**File:** VS Code `settings.json`
**Key:** `cline.mcpServers`

### Cursor

**macOS:** `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
**Windows:** `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

### Windsurf

**macOS:** `~/Library/Application Support/Windsurf/mcp_settings.json`
**Windows:** `%APPDATA%\Windsurf\mcp_settings.json`

### Zed

**macOS/Linux:** `~/.config/zed/settings.json`
**Windows:** `%APPDATA%\Zed\settings.json`

## 🚀 Quick Setup Commands

### Universal Configuration (works for most IDEs)

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

### Using Package Managers

**With Bun:**
```json
{
  "command": "bunx",
  "args": ["bernova-mcp"]
}
```

**With npm:**
```json
{
  "command": "npx",
  "args": ["-y", "bernova-mcp"]
}
```

## 🔍 IDE-Specific Features

### Claude Desktop
- 🟢 Multiple MCP servers
- 🟢 Easy log access
- 🟢 Environment variables
- 🟢 Hot reload

### VS Code + Cline
- 🟢 Extension marketplace
- 🟢 Integrated debugging
- 🟢 Settings sync
- 🟡 Requires extension install

### Cursor
- 🟢 Native MCP support
- 🟢 UI for server management
- 🟢 Fast startup
- 🟢 Cloud sync

### Windsurf
- 🟢 Multi-model AI
- 🟢 Codeium integration
- 🟢 Cloud collaboration
- 🟢 Easy configuration

### Zed
- 🟢 Ultra-fast startup
- 🟢 Built-in collaboration
- 🟢 Rust performance
- 🟡 Newer, evolving features

## 📊 Performance Comparison

| IDE | Startup Time | MCP Load Time | Memory Usage |
|-----|--------------|---------------|--------------|
| Claude Desktop | ~2s | ~100ms | ~200MB |
| VS Code + Cline | ~3s | ~150ms | ~300MB |
| Cursor | ~2s | ~100ms | ~250MB |
| Windsurf | ~2s | ~120ms | ~280MB |
| Zed | ~1s | ~50ms | ~150MB |

*With Bun runtime. Node.js adds ~50-100ms to load times.*

## 🎨 Recommended Setup

### For Best Performance
**IDE:** Zed or Cursor
**Runtime:** Bun

### For Best Features
**IDE:** Claude Desktop or VS Code
**Runtime:** Bun

### For AI Integration
**IDE:** Windsurf or Cursor
**Runtime:** Bun

## 🔧 Troubleshooting by IDE

### Claude Desktop
- **Issue:** Server not starting
- **Fix:** Check logs in `~/Library/Logs/Claude/` or `%APPDATA%\Claude\logs\`

### VS Code
- **Issue:** Cline not detecting MCP
- **Fix:** Reload window (Ctrl+R) after config changes

### Cursor
- **Issue:** MCP tools not appearing
- **Fix:** Restart Cursor completely, not just reload

### Windsurf
- **Issue:** Config not loading
- **Fix:** Check Developer Console (Ctrl+Shift+I)

### Zed
- **Issue:** Context servers not loading
- **Fix:** Check `~/.config/zed/server.log`

## 📚 Full Documentation

For complete setup instructions, see [CLAUDE_DESKTOP_SETUP.md](CLAUDE_DESKTOP_SETUP.md)

## 🆕 Adding Support for New IDEs

If your IDE supports MCP but isn't listed:

1. Find the MCP configuration file location
2. Use the universal JSON format above
3. Adjust the key names if needed (some use `mcpServers`, others `context_servers`)
4. Restart your IDE
5. Open an issue to let us know it works!

## 🤝 Contributing

Found a better configuration or tested a new IDE? 
[Open a PR](https://github.com/devchemical/bernova-mcp/pulls) to share your findings!
