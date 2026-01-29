import type { ToolResponse } from '../types/bernova.types.js';
import {
  readModuleFile,
  writeModuleFile,
  fileExists,
  resolveConfigPath
} from '../utils/file-system.js';
import {
  validateCSSVariable,
  validateMediaQuery
} from '../utils/validators.js';
import { getConfig } from './config.js';

/**
 * Agrega una variable CSS al foundation
 */
export async function addCSSVariable(
  category: string,
  name: string,
  value: string | number,
  themeName?: string
): Promise<ToolResponse> {
  try {
    // Validar variable
    const validation = validateCSSVariable(category, name, value);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors?.join(', ')
      };
    }

    // Obtener configuración
    const configResult = await getConfig();
    if (!configResult.success || !configResult.data) {
      return configResult;
    }

    // Determinar tema
    const theme = themeName
      ? configResult.data.themes.find(t => t.name === themeName)
      : configResult.data.themes[0];

    if (!theme) {
      return {
        success: false,
        error: themeName
          ? `Theme "${themeName}" not found`
          : 'No themes configured'
      };
    }

    if (!theme.foundations?.path) {
      return {
        success: false,
        error: `Theme "${theme.name}" does not have foundations configured`
      };
    }

    // Leer archivo de foundations
    const foundationsPath = resolveConfigPath(theme.foundations.path);
    let foundationsContent = '';

    if (await fileExists(foundationsPath)) {
      foundationsContent = await readModuleFile(foundationsPath);
    }

    // Si el archivo está vacío, crear estructura base
    if (foundationsContent.trim() === '') {
      foundationsContent = `export const ${theme.foundations.name} = {\n  ${category}: {\n    ${name}: ${JSON.stringify(value)}\n  }\n};\n`;
    } else {
      // Buscar si la categoría existe
      const categoryRegex = new RegExp(`${category}\\s*:\\s*{([^}]*)}`, 's');
      const categoryMatch = foundationsContent.match(categoryRegex);

      if (categoryMatch) {
        // Agregar a categoría existente
        const categoryContent = categoryMatch[1];
        const newVariable = `${name}: ${JSON.stringify(value)}`;
        
        // Verificar si la variable ya existe
        const variableRegex = new RegExp(`${name}\\s*:`);
        if (variableRegex.test(categoryContent)) {
          return {
            success: false,
            error: `Variable "${category}.${name}" already exists. Use updateCSSVariable to modify it.`
          };
        }

        const updatedCategoryContent = categoryContent.trim()
          ? `${categoryContent.trim()},\n    ${newVariable}`
          : `\n    ${newVariable}`;

        foundationsContent = foundationsContent.replace(
          categoryRegex,
          `${category}: {${updatedCategoryContent}\n  }`
        );
      } else {
        // Crear nueva categoría
        const foundationsObjectRegex = new RegExp(
          `(export\\s+const\\s+${theme.foundations.name}\\s*=\\s*{)([^}]*)(};?)`,
          's'
        );
        
        const match = foundationsContent.match(foundationsObjectRegex);
        if (match) {
          const existingContent = match[2];
          const newCategory = `${category}: {\n    ${name}: ${JSON.stringify(value)}\n  }`;
          
          const updatedContent = existingContent.trim()
            ? `${existingContent.trim()},\n  ${newCategory}`
            : `\n  ${newCategory}`;

          foundationsContent = foundationsContent.replace(
            foundationsObjectRegex,
            `$1${updatedContent}\n};`
          );
        } else {
          // Crear estructura completa
          foundationsContent = `export const ${theme.foundations.name} = {\n  ${category}: {\n    ${name}: ${JSON.stringify(value)}\n  }\n};\n`;
        }
      }
    }

    // Escribir archivo
    await writeModuleFile(foundationsPath, foundationsContent);

    return {
      success: true,
      data: {
        category,
        name,
        value,
        themeName: theme.name,
        path: foundationsPath,
        cssVariable: `--${category}-${name}`
      },
      message: `CSS variable "${category}.${name}" added successfully to theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error adding CSS variable: ${error}`
    };
  }
}

/**
 * Actualiza una variable CSS existente
 */
