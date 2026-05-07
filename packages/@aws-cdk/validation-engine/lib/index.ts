// eslint-disable-next-line @typescript-eslint/no-require-imports
const engine = require('./engine');

export const RegoEngine = engine.RegoEngine;
export const TemplateFile = engine.TemplateFile;
export const version = engine.version;

/**
 * Severity levels reported by the validation engine.
 */
export type Severity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

/**
 * A single diagnostic finding from the validation engine.
 */
export interface Diagnostic {
  readonly ruleId: string;
  readonly severity: Severity;
  readonly message: string;
  readonly resourceId?: string;
  readonly resourceType?: string;
  readonly propertyPath?: string;
  readonly suggestedFix?: string;
  readonly category?: string;
}

/**
 * Report returned by the validation engine.
 */
export interface ValidationReport {
  readonly filePath: string;
  readonly diagnostics: Diagnostic[];
}

/**
 * Configuration for the validation engine.
 */
export interface ValidateConfig {
  readonly severityLevel?: Severity;
}
