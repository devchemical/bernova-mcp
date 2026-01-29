import { exec } from 'child_process';
import { promisify } from 'util';
import type { ToolResponse } from '../types/bernova.types.js';
import { fileExists, getBernovaConfigPath } from '../utils/file-system.js';

const execAsync = promisify(exec);

export type CompileMode = 'full' | 'foundationOnly' | 'componentOnly';

/**
 * Compila los estilos de Bernova
 */
export async function compileStyles(mode: CompileMode = 'full'): Promise<ToolResponse> {
  try {
    // Verificar que existe el archivo de configuración
    const configPath = getBernovaConfigPath();
    if (!await fileExists(configPath)) {
      return {
        success: false,
        error: 'bernova.config.json not found. Please create a configuration file first.'
      };
    }

    // Construir comando
    let command = 'npx bernova';
    
    if (mode === 'foundationOnly') {
      command += ' --foundationOnly';
    } else if (mode === 'componentOnly') {
      command += ' --componentOnly';
    }

    // Ejecutar compilación
    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('deprecated')) {
      console.warn('Compilation warnings:', stderr);
    }

    return {
      success: true,
      message: `Styles compiled successfully in "${mode}" mode`,
      data: {
        mode,
        output: stdout
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Compilation failed: ${error.message || error}`,
      data: {
        mode,
        stderr: error.stderr,
        stdout: error.stdout
      }
    };
  }
}

/**
 * Compila solo las foundations (variables CSS y estilos base)
 */
export async function compileFoundations(): Promise<ToolResponse> {
  return compileStyles('foundationOnly');
}

/**
 * Compila solo los componentes
 */
export async function compileComponents(): Promise<ToolResponse> {
  return compileStyles('componentOnly');
}

/**
 * Compila todo (foundations + components)
 */
export async function compileFull(): Promise<ToolResponse> {
  return compileStyles('full');
}

/**
 * Ejecuta el build avanzado de Bernova con opciones personalizadas
 */
export async function buildStyles(options: {
  baseOutDir?: string;
  minifyJs?: boolean;
  embedCss?: boolean;
  types?: ('cjs' | 'esm')[];
}): Promise<ToolResponse> {
  try {
    const configPath = getBernovaConfigPath();
    if (!await fileExists(configPath)) {
      return {
        success: false,
        error: 'bernova.config.json not found. Please create a configuration file first.'
      };
    }

    let command = 'npx bv-build';

    if (options.baseOutDir) {
      command += ` --base-out-dir ${options.baseOutDir}`;
    }

    if (options.minifyJs) {
      command += ' --minify-js';
    }

    if (options.embedCss) {
      command += ' --embed-css';
    }

    if (options.types && options.types.length > 0) {
      command += ` --types ${options.types.join(',')}`;
    }

    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('deprecated')) {
      console.warn('Build warnings:', stderr);
    }

    return {
      success: true,
      message: 'Build completed successfully',
      data: {
        options,
        output: stdout
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Build failed: ${error.message || error}`,
      data: {
        options,
        stderr: error.stderr,
        stdout: error.stdout
      }
    };
  }
}

/**
 * Verifica si Bernova está instalado
 */
export async function checkBernovaInstallation(): Promise<ToolResponse> {
  try {
    const { stdout } = await execAsync('npx bernova --version');
    
    return {
      success: true,
      message: 'Bernova is installed',
      data: {
        version: stdout.trim()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Bernova is not installed. Please run: npm install bernova'
    };
  }
}
