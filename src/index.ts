#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Importar herramientas
import * as configTools from './tools/config.js';
import * as compileTools from './tools/compile.js';
import * as componentTools from './tools/components.js';
import * as variableTools from './tools/variables.js';

/**
 * Servidor MCP para Bernova
 */
class BernovaMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'bernova-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // Handler para listar herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Herramientas de configuración
        {
          name: 'get_config',
          description: 'Get the current Bernova configuration from bernova.config.json',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'create_config',
          description: 'Create a new Bernova configuration file with default values',
          inputSchema: {
            type: 'object',
            properties: {
              themeName: {
                type: 'string',
                description: 'Name of the default theme (default: "default")',
              },
            },
          },
        },
        {
          name: 'update_config',
          description: 'Update Bernova configuration (merge or replace)',
          inputSchema: {
            type: 'object',
            properties: {
              config: {
                type: 'object',
                description: 'Configuration object (partial or complete)',
              },
              merge: {
                type: 'boolean',
                description: 'Whether to merge with existing config (default: true)',
              },
            },
            required: ['config'],
          },
        },
        {
          name: 'list_themes',
          description: 'List all available themes',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },

        // Herramientas de compilación
        {
          name: 'compile_styles',
          description: 'Compile Bernova styles (full, foundationOnly, or componentOnly)',
          inputSchema: {
            type: 'object',
            properties: {
              mode: {
                type: 'string',
                enum: ['full', 'foundationOnly', 'componentOnly'],
                description: 'Compilation mode (default: "full")',
              },
            },
          },
        },
        {
          name: 'build_styles',
          description: 'Advanced build with custom options',
          inputSchema: {
            type: 'object',
            properties: {
              baseOutDir: {
                type: 'string',
                description: 'Base output directory',
              },
              minifyJs: {
                type: 'boolean',
                description: 'Minify JavaScript output',
              },
              embedCss: {
                type: 'boolean',
                description: 'Embed CSS in JavaScript',
              },
              types: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['cjs', 'esm'],
                },
                description: 'Module types to generate',
              },
            },
          },
        },

        // Herramientas de componentes
        {
          name: 'create_component',
          description: 'Create a new component with styles',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: 'Name of the component (e.g., BUTTON, CARD)',
              },
              styles: {
                type: 'object',
                description: 'Component styles object',
              },
              themeName: {
                type: 'string',
                description: 'Theme name (optional, uses first theme if not specified)',
              },
            },
            required: ['componentName', 'styles'],
          },
        },
        {
          name: 'get_component',
          description: 'Get the styles of an existing component',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: 'Name of the component',
              },
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
            required: ['componentName'],
          },
        },
        {
          name: 'update_component',
          description: 'Update the styles of an existing component',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: 'Name of the component',
              },
              styles: {
                type: 'object',
                description: 'New component styles',
              },
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
            required: ['componentName', 'styles'],
          },
        },
        {
          name: 'delete_component',
          description: 'Delete a component',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: 'Name of the component',
              },
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
            required: ['componentName'],
          },
        },
        {
          name: 'list_components',
          description: 'List all available components in a theme',
          inputSchema: {
            type: 'object',
            properties: {
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
          },
        },

        // Herramientas de variables
        {
          name: 'add_css_variable',
          description: 'Add a CSS variable to foundations',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Variable category (e.g., colors, sizes)',
              },
              name: {
                type: 'string',
                description: 'Variable name',
              },
              value: {
                description: 'Variable value (string or number)',
              },
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
            required: ['category', 'name', 'value'],
          },
        },
        {
          name: 'update_css_variable',
          description: 'Update an existing CSS variable',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Variable category',
              },
              name: {
                type: 'string',
                description: 'Variable name',
              },
              value: {
                description: 'New variable value',
              },
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
            required: ['category', 'name', 'value'],
          },
        },
        {
          name: 'get_css_variables',
          description: 'Get all CSS variables from a theme',
          inputSchema: {
            type: 'object',
            properties: {
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
          },
        },

        // Herramientas de media queries
        {
          name: 'add_media_query',
          description: 'Add a media query configuration',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Media query name (e.g., mobile, tablet)',
              },
              type: {
                type: 'string',
                description: 'Media query type (e.g., screen, print)',
              },
              values: {
                type: 'object',
                description: 'Media query values (e.g., {min-width: "768px", max-width: "1024px"})',
              },
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
            required: ['name', 'type', 'values'],
          },
        },
        {
          name: 'list_media_queries',
          description: 'List all media queries in a theme',
          inputSchema: {
            type: 'object',
            properties: {
              themeName: {
                type: 'string',
                description: 'Theme name (optional)',
              },
            },
          },
        },

        // Herramientas de validación
        {
          name: 'validate_component_styles',
          description: 'Validate component styles syntax before creating/updating',
          inputSchema: {
            type: 'object',
            properties: {
              styles: {
                type: 'object',
                description: 'Styles object to validate',
              },
            },
            required: ['styles'],
          },
        },
      ],
    }));

    // Handler para ejecutar herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;

        switch (name) {
          // Configuración
          case 'get_config':
            result = await configTools.getConfig();
            break;
          case 'create_config':
            result = await configTools.createConfig(args?.themeName as string);
            break;
          case 'update_config':
            result = await configTools.updateConfig(args?.config as any, args?.merge as boolean);
            break;
          case 'list_themes':
            result = await configTools.listThemes();
            break;

          // Compilación
          case 'compile_styles':
            result = await compileTools.compileStyles((args?.mode as any) || 'full');
            break;
          case 'build_styles':
            result = await compileTools.buildStyles((args as any) || {});
            break;

          // Componentes
          case 'create_component':
            result = await componentTools.createComponentStyle(
              args?.componentName as string,
              args?.styles as any,
              args?.themeName as string
            );
            break;
          case 'get_component':
            result = await componentTools.getComponentStyle(
              args?.componentName as string,
              args?.themeName as string
            );
            break;
          case 'update_component':
            result = await componentTools.updateComponentStyle(
              args?.componentName as string,
              args?.styles as any,
              args?.themeName as string
            );
            break;
          case 'delete_component':
            result = await componentTools.deleteComponentStyle(
              args?.componentName as string,
              args?.themeName as string
            );
            break;
          case 'list_components':
            result = await componentTools.listComponents(args?.themeName as string);
            break;

          // Variables
          case 'add_css_variable':
            result = await variableTools.addCSSVariable(
              args?.category as string,
              args?.name as string,
              args?.value as any,
              args?.themeName as string
            );
            break;
          case 'update_css_variable':
            result = await variableTools.updateCSSVariable(
              args?.category as string,
              args?.name as string,
              args?.value as any,
              args?.themeName as string
            );
            break;
          case 'get_css_variables':
            result = await variableTools.getCSSVariables(args?.themeName as string);
            break;

          // Media Queries
          case 'add_media_query':
            result = await variableTools.addMediaQuery(
              args?.name as string,
              args?.type as string,
              args?.values as any,
              args?.themeName as string
            );
            break;
          case 'list_media_queries':
            result = await variableTools.listMediaQueries(args?.themeName as string);
            break;

          // Validación
          case 'validate_component_styles':
            const { validateComponentStyles } = await import('./utils/validators.js');
            const validation = validateComponentStyles(args?.styles);
            result = {
              success: validation.valid,
              data: validation,
              message: validation.valid
                ? 'Styles are valid'
                : 'Styles validation failed',
            };
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message || String(error),
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Bernova MCP Server running on stdio');
  }
}

// Iniciar servidor
const server = new BernovaMCPServer();
server.run().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
