import type { ComponentStyles, ToolResponse } from '../types/bernova.types.js';
import { 
  readModuleFile, 
  writeModuleFile, 
  fileExists, 
  resolveConfigPath 
} from '../utils/file-system.js';
import { 
  validateComponentName, 
  validateComponentStyles 
} from '../utils/validators.js';
import { getConfig } from './config.js';

/**
 * Obtiene los estilos de un componente
 */
export async function getComponentStyle(
  componentName: string,
  themeName?: string
): Promise<ToolResponse> {
  try {
    // Validar nombre del componente
    const nameValidation = validateComponentName(componentName);
    if (!nameValidation.valid) {
      return {
        success: false,
        error: nameValidation.errors?.join(', ')
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

    if (!theme.theme?.path) {
      return {
        success: false,
        error: `Theme "${theme.name}" does not have a theme configuration`
      };
    }

    // Leer archivo de tema
    const themePath = resolveConfigPath(theme.theme.path);
    if (!await fileExists(themePath)) {
      return {
        success: false,
        error: `Theme file not found: ${themePath}`
      };
    }

    const themeContent = await readModuleFile(themePath);

    // Buscar el componente en el contenido
    // Esto es una aproximación simple - en producción podrías usar un parser AST
    const componentRegex = new RegExp(
      `export\\s+const\\s+${componentName}\\s*=\\s*({[\\s\\S]*?});?\\s*(?:export|$)`,
      'i'
    );
    
    const match = themeContent.match(componentRegex);
    
    if (!match) {
      return {
        success: false,
        error: `Component "${componentName}" not found in theme "${theme.name}"`
      };
    }

    return {
      success: true,
      data: {
        componentName,
        themeName: theme.name,
        content: match[0],
        path: themePath
      },
      message: `Component "${componentName}" found in theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error getting component style: ${error}`
    };
  }
}

/**
 * Crea un nuevo componente con estilos
 */
export async function createComponentStyle(
  componentName: string,
  styles: ComponentStyles,
  themeName?: string
): Promise<ToolResponse> {
  try {
    // Validar nombre del componente
    const nameValidation = validateComponentName(componentName);
    if (!nameValidation.valid) {
      return {
        success: false,
        error: nameValidation.errors?.join(', ')
      };
    }

    // Validar estilos
    const stylesValidation = validateComponentStyles(styles);
    if (!stylesValidation.valid) {
      return {
        success: false,
        error: stylesValidation.errors?.join(', ')
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

    if (!theme.theme?.path) {
      return {
        success: false,
        error: `Theme "${theme.name}" does not have a theme configuration`
      };
    }

    // Verificar si el componente ya existe
    const existingComponent = await getComponentStyle(componentName, theme.name);
    if (existingComponent.success) {
      return {
        success: false,
        error: `Component "${componentName}" already exists. Use updateComponentStyle to modify it.`
      };
    }

    // Leer archivo de tema
    const themePath = resolveConfigPath(theme.theme.path);
    let themeContent = '';
    
    if (await fileExists(themePath)) {
      themeContent = await readModuleFile(themePath);
    }

    // Convertir estilos a string
    const stylesString = JSON.stringify(styles, null, 2)
      .replace(/"([^"]+)":/g, '$1:'); // Remover comillas de las claves

    // Crear nuevo componente
    const componentDeclaration = `\nexport const ${componentName} = ${stylesString};\n`;

    // Agregar al archivo
    if (themeContent.trim() === '') {
      // Archivo vacío, crear estructura base
      themeContent = componentDeclaration;
    } else {
      // Agregar al final del archivo
      themeContent += componentDeclaration;
    }

    // Actualizar export principal si existe
    const mainExportRegex = /export\s+const\s+\w+\s*=\s*{([^}]*)};/;
    const mainExportMatch = themeContent.match(mainExportRegex);
    
    if (mainExportMatch) {
      // Agregar componente al export principal
      const exportContent = mainExportMatch[1];
      const newExportContent = exportContent.trim() 
        ? `${exportContent.trim()},\n  ${componentName}`
        : `\n  ${componentName}`;
      
      themeContent = themeContent.replace(
        mainExportRegex,
        `export const ${theme.theme.name} = {${newExportContent}\n};`
      );
    } else {
      // Crear export principal
      themeContent += `\nexport const ${theme.theme.name} = {\n  ${componentName}\n};\n`;
    }

    // Escribir archivo
    await writeModuleFile(themePath, themeContent);

    return {
      success: true,
      data: {
        componentName,
        themeName: theme.name,
        path: themePath,
        styles
      },
      message: `Component "${componentName}" created successfully in theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating component style: ${error}`
    };
  }
}

/**
 * Actualiza los estilos de un componente existente
 */
export async function updateComponentStyle(
  componentName: string,
  styles: ComponentStyles,
  themeName?: string
): Promise<ToolResponse> {
  try {
    // Validar nombre del componente
    const nameValidation = validateComponentName(componentName);
    if (!nameValidation.valid) {
      return {
        success: false,
        error: nameValidation.errors?.join(', ')
      };
    }

    // Validar estilos
    const stylesValidation = validateComponentStyles(styles);
    if (!stylesValidation.valid) {
      return {
        success: false,
        error: stylesValidation.errors?.join(', ')
      };
    }

    // Verificar que el componente existe
    const existingComponent = await getComponentStyle(componentName, themeName);
    if (!existingComponent.success) {
      return {
        success: false,
        error: `Component "${componentName}" not found. Use createComponentStyle to create it.`
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

    if (!theme || !theme.theme?.path) {
      return {
        success: false,
        error: 'Theme configuration not found'
      };
    }

    // Leer archivo de tema
    const themePath = resolveConfigPath(theme.theme.path);
    let themeContent = await readModuleFile(themePath);

    // Convertir estilos a string
    const stylesString = JSON.stringify(styles, null, 2)
      .replace(/"([^"]+)":/g, '$1:'); // Remover comillas de las claves

    // Reemplazar componente
    const componentRegex = new RegExp(
      `(export\\s+const\\s+${componentName}\\s*=\\s*)({[\\s\\S]*?});`,
      'i'
    );

    if (componentRegex.test(themeContent)) {
      themeContent = themeContent.replace(
        componentRegex,
        `$1${stylesString};`
      );
    } else {
      return {
        success: false,
        error: `Could not find component declaration for "${componentName}"`
      };
    }

    // Escribir archivo
    await writeModuleFile(themePath, themeContent);

    return {
      success: true,
      data: {
        componentName,
        themeName: theme.name,
        path: themePath,
        styles
      },
      message: `Component "${componentName}" updated successfully in theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error updating component style: ${error}`
    };
  }
}

/**
 * Elimina un componente
 */
export async function deleteComponentStyle(
  componentName: string,
  themeName?: string
): Promise<ToolResponse> {
  try {
    // Validar nombre del componente
    const nameValidation = validateComponentName(componentName);
    if (!nameValidation.valid) {
      return {
        success: false,
        error: nameValidation.errors?.join(', ')
      };
    }

    // Verificar que el componente existe
    const existingComponent = await getComponentStyle(componentName, themeName);
    if (!existingComponent.success) {
      return {
        success: false,
        error: `Component "${componentName}" not found`
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

    if (!theme || !theme.theme?.path) {
      return {
        success: false,
        error: 'Theme configuration not found'
      };
    }

    // Leer archivo de tema
    const themePath = resolveConfigPath(theme.theme.path);
    let themeContent = await readModuleFile(themePath);

    // Remover declaración del componente
    const componentRegex = new RegExp(
      `export\\s+const\\s+${componentName}\\s*=\\s*{[\\s\\S]*?};?\\s*\n`,
      'gi'
    );

    themeContent = themeContent.replace(componentRegex, '');

    // Remover del export principal
    const exportRemoveRegex = new RegExp(
      `,?\\s*${componentName}\\s*,?`,
      'g'
    );

    themeContent = themeContent.replace(exportRemoveRegex, '');

    // Limpiar comas duplicadas
    themeContent = themeContent.replace(/,\s*,/g, ',');
    themeContent = themeContent.replace(/{\s*,/g, '{');
    themeContent = themeContent.replace(/,\s*}/g, '}');

    // Escribir archivo
    await writeModuleFile(themePath, themeContent);

    return {
      success: true,
      message: `Component "${componentName}" deleted successfully from theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error deleting component style: ${error}`
    };
  }
}

/**
 * Lista todos los componentes disponibles
 */
export async function listComponents(themeName?: string): Promise<ToolResponse> {
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

    if (!theme.theme?.path) {
      return {
        success: false,
        error: `Theme "${theme.name}" does not have a theme configuration`
      };
    }

    // Leer archivo de tema
    const themePath = resolveConfigPath(theme.theme.path);
    if (!await fileExists(themePath)) {
      return {
        success: true,
        data: [],
        message: `Theme file not found: ${themePath}. No components defined yet.`
      };
    }

    const themeContent = await readModuleFile(themePath);

    // Extraer nombres de componentes
    const componentRegex = /export\s+const\s+([A-Z_][A-Z0-9_]*)\s*=/gi;
    const components: string[] = [];
    let match;

    while ((match = componentRegex.exec(themeContent)) !== null) {
      const componentName = match[1];
      // Excluir el export principal (usualmente el nombre del tema)
      if (componentName !== theme.theme.name) {
        components.push(componentName);
      }
    }

    return {
      success: true,
      data: components,
      message: `Found ${components.length} component(s) in theme "${theme.name}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error listing components: ${error}`
    };
  }
}
