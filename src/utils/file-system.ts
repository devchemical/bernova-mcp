import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Obtiene el directorio actual del proyecto
 */
export function getCurrentDir(): string {
  return process.cwd();
}

/**
 * Lee un archivo JSON y lo parsea
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  try {
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(getCurrentDir(), filePath);
    
    const content = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Error reading JSON file ${filePath}: ${error}`);
  }
}

/**
 * Escribe un objeto como JSON en un archivo
 */
export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(getCurrentDir(), filePath);
    
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(absolutePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Error writing JSON file ${filePath}: ${error}`);
  }
}

/**
 * Lee un archivo de texto
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(getCurrentDir(), filePath);
    
    return await fs.readFile(absolutePath, 'utf-8');
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error}`);
  }
}

/**
 * Escribe un archivo de texto
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(getCurrentDir(), filePath);
    
    // Crear directorio si no existe
    const dir = path.dirname(absolutePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(absolutePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Error writing file ${filePath}: ${error}`);
  }
}

/**
 * Verifica si un archivo existe
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(getCurrentDir(), filePath);
    
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Crea un directorio si no existe
 */
export async function ensureDir(dirPath: string): Promise<void> {
  const absolutePath = path.isAbsolute(dirPath)
    ? dirPath
    : path.join(getCurrentDir(), dirPath);
  
  await fs.mkdir(absolutePath, { recursive: true });
}

/**
 * Lee el contenido de un módulo TypeScript/JavaScript
 */
export async function readModuleFile(filePath: string): Promise<string> {
  return await readFile(filePath);
}

/**
 * Escribe un módulo TypeScript/JavaScript
 */
export async function writeModuleFile(filePath: string, content: string): Promise<void> {
  await writeFile(filePath, content);
}

/**
 * Obtiene la ruta absoluta del archivo de configuración de Bernova
 */
export function getBernovaConfigPath(): string {
  return path.join(getCurrentDir(), 'bernova.config.json');
}

/**
 * Resuelve una ruta relativa desde la configuración
 */
export function resolveConfigPath(configPath: string): string {
  if (path.isAbsolute(configPath)) {
    return configPath;
  }
  return path.join(getCurrentDir(), configPath);
}