export async function updateCSSVariable(
  category: string,
  name: string,
  value: string | number,
  themeName?: string
): Promise<ToolResponse> {
  try {
    // Validar variable
    const validation = validateCSSVariable(category, name, value);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors?.join(', ')
      };
    }

    // Obtener configuración
    const configResult = await getConfig();
    if (!configResult.success || !configResult.data) {
      return configResult;
    }

    // Determinar tema
    const theme = themeName
      ? configResult.data.themes.find(t => t.name === themeName)
      : configResult.data.themes[0];

    if (!theme || !theme.foundations?.path) {
      return {
        success: false,
        error: 'Foundations configuration not found'
      };
    }

    // Leer archivo de foundations
    const foundationsPath = resolveConfigPath(theme.foundations.path);
    if (!await fileExists(foundationsPath)) {
      return {
        success: false,
        error: `Foundations file not found: ${foundationsPath}`
      };
    }

    let foundationsContent = await readModuleFile(foundationsPath);

    // Buscar y reemplazar la variable
    const variableRegex = new RegExp(
      `(${category}\\s*:\\s*{[^}]*${name}\\s*:\\s*)([^,\n}]+)`,
      's'
    );

    if (!variableRegex.test(foundationsContent)) {
      return {
        success: false,
        error: `Variable "${category}.${name}" not found. Use addCSSVariable to create it.`
      };
    }

    foundationsContent = foundationsContent.replace(
      variableRegex,
      `$1${JSON.stringify(value)}`
    );

    // Escribir archivo
    await writeModuleFile(foundationsPath, foundationsContent);

    return {
      success: true,
      data: {
        category,
        name,
        value,
        themeName: theme.name,
        path: foundationsPath,
        cssVariable: `--${category}-${name}`
      },
      message: `CSS variable "${category}.${name}" updated successfully in theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error updating CSS variable: ${error}`
    };
  }
}

/**
 * Obtiene todas las variables CSS de un tema
 */
export async function getCSSVariables(themeName?: string): Promise<ToolResponse> {
  try {
    // Obtener configuración
    const configResult = await getConfig();
    if (!configResult.success || !configResult.data) {
      return configResult;
    }

    // Determinar tema
    const theme = themeName
      ? configResult.data.themes.find(t => t.name === themeName)
      : configResult.data.themes[0];

    if (!theme) {
      return {
        success: false,
        error: themeName
          ? `Theme "${themeName}" not found`
          : 'No themes configured'
      };
    }

    if (!theme.foundations?.path) {
      return {
        success: false,
        error: `Theme "${theme.name}" does not have foundations configured`
      };
    }

    // Leer archivo de foundations
    const foundationsPath = resolveConfigPath(theme.foundations.path);
    if (!await fileExists(foundationsPath)) {
      return {
        success: true,
        data: {},
        message: `Foundations file not found. No variables defined yet.`
      };
    }

    const foundationsContent = await readModuleFile(foundationsPath);

    // Extraer el objeto de foundations (esto es una aproximación simple)
    const foundationsRegex = new RegExp(
      `export\\s+const\\s+${theme.foundations.name}\\s*=\\s*({[\\s\\S]*?});`,
      'i'
    );

    const match = foundationsContent.match(foundationsRegex);
    if (!match) {
      return {
        success: true,
        data: {},
        message: 'No variables found'
      };
    }

    return {
      success: true,
      data: {
        themeName: theme.name,
        path: foundationsPath,
        content: match[0]
      },
      message: `Foundations loaded from theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error getting CSS variables: ${error}`
    };
  }
}

/**
 * Agrega una media query
 */
