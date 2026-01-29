/**
 * Tipos para la configuración de Bernova
 */

export interface BernovaConfig {
  provider?: {
    name: string;
    path: string;
    declarationHelp?: boolean;
  };
  themes: BernovaTheme[];
  tsconfigPath?: string;
  compilerOptions?: CompilerOptions;
}

export interface BernovaTheme {
  name: string;
  prefix?: string;
  minified?: boolean;
  stylesPath?: string;
  resetCss?: boolean;
  theme?: {
    name: string;
    path: string;
  };
  foundations?: {
    name: string;
    path: string;
  };
  globalStyles?: {
    name: string;
    path: string;
  };
  mediaQueries?: {
    name: string;
    path: string;
  };
  fonts?: FontsConfig;
  bvTools?: BvToolsConfig;
  typesTools?: TypesToolsConfig;
  foreignThemes?: ForeignTheme[];
}

export interface CompilerOptions {
  baseOutDir?: string;
  rootDir?: string;
  minifyCss?: boolean;
  minifyJS?: boolean;
  preventMoveJS?: boolean;
  preventMoveDTS?: boolean;
  types?: ('cjs' | 'esm')[];
  embedCss?: boolean;
  customOutDirs?: {
    css?: string;
    provider?: string;
    tools?: string;
  };
}

export interface FontsConfig {
  google?: GoogleFont[];
  local?: LocalFont[];
}

export interface GoogleFont {
  name: string;
  weights: string[];
}

export interface LocalFont {
  name: string;
  path: string;
}

export interface BvToolsConfig {
  path: string;
  declarationHelp?: boolean;
  cssVariables?: boolean;
  cssClassNames?: boolean;
  cssMediaQueries?: boolean;
  cssGlobalStyles?: boolean;
  availableComponents?: boolean;
}

export interface TypesToolsConfig {
  stylesTypes?: {
    name: string;
    path: string;
  };
  componentsTypes?: {
    name: string;
    path: string;
  };
}

export interface ForeignTheme {
  position: 'before' | 'after';
  name: string;
  path: string;
}

/**
 * Tipos para estilos de componentes
 */

export type CSSValue = string | number;

export interface CSSProperties {
  [key: string]: CSSValue | CSSProperties | SpecialFeature;
}

export interface SpecialFeature {
  $pseudoClasses?: PseudoClasses;
  $pseudoElements?: PseudoElements;
  $attributes?: Attributes;
  $mediaQueries?: MediaQueries;
  $advancedSelector?: AdvancedSelector[];
  $foreign?: Foreign;
  $dynamicValues?: string[];
  [key: string]: any;
}

export interface PseudoClasses {
  hover?: CSSProperties;
  active?: CSSProperties;
  focus?: CSSProperties;
  visited?: CSSProperties;
  disabled?: CSSProperties;
  [key: string]: CSSProperties | undefined;
}

export interface PseudoElements {
  before?: CSSProperties & { $content?: string };
  after?: CSSProperties & { $content?: string };
  [key: string]: (CSSProperties & { $content?: string }) | undefined;
}

export interface Attributes {
  [attributeName: string]: CSSProperties | Record<string, CSSProperties>;
}

export interface MediaQueries {
  [queryName: string]: CSSProperties | MediaQueryCustom;
}

export interface MediaQueryCustom {
  $type: string;
  $values: Record<string, string>;
  [key: string]: any;
}

export interface AdvancedSelector {
  descendant?: SelectorTarget;
  child?: SelectorTarget;
  sibling?: SelectorTarget;
  adjacent?: SelectorTarget;
}

export interface SelectorTarget {
  $target: string;
  [key: string]: any;
}

export interface Foreign {
  [key: string]: {
    component: any;
    variant?: string;
    name: string;
  };
}

export interface ComponentStyles {
  [componentName: string]: CSSProperties;
}

/**
 * Tipos para validación
 */

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Tipos para respuestas del MCP
 */

export interface ToolResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
