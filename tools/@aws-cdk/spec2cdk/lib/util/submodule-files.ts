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
 * Ruby target configuration from the `aws-cdk-lib` package.json
 */
export interface RubyTargetConfig {
  /**
   * The root ruby module, e.g. `AWSCDK`
   */
  readonly module: string;

  /**
   * Words that are cased as acronyms in ruby module names, e.g. `S3`, `API`
   */
  readonly acronyms: string[];
}

/**
 * Location of the `aws-cdk-lib` package.json, which is the single source of
 * truth for the ruby root module name and acronym list.
 */
export const rubyTargetConfigPath = path.join(__dirname, '..', '..', '..', '..', '..', 'packages', 'aws-cdk-lib', 'package.json');

/**
 * Load the ruby target configuration (root module and acronyms) from a package.json
 */
export async function loadRubyTargetConfig(packageJsonPath: string = rubyTargetConfigPath): Promise<RubyTargetConfig> {
  let pkg;
  try {
    pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  } catch (e: any) {
    throw new Error(`Cannot read ruby target configuration from ${packageJsonPath}: ${e.message}`);
  }

  const ruby = pkg.jsii?.targets?.ruby;
  if (!ruby?.module) {
    throw new Error(`No jsii.targets.ruby.module found in ${packageJsonPath}`);
  }

  return {
    module: ruby.module,
    acronyms: ruby.acronyms ?? [],
  };
}

/**
 * Derive the ruby module name for a submodule, e.g. `AWSCDK::S3`
 *
 * Derivation is based on the CloudFormation namespace casing (via `moduleFamily`
 * and `moduleBaseName`), with acronym casing applied from the given config:
 *
 * - `AWS::S3` -> `AWSCDK::S3`
 * - `AWS::ApiGateway` -> `AWSCDK::APIGateway` (acronym casing from config)
 * - `AWS::ApiGatewayV2` -> `AWSCDK::APIGatewayv2` (version suffixes are lowercased)
 * - `Alexa::ASK` -> `AWSCDK::AlexaASK` (non-AWS module families are prefixed)
 *
 * Note that a handful of existing submodules deviate from these rules
 * (e.g. `aws-autoscaling` -> `AWSCDK::Autoscaling`); their committed
 * `.jsiirc.json` files are authoritative and preserved by `writeJsiiRc`.
 */
export function deriveRubyModule(definition: ModuleDefinition, config: RubyTargetConfig): string {
  const parts = definition.moduleFamily === 'AWS'
    ? [definition.moduleBaseName]
    : [definition.moduleFamily, definition.moduleBaseName];

  const name = parts.map((part) => rubyNamespaceFromPascalCase(part, config.acronyms)).join('');
  return `${config.module}::${name}`;
}

/**
 * Apply ruby casing rules to a PascalCased name (usually a CloudFormation namespace part)
 */
function rubyNamespaceFromPascalCase(name: string, acronyms: string[]): string {
  const acronymSet = new Set(acronyms.map((a) => a.toUpperCase()));

  // Split into words: uppercase runs (`SSM`), capitalized words (`Route53`), digit/lowercase runs (`2`)
  const tokens = name.match(/[A-Z]+(?![a-z])|[A-Z][a-z0-9]*|[a-z0-9]+/g) ?? [name];

  // Merge adjacent tokens that together form a configured acronym (`F`+`Sx` -> `FSX`, `EC`+`2` -> `EC2`)
  // and uppercase single tokens that are configured acronyms (`Api` -> `API`).
  const words = new Array<string>();
  for (let i = 0; i < tokens.length; ) {
    let merged = undefined;
    for (let j = tokens.length; j > i; j--) {
      const candidate = tokens.slice(i, j).join('').toUpperCase();
      if (acronymSet.has(candidate)) {
        merged = candidate;
        i = j;
        break;
      }
    }
    if (merged == null) {
      merged = tokens[i];
      i += 1;
    }
    words.push(merged);
  }

  // The root module already carries the `AWS` prefix, don't repeat it (`AWSExternalAnthropic` -> `ExternalAnthropic`)
  if (words.length > 1 && words[0] === 'AWS') {
    words.shift();
  }

  // Version suffixes are lowercased (`ApiGatewayV2` -> `APIGatewayv2`)
  return words.join('').replace(/(?<=[A-Za-z])V(?=\d+$)/, 'v');
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

  let existingTargets: Record<string, Record<string, string>> = {};
  if (existsSync(filePath)) {
    try {
      const existing = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      existingTargets = existing.targets || {};
    } catch (e: any) {
      throw new Error(`Cannot read existing jsiirc file ${filePath}: ${e.message}`);
    }
  }

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

  // Existing ruby names are authoritative (a few pre-date the derivation rules);
  // for new submodules, derive one so every submodule always has a ruby module name.
  if (existingTargets.ruby) {
    targets.ruby = existingTargets.ruby;
  } else {
    const rubyModule = deriveRubyModule(definition, await loadRubyTargetConfig());
    targets.ruby = {
      module: ns ? `${rubyModule}::${nsUc}` : rubyModule,
    };
  }

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
