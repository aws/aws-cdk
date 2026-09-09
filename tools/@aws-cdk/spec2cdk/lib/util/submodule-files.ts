import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { ModuleDefinition } from '@aws-cdk/pkglint';

export interface WriteJsiiRcOptions {
  /**
   * Lowercase namespace suffix appended to java/dotnet/python targets.
   * @default - no suffix
   */
  readonly namespaceSuffix?: string;

  /**
   * Prefix for the go package name. Combined with moduleName and namespaceSuffix.
   * If omitted, the go target is not written.
   * @default - no go target
   */
  readonly goPrefix?: string;
}

/**
 * Write a `.jsiirc.json` file with the correct target metadata.
 *
 * @param filePath - absolute path to write the jsiirc file to
 * @param definition - the module definition to derive targets from
 * @param options - optional namespace suffix and go prefix
 */
export async function writeJsiiRc(filePath: string, definition: ModuleDefinition, options: WriteJsiiRcOptions = {}) {
  const ns = options.namespaceSuffix ?? '';
  const nsUc = ns.charAt(0).toUpperCase() + ns.slice(1);

  const targets: Record<string, Record<string, string>> = {
    java: {
      package: ns ? `${definition.javaPackage}.${ns}` : definition.javaPackage,
    },
    dotnet: {
      namespace: ns ? `${definition.dotnetPackage}.${nsUc}` : definition.dotnetPackage,
    },
    python: {
      module: ns ? `${definition.pythonModuleName}.${ns}` : definition.pythonModuleName,
    },
  };

  if (options.goPrefix != null) {
    targets.go = {
      packageName: `${options.goPrefix}${definition.moduleName}${ns}`.replace(/[^a-z0-9.]/gi, ''),
    };
  }

  await fs.writeFile(filePath, JSON.stringify({ targets }, null, 2) + '\n');
}

/**
 * Derive the jsiirc file path for a given module file.
 *
 * - For `index.ts` → `<dir>/.jsiirc.json`
 * - For `foo.ts` → `<dir>/.foo.jsiirc.json`
 */
export function jsiiRcPathFor(moduleFile: string): string {
  const base = path.basename(moduleFile, '.ts');
  return base === 'index'
    ? path.join(path.dirname(moduleFile), '.jsiirc.json')
    : path.join(path.dirname(moduleFile), `.${base}.jsiirc.json`);
}

/**
 * Ensure a file contains the given lines, preserving any existing non-generated lines.
 */
export async function ensureFileContains(fileName: string, lines: string[]) {
  let currentLines = new Array<string>();

  if (existsSync(fileName)) {
    currentLines.push(...(await fs.readFile(fileName, 'utf-8')).split('\n')
      .filter(l => !l.includes('.generated'))
      .filter(Boolean));
  }

  for (const line of lines) {
    if (!currentLines.includes(line)) {
      currentLines.push(line);
    }
  }

  await fs.writeFile(fileName, currentLines.sort().join('\n') + '\n');
}