export async function addMediaQuery(
  name: string,
  type: string,
  values: Record<string, string>,
  themeName?: string
): Promise<ToolResponse> {
  try {
    // Validar media query
    const validation = validateMediaQuery(name, type, values);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors?.join(', ')
      };
    }

    // Obtener configuración
    const configResult = await getConfig();
    if (!configResult.success || !configResult.data) {
      return configResult;
    }

    // Determinar tema
    const theme = themeName
      ? configResult.data.themes.find(t => t.name === themeName)
      : configResult.data.themes[0];

    if (!theme) {
      return {
        success: false,
        error: themeName
          ? `Theme "${themeName}" not found`
          : 'No themes configured'
      };
    }

    if (!theme.mediaQueries?.path) {
      return {
        success: false,
        error: `Theme "${theme.name}" does not have mediaQueries configured`
      };
    }

    // Leer archivo de mediaQueries
    const mediaQueriesPath = resolveConfigPath(theme.mediaQueries.path);
    let mediaQueriesContent = '';

    if (await fileExists(mediaQueriesPath)) {
      mediaQueriesContent = await readModuleFile(mediaQueriesPath);
    }

    // Crear objeto de media query
    const mediaQueryObject = {
      name,
      type,
      values
    };

    // Si el archivo está vacío, crear estructura base
    if (mediaQueriesContent.trim() === '') {
      mediaQueriesContent = `export const ${theme.mediaQueries.name} = [\n  ${JSON.stringify(mediaQueryObject, null, 2).replace(/\n/g, '\n  ')}\n];\n`;
    } else {
      // Verificar si ya existe una media query con ese nombre
      if (mediaQueriesContent.includes(`name: '${name}'`) || mediaQueriesContent.includes(`name: "${name}"`)) {
        return {
          success: false,
          error: `Media query "${name}" already exists`
        };
      }

      // Agregar al array existente
      const arrayRegex = new RegExp(
        `(export\\s+const\\s+${theme.mediaQueries.name}\\s*=\\s*\\[)([\\s\\S]*?)(\\];?)`,
        's'
      );

      const match = mediaQueriesContent.match(arrayRegex);
      if (match) {
        const existingContent = match[2];
        const newQuery = JSON.stringify(mediaQueryObject, null, 2).replace(/\n/g, '\n  ');
        
        const updatedContent = existingContent.trim()
          ? `${existingContent.trim()},\n  ${newQuery}`
          : `\n  ${newQuery}`;

        mediaQueriesContent = mediaQueriesContent.replace(
          arrayRegex,
          `$1${updatedContent}\n];`
        );
      } else {
        // Crear estructura completa
        mediaQueriesContent = `export const ${theme.mediaQueries.name} = [\n  ${JSON.stringify(mediaQueryObject, null, 2).replace(/\n/g, '\n  ')}\n];\n`;
      }
    }

    // Escribir archivo
    await writeModuleFile(mediaQueriesPath, mediaQueriesContent);

    return {
      success: true,
      data: {
        name,
        type,
        values,
        themeName: theme.name,
        path: mediaQueriesPath
      },
      message: `Media query "${name}" added successfully to theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error adding media query: ${error}`
    };
  }
}

/**
 * Lista todas las media queries de un tema
 */
export async function listMediaQueries(themeName?: string): Promise<ToolResponse> {
  try {
    // Obtener configuración
    const configResult = await getConfig();
    if (!configResult.success || !configResult.data) {
      return configResult;
    }

    // Determinar tema
    const theme = themeName
      ? configResult.data.themes.find(t => t.name === themeName)
      : configResult.data.themes[0];

    if (!theme) {
      return {
        success: false,
        error: themeName
          ? `Theme "${themeName}" not found`
          : 'No themes configured'
      };
    }

    if (!theme.mediaQueries?.path) {
      return {
        success: false,
        error: `Theme "${theme.name}" does not have mediaQueries configured`
      };
    }

    // Leer archivo de mediaQueries
    const mediaQueriesPath = resolveConfigPath(theme.mediaQueries.path);
    if (!await fileExists(mediaQueriesPath)) {
      return {
        success: true,
        data: [],
        message: `Media queries file not found. No media queries defined yet.`
      };
    }

    const mediaQueriesContent = await readModuleFile(mediaQueriesPath);

    // Extraer nombres de media queries
    const nameRegex = /name:\s*['"]([^'"]+)['"]/g;
    const names: string[] = [];
    let match;

    while ((match = nameRegex.exec(mediaQueriesContent)) !== null) {
      names.push(match[1]);
    }

    return {
      success: true,
      data: names,
      message: `Found ${names.length} media query(ies) in theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error listing media queries: ${error}`
    };
  }
}
