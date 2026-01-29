# Bernova MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-black.svg)](https://bun.sh)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)

Model Context Protocol (MCP) server for [Bernova](https://github.com/kubit-ui/bernova) - The CSS-in-JS library that allows AI agents to interact with and manage Bernova styles programmatically.

> **⚡ Now optimized for Bun!** 3x faster installation, 10x faster startup. See [BUN_GUIDE.md](BUN_GUIDE.md) for details.

## Features

- **Configuration Management**: Create, read, and update Bernova configurations
- **Style Compilation**: Compile styles with different modes (full, foundation-only, component-only)
- **Component Management**: Create, read, update, and delete styled components
- **CSS Variables**: Add and update CSS custom properties (foundations)
- **Media Queries**: Manage responsive breakpoints
- **Validation**: Validate styles before compilation
- **TypeScript Support**: Full type safety and autocomplete

## Installation

### Using Bun (Recommended)

```bash
bun add bernova-mcp
```

Or install globally:

```bash
bun add -g bernova-mcp
```

### Using npm

```bash
npm install bernova-mcp
```

## Quick Start

### 1. Install Bernova in your project

```bash
# Using Bun (recommended)
bun add bernova

# Using npm
npm install bernova
```

### 2. Run the MCP server

```bash
# Using Bun
bunx bernova-mcp

# Using npx
npx bernova-mcp
```

### 3. Configure your MCP client

Add to your MCP client configuration (e.g., Claude Desktop):

**Using Bun (Recommended):**
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

**Using Node:**
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
```

## Available Tools

### Configuration Tools

#### `get_config`
Get the current Bernova configuration from `bernova.config.json`.

```typescript
// No parameters required
```

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": { ... },
    "themes": [ ... ]
  },
  "message": "Configuration loaded successfully"
}
```

#### `create_config`
Create a new Bernova configuration file with default values.

```typescript
{
  themeName?: string  // Default: "default"
}
```

**Example:**
```json
{
  "themeName": "dark-theme"
}
```

#### `update_config`
Update Bernova configuration (merge or replace).

```typescript
{
  config: BernovaConfig,  // Partial or complete config
  merge?: boolean         // Default: true
}
```

**Example:**
```json
{
  "config": {
    "themes": [
      {
        "name": "dark",
        "stylesPath": "./src/styles/dark"
      }
    ]
  },
  "merge": true
}
```

#### `list_themes`
List all available themes.

```typescript
// No parameters required
```

**Response:**
```json
{
  "success": true,
  "data": ["default", "dark", "light"],
  "message": "Found 3 theme(s)"
}
```

---

### Compilation Tools

#### `compile_styles`
Compile Bernova styles with different modes.

```typescript
{
  mode?: "full" | "foundationOnly" | "componentOnly"  // Default: "full"
}
```

**Example:**
```json
{
  "mode": "full"
}
```

**Modes:**
- `full`: Compile foundations + components
- `foundationOnly`: Compile only CSS variables and base styles
- `componentOnly`: Compile only component classes

#### `build_styles`
Advanced build with custom options.

```typescript
{
  baseOutDir?: string,
  minifyJs?: boolean,
  embedCss?: boolean,
  types?: ("cjs" | "esm")[]
}
```

**Example:**
```json
{
  "baseOutDir": "./dist",
  "minifyJs": true,
  "embedCss": true,
  "types": ["cjs", "esm"]
}
```

---

### Component Tools

#### `create_component`
Create a new component with styles.

```typescript
{
  componentName: string,
  styles: ComponentStyles,
  themeName?: string
}
```

**Example:**
```json
{
  "componentName": "BUTTON",
  "styles": {
    "background_color": "blue",
    "color": "white",
    "padding": "10px 20px",
    "border_radius": "4px",
    "_icon": {
      "width": "16px",
      "height": "16px"
    },
    "PRIMARY": {
      "background_color": "darkblue"
    },
    "$pseudoClasses": {
      "hover": {
        "background_color": "lightblue"
      }
    }
  }
}
```

#### `get_component`
Get the styles of an existing component.

```typescript
{
  componentName: string,
  themeName?: string
}
```

**Example:**
```json
{
  "componentName": "BUTTON",
  "themeName": "default"
}
```

#### `update_component`
Update the styles of an existing component.

```typescript
{
  componentName: string,
  styles: ComponentStyles,
  themeName?: string
}
```

#### `delete_component`
Delete a component.

```typescript
{
  componentName: string,
  themeName?: string
}
```

#### `list_components`
List all available components in a theme.

```typescript
{
  themeName?: string
}
```

**Response:**
```json
{
  "success": true,
  "data": ["BUTTON", "CARD", "INPUT"],
  "message": "Found 3 component(s) in theme 'default'"
}
```

---

### CSS Variables Tools

#### `add_css_variable`
Add a CSS variable to foundations.

```typescript
{
  category: string,
  name: string,
  value: string | number,
  themeName?: string
}
```

**Example:**
```json
{
  "category": "colors",
  "name": "primary",
  "value": "#0066cc"
}
```

This will generate: `--colors-primary: #0066cc`

#### `update_css_variable`
Update an existing CSS variable.

```typescript
{
  category: string,
  name: string,
  value: string | number,
  themeName?: string
}
```

#### `get_css_variables`
Get all CSS variables from a theme.

```typescript
{
  themeName?: string
}
```

---

### Media Query Tools

#### `add_media_query`
Add a media query configuration.

```typescript
{
  name: string,
  type: string,
  values: Record<string, string>,
  themeName?: string
}
```

**Example:**
```json
{
  "name": "tablet",
  "type": "screen",
  "values": {
    "min-width": "768px",
    "max-width": "1024px"
  }
}
```

#### `list_media_queries`
List all media queries in a theme.

```typescript
{
  themeName?: string
}
```

---

### Validation Tools

#### `validate_component_styles`
Validate component styles syntax before creating/updating.

```typescript
{
  styles: ComponentStyles
}
```

**Example:**
```json
{
  "styles": {
    "background_color": "red",
    "_text": {
      "font-size": "16px"
    }
  }
}
```

**Response:**
```json
{
  "success": false,
  "data": {
    "valid": false,
    "errors": [],
    "warnings": [
      "Property 'font-size' should use underscores instead of hyphens"
    ]
  }
}
```

---

## Usage Examples

### Example 1: Create a Design System from Scratch

```
AI Agent: "Create a new Bernova project with a button component"

1. create_config({ themeName: "myapp" })
2. add_css_variable({ 
     category: "colors", 
     name: "primary", 
     value: "#007bff" 
   })
3. add_css_variable({ 
     category: "spacing", 
     name: "md", 
     value: "16px" 
   })
4. create_component({
     componentName: "BUTTON",
     styles: {
       background_color: "var(--colors-primary)",
       padding: "var(--spacing-md)",
       border: "none",
       border_radius: "4px"
     }
   })
5. compile_styles({ mode: "full" })
```

### Example 2: Add Responsive Design

```
AI Agent: "Add responsive breakpoints and make the button adapt to mobile"

1. add_media_query({
     name: "mobile",
     type: "screen",
     values: {
       "max-width": "767px"
     }
   })
2. update_component({
     componentName: "BUTTON",
     styles: {
       padding: "16px",
       $mediaQueries: {
         mobile: {
           padding: "12px",
           font_size: "14px"
         }
       }
     }
   })
3. compile_styles({ mode: "componentOnly" })
```

### Example 3: Create Component Variants

```
AI Agent: "Create primary and secondary button variants"

update_component({
  componentName: "BUTTON",
  styles: {
    padding: "10px 20px",
    border_radius: "4px",
    PRIMARY: {
      background_color: "#007bff",
      color: "white"
    },
    SECONDARY: {
      background_color: "#6c757d",
      color: "white"
    },
    $pseudoClasses: {
      hover: {
        opacity: "0.9"
      }
    }
  }
})
```

---

## Project Structure

```
bernova-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── tools/
│   │   ├── config.ts         # Configuration tools
│   │   ├── compile.ts        # Compilation tools
│   │   ├── components.ts     # Component management
│   │   └── variables.ts      # Variables & media queries
│   ├── types/
│   │   └── bernova.types.ts  # TypeScript types
│   └── utils/
│       ├── file-system.ts    # File system utilities
│       └── validators.ts     # Validation utilities
├── package.json
├── tsconfig.json
└── README.md
```

---

## Bernova Style Syntax Reference

### Basic Properties

Use underscores instead of hyphens:

```javascript
{
  background_color: "red",    // ✅ Correct
  font_size: "16px",          // ✅ Correct
  // background-color: "red"  // ❌ Wrong
}
```

### Nested Elements

Use underscore prefix for nested elements (BEM):

```javascript
{
  BUTTON: {
    padding: "10px",
    _icon: {              // Creates .button__icon
      width: "16px"
    },
    _text: {              // Creates .button__text
      font_size: "14px"
    }
  }
}
```

### Variants

Use UPPERCASE keys for variants (BEM modifiers):

```javascript
{
  BUTTON: {
    padding: "10px",
    PRIMARY: {            // Creates .button--primary
      background: "blue"
    },
    SECONDARY: {          // Creates .button--secondary
      background: "gray"
    }
  }
}
```

### Pseudo Classes

Use `$pseudoClasses` for `:hover`, `:focus`, etc:

```javascript
{
  $pseudoClasses: {
    hover: {
      background_color: "darkblue"
    },
    focus: {
      outline: "2px solid blue"
    }
  }
}
```

### Pseudo Elements

Use `$pseudoElements` for `::before`, `::after`:

```javascript
{
  $pseudoElements: {
    before: {
      $content: '""',
      display: "block"
    }
  }
}
```

### Media Queries

Use `$mediaQueries` with configured breakpoints:

```javascript
{
  width: "100%",
  $mediaQueries: {
    mobile: {
      width: "90%"
    },
    tablet: {
      width: "80%"
    }
  }
}
```

### Attributes

Use `$attributes` for attribute selectors:

```javascript
{
  $attributes: {
    "data-active": {
      background_color: "green"
    }
  }
}
```

### Advanced Selectors

Use `$advancedSelector` for descendant, child, sibling selectors:

```javascript
{
  $advancedSelector: [
    {
      descendant: {
        $target: "span",
        color: "red"
      }
    },
    {
      child: {
        $target: "p",
        font_size: "14px"
      }
    }
  ]
}
```

### Dynamic Values

Use `$dynamicValues` for runtime CSS variables:

```javascript
{
  $dynamicValues: ["$bgColor", "$textColor"],
  background_color: "$bgColor",
  color: "$textColor"
}
```

---

## TypeScript Types

The server provides full TypeScript support:

```typescript
import type { 
  BernovaConfig, 
  ComponentStyles,
  CSSProperties 
} from 'bernova-mcp-server';
```

---

## Error Handling

All tools return a consistent response format:

```typescript
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Component 'BUTTON' not found"
}
```

---

## Development

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run dev
```

### Run locally

```bash
npm start
```

---

## Requirements

- Node.js >= 20.0.0
- Bernova >= 1.3.2
- A Bernova project with `bernova.config.json`

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT

---

## Related Projects

- [Bernova](https://github.com/kubit-ui/bernova) - The CSS-in-JS library
- [MCP SDK](https://github.com/modelcontextprotocol/sdk) - Model Context Protocol SDK

---

## Support

For issues and questions:
- Bernova Issues: https://github.com/kubit-ui/bernova/issues
- MCP Server Issues: Create an issue in this repository

---

## Changelog

### Version 1.0.0

- Initial release
- 15+ MCP tools for Bernova interaction
- Full TypeScript support
- Validation utilities
- Configuration management
- Component CRUD operations
- CSS variables management
- Media queries support
- Style compilation tools
