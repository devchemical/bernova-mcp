import { z } from 'zod';
import type { ValidationResult, ComponentStyles } from '../types/bernova.types.js';

/**
 * Schema de validación para propiedades CSS básicas
 */
const cssValueSchema = z.union([z.string(), z.number()]);

/**
 * Schema para pseudo clases
 */
const pseudoClassesSchema = z.record(z.string(), z.any());

/**
 * Schema para pseudo elementos
 */
const pseudoElementsSchema = z.record(z.string(), z.any());

/**
 * Schema para atributos
 */
const attributesSchema = z.record(z.string(), z.any());

/**
 * Schema para media queries
 */
const mediaQueriesSchema = z.record(z.string(), z.any());

/**
 * Valida que un nombre de componente sea válido
 */
export function validateComponentName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!name || name.trim() === '') {
    errors.push('Component name cannot be empty');
  }

  if (!/^[A-Z][A-Z0-9_]*$/i.test(name)) {
    warnings.push('Component name should be in UPPER_CASE format (e.g., BUTTON, CARD_HEADER)');
  }

  if (name.startsWith('_')) {
    errors.push('Component name cannot start with underscore (reserved for nested elements)');
  }

  if (name.startsWith('$')) {
    errors.push('Component name cannot start with $ (reserved for special features)');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Valida propiedades CSS básicas
 */
export function validateCSSProperties(properties: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof properties !== 'object' || properties === null) {
    errors.push('CSS properties must be an object');
    return { valid: false, errors };
  }

  // Validar que las propiedades CSS usen guiones bajos en lugar de guiones medios
  for (const key of Object.keys(properties)) {
    // Ignorar propiedades especiales
    if (key.startsWith('$') || key.startsWith('_') || key === key.toUpperCase()) {
      continue;
    }

    // Verificar formato de propiedad CSS
    if (key.includes('-')) {
      warnings.push(`Property "${key}" should use underscores instead of hyphens (e.g., "background_color" instead of "background-color")`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Valida la estructura completa de estilos de un componente
 */
export function validateComponentStyles(styles: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof styles !== 'object' || styles === null) {
    errors.push('Component styles must be an object');
    return { valid: false, errors };
  }

  // Validar propiedades CSS
  const cssValidation = validateCSSProperties(styles);
  if (cssValidation.errors) {
    errors.push(...cssValidation.errors);
  }
  if (cssValidation.warnings) {
    warnings.push(...cssValidation.warnings);
  }

  // Validar características especiales
  for (const [key, value] of Object.entries(styles)) {
    if (key === '$pseudoClasses') {
      if (typeof value !== 'object' || value === null) {
        errors.push('$pseudoClasses must be an object');
      }
    } else if (key === '$pseudoElements') {
      if (typeof value !== 'object' || value === null) {
        errors.push('$pseudoElements must be an object');
      }
    } else if (key === '$attributes') {
      if (typeof value !== 'object' || value === null) {
        errors.push('$attributes must be an object');
      }
    } else if (key === '$mediaQueries') {
      if (typeof value !== 'object' || value === null) {
        errors.push('$mediaQueries must be an object');
      }
    } else if (key === '$advancedSelector') {
      if (!Array.isArray(value)) {
        errors.push('$advancedSelector must be an array');
      }
    } else if (key === '$dynamicValues') {
      if (!Array.isArray(value)) {
        errors.push('$dynamicValues must be an array');
      } else {
        // Validar que los valores dinámicos empiecen con $
        for (const dynValue of value) {
          if (typeof dynValue !== 'string' || !dynValue.startsWith('$')) {
            errors.push(`Dynamic value "${dynValue}" must be a string starting with $`);
          }
        }
      }
    } else if (key === '$foreign') {
      if (typeof value !== 'object' || value === null) {
        errors.push('$foreign must be an object');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Valida una configuración de Bernova completa
 */
export function validateBernovaConfig(config: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config || typeof config !== 'object') {
    errors.push('Configuration must be an object');
    return { valid: false, errors };
  }

  if (!config.themes || !Array.isArray(config.themes)) {
    errors.push('Configuration must have a "themes" array');
    return { valid: false, errors };
  }

  if (config.themes.length === 0) {
    errors.push('At least one theme must be defined');
  }

  // Validar cada tema
  for (let i = 0; i < config.themes.length; i++) {
    const theme = config.themes[i];
    
    if (!theme.name) {
      errors.push(`Theme at index ${i} must have a "name" property`);
    }

    if (theme.theme && (!theme.theme.name || !theme.theme.path)) {
      errors.push(`Theme "${theme.name || i}" theme configuration must have "name" and "path"`);
    }

    if (theme.foundations && (!theme.foundations.name || !theme.foundations.path)) {
      errors.push(`Theme "${theme.name || i}" foundations configuration must have "name" and "path"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Valida la estructura de una variable CSS
 */
export function validateCSSVariable(category: string, name: string, value: string | number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!category || category.trim() === '') {
    errors.push('Variable category cannot be empty');
  }

  if (!name || name.trim() === '') {
    errors.push('Variable name cannot be empty');
  }

  if (name.includes('-')) {
    warnings.push('Variable name should use underscores instead of hyphens');
  }

  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    errors.push('Variable value cannot be empty');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Valida una media query personalizada
 */
export function validateMediaQuery(name: string, type: string, values: Record<string, string>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!name || name.trim() === '') {
    errors.push('Media query name cannot be empty');
  }

  if (!type || type.trim() === '') {
    errors.push('Media query type cannot be empty (e.g., "screen", "print")');
  }

  if (!values || typeof values !== 'object' || Object.keys(values).length === 0) {
    errors.push('Media query values must be a non-empty object');
  }

  const validProperties = ['min-width', 'max-width', 'min-height', 'max-height', 'orientation'];
  for (const key of Object.keys(values)) {
    if (!validProperties.includes(key)) {
      warnings.push(`Media query property "${key}" may not be standard. Common properties: ${validProperties.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}
