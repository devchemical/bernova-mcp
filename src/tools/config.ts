import type { BernovaConfig, ToolResponse } from '../types/bernova.types.js';
import { 
  readJsonFile, 
  writeJsonFile, 
  getBernovaConfigPath, 
  fileExists 
} from '../utils/file-system.js';
import { validateBernovaConfig } from '../utils/validators.js';

/**
 * Lee la configuración actual de Bernova
 */
export async function getConfig(): Promise<ToolResponse<BernovaConfig>> {
  try {
    const configPath = getBernovaConfigPath();
    
    if (!await fileExists(configPath)) {
      return {
        success: false,
        error: 'bernova.config.json not found in the current directory'
      };
    }

    const config = await readJsonFile<BernovaConfig>(configPath);
    
    return {
      success: true,
      data: config,
      message: 'Configuration loaded successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: `Error reading configuration: ${error}`
    };
  }
}

/**
 * Actualiza la configuración de Bernova (completa o parcial)
 */
export async function updateConfig(
  newConfig: Partial<BernovaConfig> | BernovaConfig,
  merge: boolean = true
): Promise<ToolResponse<BernovaConfig>> {
  try {
    const configPath = getBernovaConfigPath();
    
    let finalConfig: BernovaConfig;

    if (merge && await fileExists(configPath)) {
      // Mezclar con configuración existente
      const existingConfig = await readJsonFile<BernovaConfig>(configPath);
      finalConfig = {
        ...existingConfig,
        ...newConfig,
        themes: newConfig.themes || existingConfig.themes
      };
    } else {
      // Reemplazar completamente
      finalConfig = newConfig as BernovaConfig;
    }

    // Validar configuración
    const validation = validateBernovaConfig(finalConfig);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid configuration: ${validation.errors?.join(', ')}`
      };
    }

    // Escribir configuración
    await writeJsonFile(configPath, finalConfig);

    return {
      success: true,
      data: finalConfig,
      message: 'Configuration updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: `Error updating configuration: ${error}`
    };
  }
}

/**
 * Crea una configuración inicial de Bernova
 */
export async function createConfig(themeName: string = 'default'): Promise<ToolResponse<BernovaConfig>> {
  try {
    const configPath = getBernovaConfigPath();

    if (await fileExists(configPath)) {
      return {
        success: false,
        error: 'bernova.config.json already exists. Use updateConfig to modify it.'
      };
    }

    const defaultConfig: BernovaConfig = {
      provider: {
        name: 'BernovaStyledProvider',
        path: './src/styles/provider',
        declarationHelp: true
      },
      themes: [
        {
          name: themeName,
          minified: false,
          resetCss: true,
          stylesPath: `./src/styles/${themeName}`,
          theme: {
            name: 'BERNOVA_STYLES',
            path: `./src/design/${themeName}/theme.ts`
          },
          foundations: {
            name: 'FOUNDATIONS',
            path: `./src/design/${themeName}/foundations.ts`
          },
          globalStyles: {
            name: 'GLOBAL_STYLES',
            path: `./src/design/${themeName}/globalStyles.ts`
          },
          mediaQueries: {
            name: 'MEDIA_QUERIES',
            path: `./src/design/${themeName}/mediaQueries.ts`
          },
          bvTools: {
            path: `./src/styles/${themeName}/tools`,
            declarationHelp: true,
            cssVariables: true,
            cssClassNames: true,
            cssMediaQueries: true,
            cssGlobalStyles: true,
            availableComponents: true
          },
          typesTools: {
            stylesTypes: {
              name: 'stylesTypes',
              path: './src/styles/types'
            },
            componentsTypes: {
              name: 'componentsTypes',
              path: `./src/styles/${themeName}/tools`
            }
          },
          fonts: {
            google: [
              {
                name: 'Roboto',
                weights: ['400', '700']
              }
            ]
          }
        }
      ]
    };

    await writeJsonFile(configPath, defaultConfig);

    return {
      success: true,
      data: defaultConfig,
      message: `Configuration created successfully with theme "${themeName}"`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating configuration: ${error}`
    };
  }
}

/**
 * Obtiene un tema específico de la configuración
 */
export async function getTheme(themeName: string): Promise<ToolResponse> {
  try {
    const configResult = await getConfig();
    
    if (!configResult.success || !configResult.data) {
      return configResult;
    }

    const theme = configResult.data.themes.find(t => t.name === themeName);
    
    if (!theme) {
      return {
        success: false,
        error: `Theme "${themeName}" not found`
      };
    }

    return {
      success: true,
      data: theme,
      message: `Theme "${themeName}" found`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error getting theme: ${error}`
    };
  }
}

/**
 * Lista todos los temas disponibles
 */
export async function listThemes(): Promise<ToolResponse<string[]>> {
  try {
    const configResult = await getConfig();
    
    if (!configResult.success || !configResult.data) {
      return {
        success: false,
        error: configResult.error
      };
    }

    const themeNames = configResult.data.themes.map(t => t.name);

    return {
      success: true,
      data: themeNames,
      message: `Found ${themeNames.length} theme(s)`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error listing themes: ${error}`
    };
  }
}
