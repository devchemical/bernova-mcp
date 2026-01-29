# Bernova MCP Server - Examples

## Example 1: Complete Setup from Scratch

### Step 1: Create Configuration

```json
Tool: create_config
Input: {
  "themeName": "my-design-system"
}
```

### Step 2: Add Color Variables

```json
Tool: add_css_variable
Input: {
  "category": "colors",
  "name": "primary",
  "value": "#3b82f6"
}

Tool: add_css_variable
Input: {
  "category": "colors",
  "name": "secondary",
  "value": "#8b5cf6"
}

Tool: add_css_variable
Input: {
  "category": "colors",
  "name": "text",
  "value": "#1f2937"
}
```

### Step 3: Add Spacing Variables

```json
Tool: add_css_variable
Input: {
  "category": "spacing",
  "name": "xs",
  "value": "4px"
}

Tool: add_css_variable
Input: {
  "category": "spacing",
  "name": "sm",
  "value": "8px"
}

Tool: add_css_variable
Input: {
  "category": "spacing",
  "name": "md",
  "value": "16px"
}

Tool: add_css_variable
Input: {
  "category": "spacing",
  "name": "lg",
  "value": "24px"
}
```

### Step 4: Create Button Component

```json
Tool: create_component
Input: {
  "componentName": "BUTTON",
  "styles": {
    "padding": "var(--spacing-md)",
    "border": "none",
    "border_radius": "8px",
    "font_size": "16px",
    "font_weight": "600",
    "cursor": "pointer",
    "transition": "all 0.2s ease",
    "_icon": {
      "width": "20px",
      "height": "20px",
      "margin_right": "var(--spacing-sm)"
    },
    "_text": {
      "color": "inherit"
    },
    "PRIMARY": {
      "background_color": "var(--colors-primary)",
      "color": "white"
    },
    "SECONDARY": {
      "background_color": "var(--colors-secondary)",
      "color": "white"
    },
    "$pseudoClasses": {
      "hover": {
        "transform": "translateY(-2px)",
        "box_shadow": "0 4px 12px rgba(0,0,0,0.15)"
      },
      "active": {
        "transform": "translateY(0)",
        "box_shadow": "0 2px 4px rgba(0,0,0,0.1)"
      },
      "disabled": {
        "opacity": "0.5",
        "cursor": "not-allowed"
      }
    }
  }
}
```

### Step 5: Add Responsive Breakpoints

```json
Tool: add_media_query
Input: {
  "name": "mobile",
  "type": "screen",
  "values": {
    "max-width": "767px"
  }
}

Tool: add_media_query
Input: {
  "name": "tablet",
  "type": "screen",
  "values": {
    "min-width": "768px",
    "max-width": "1023px"
  }
}

Tool: add_media_query
Input: {
  "name": "desktop",
  "type": "screen",
  "values": {
    "min-width": "1024px"
  }
}
```

### Step 6: Make Button Responsive

```json
Tool: update_component
Input: {
  "componentName": "BUTTON",
  "styles": {
    "padding": "16px 32px",
    "font_size": "16px",
    "$mediaQueries": {
      "mobile": {
        "padding": "12px 24px",
        "font_size": "14px"
      },
      "tablet": {
        "padding": "14px 28px",
        "font_size": "15px"
      }
    }
  }
}
```

### Step 7: Compile

```json
Tool: compile_styles
Input: {
  "mode": "full"
}
```

---

## Example 2: Card Component with Complex Structure

```json
Tool: create_component
Input: {
  "componentName": "CARD",
  "styles": {
    "background_color": "white",
    "border_radius": "12px",
    "box_shadow": "0 2px 8px rgba(0,0,0,0.1)",
    "overflow": "hidden",
    "transition": "all 0.3s ease",
    "_header": {
      "padding": "var(--spacing-lg)",
      "border_bottom": "1px solid #e5e7eb",
      "_title": {
        "font_size": "20px",
        "font_weight": "700",
        "color": "var(--colors-text)",
        "margin": "0"
      },
      "_subtitle": {
        "font_size": "14px",
        "color": "#6b7280",
        "margin_top": "var(--spacing-xs)"
      }
    },
    "_body": {
      "padding": "var(--spacing-lg)"
    },
    "_footer": {
      "padding": "var(--spacing-lg)",
      "border_top": "1px solid #e5e7eb",
      "display": "flex",
      "justify_content": "space-between",
      "align_items": "center"
    },
    "ELEVATED": {
      "box_shadow": "0 10px 25px rgba(0,0,0,0.15)"
    },
    "OUTLINED": {
      "border": "1px solid #e5e7eb",
      "box_shadow": "none"
    },
    "$pseudoClasses": {
      "hover": {
        "box_shadow": "0 4px 12px rgba(0,0,0,0.15)",
        "transform": "translateY(-4px)"
      }
    },
    "$attributes": {
      "data-clickable": {
        "cursor": "pointer"
      }
    }
  }
}
```

---

## Example 3: Input Component with States

```json
Tool: create_component
Input: {
  "componentName": "INPUT",
  "styles": {
    "width": "100%",
    "padding": "12px 16px",
    "border": "1px solid #d1d5db",
    "border_radius": "8px",
    "font_size": "16px",
    "transition": "all 0.2s ease",
    "background_color": "white",
    "_label": {
      "display": "block",
      "margin_bottom": "var(--spacing-sm)",
      "font_size": "14px",
      "font_weight": "600",
      "color": "var(--colors-text)"
    },
    "_error": {
      "display": "none",
      "margin_top": "var(--spacing-xs)",
      "font_size": "12px",
      "color": "#ef4444"
    },
    "_helper": {
      "margin_top": "var(--spacing-xs)",
      "font_size": "12px",
      "color": "#6b7280"
    },
    "$pseudoClasses": {
      "focus": {
        "outline": "none",
        "border_color": "var(--colors-primary)",
        "box_shadow": "0 0 0 3px rgba(59, 130, 246, 0.1)"
      },
      "disabled": {
        "background_color": "#f3f4f6",
        "cursor": "not-allowed",
        "opacity": "0.6"
      }
    },
    "$attributes": {
      "data-error": {
        "border_color": "#ef4444",
        "$advancedSelector": [
          {
            "sibling": {
              "$target": "._error",
              "display": "block"
            }
          }
        ]
      }
    }
  }
}
```

---

## Example 4: Navigation with Media Queries

```json
Tool: create_component
Input: {
  "componentName": "NAVIGATION",
  "styles": {
    "display": "flex",
    "align_items": "center",
    "justify_content": "space-between",
    "padding": "var(--spacing-md) var(--spacing-lg)",
    "background_color": "white",
    "box_shadow": "0 2px 4px rgba(0,0,0,0.1)",
    "_logo": {
      "height": "40px"
    },
    "_menu": {
      "display": "flex",
      "gap": "var(--spacing-lg)",
      "list_style": "none",
      "margin": "0",
      "padding": "0"
    },
    "_menu_item": {
      "color": "var(--colors-text)",
      "text_decoration": "none",
      "font_weight": "500",
      "transition": "color 0.2s ease",
      "$pseudoClasses": {
        "hover": {
          "color": "var(--colors-primary)"
        }
      }
    },
    "_hamburger": {
      "display": "none",
      "flex_direction": "column",
      "gap": "4px",
      "cursor": "pointer",
      "_line": {
        "width": "24px",
        "height": "2px",
        "background_color": "var(--colors-text)",
        "transition": "all 0.3s ease"
      }
    },
    "$mediaQueries": {
      "mobile": {
        "_menu": {
          "position": "fixed",
          "top": "64px",
          "left": "0",
          "right": "0",
          "flex_direction": "column",
          "background_color": "white",
          "padding": "var(--spacing-lg)",
          "box_shadow": "0 4px 6px rgba(0,0,0,0.1)",
          "transform": "translateX(-100%)",
          "transition": "transform 0.3s ease"
        },
        "_hamburger": {
          "display": "flex"
        }
      }
    },
    "$attributes": {
      "data-menu-open": {
        "$mediaQueries": {
          "mobile": {
            "_menu": {
              "transform": "translateX(0)"
            }
          }
        }
      }
    }
  }
}
```

---

## Example 5: Using Dynamic Values

```json
Tool: create_component
Input: {
  "componentName": "PROGRESS_BAR",
  "styles": {
    "$dynamicValues": ["$progress", "$barColor"],
    "width": "100%",
    "height": "8px",
    "background_color": "#e5e7eb",
    "border_radius": "4px",
    "overflow": "hidden",
    "_fill": {
      "height": "100%",
      "background_color": "$barColor",
      "width": "$progress",
      "transition": "width 0.3s ease"
    }
  }
}
```

Usage in React:
```jsx
const styles = provider.getComponentStyles({ component: 'PROGRESS_BAR' });
const dynamicVars = styles.dynamic_values({
  $progress: '75%',
  $barColor: '#3b82f6'
});

<div className={styles.progress_bar} style={dynamicVars.object}>
  <div className={styles.progress_bar_fill} />
</div>
```

---

## Example 6: Complete Workflow

```bash
# 1. Create project
create_config({ themeName: "app" })

# 2. Add design tokens
add_css_variable({ category: "colors", name: "primary", value: "#3b82f6" })
add_css_variable({ category: "spacing", name: "md", value: "16px" })

# 3. Create components
create_component({ componentName: "BUTTON", styles: { ... } })
create_component({ componentName: "CARD", styles: { ... } })
create_component({ componentName: "INPUT", styles: { ... } })

# 4. Add responsive design
add_media_query({ name: "mobile", type: "screen", values: { "max-width": "767px" } })

# 5. Make components responsive
update_component({ componentName: "BUTTON", styles: { $mediaQueries: { ... } } })

# 6. Compile everything
compile_styles({ mode: "full" })

# 7. List what we created
list_components()
list_media_queries()
get_css_variables()
```

---

## Example 7: Validation Before Creation

```json
// First validate
Tool: validate_component_styles
Input: {
  "styles": {
    "background-color": "red",  // This will warn about using hyphens
    "_text": {
      "font_size": "16px"
    }
  }
}

// Response will show warnings
{
  "success": false,
  "data": {
    "valid": false,
    "warnings": [
      "Property 'background-color' should use underscores instead of hyphens"
    ]
  }
}

// Then create with corrected styles
Tool: create_component
Input: {
  "componentName": "MY_COMPONENT",
  "styles": {
    "background_color": "red",  // ✅ Corrected
    "_text": {
      "font_size": "16px"
    }
  }
}
```

---

## Tips for AI Agents

1. **Always validate before creating** - Use `validate_component_styles` first
2. **Use CSS variables** - Create foundations first, then reference them in components
3. **Think mobile-first** - Add media queries early in the process
4. **Follow BEM methodology** - Use `_` for nested elements, UPPERCASE for variants
5. **Compile incrementally** - Use `componentOnly` mode when only changing components
6. **List before updating** - Use `list_components` to see what exists
7. **Check configuration** - Use `get_config` to understand the project structure
