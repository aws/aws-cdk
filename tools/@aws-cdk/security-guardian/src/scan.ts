import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { judgeTemplate, TemplateVerdicts } from './condition-verdict';
import { runCfnGuardValidation } from './cfn-guard-runner';
import { preprocessTemplates } from './template-preprocessor';

export interface ScanOptions {
  /** The folder that holds the committed bytes of each changed template, which the static scan reads */
  readonly changedDir: string;
  /** The folder that receives the preprocessed copies, which the resolved scan reads */
  readonly resolvedDir: string;
  readonly ruleSetPath: string;
  readonly staticReport: string;
  readonly resolvedReport: string;
  /** Repository path of each file in `changedDir`, by its absolute path */
  readonly fileMapping: Map<string, string>;
  readonly enhanceXml: boolean;
}

export interface ScanResult {
  readonly staticPassed: boolean;
  readonly resolvedPassed: boolean;
}

function jsonFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return jsonFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith('.json') ? [fullPath] : [];
  });
}

/**
 * The Condition verdicts of each template in `dir`, by its absolute path.
 *
 * A file that JSON.parse rejects, or whose judgement throws, gets no verdicts.
 */
export function judgeTemplateFiles(dir: string): Map<string, TemplateVerdicts> {
  const verdicts = new Map<string, TemplateVerdicts>();
  for (const file of jsonFiles(dir)) {
    try {
      verdicts.set(path.resolve(file), judgeTemplate(JSON.parse(fs.readFileSync(file, 'utf8'))));
    } catch (err) {
      core.warning(`Could not read the Conditions of ${file}, so its failures stay in the reports: ${(err as Error).message}`);
    }
  }
  return verdicts;
}

/** The verdicts of each committed template, by the path of its preprocessed copy */
export function verdictsOfResolvedCopies(verdicts: Map<string, TemplateVerdicts>, resolvedMapping: Map<string, string>): Map<string, TemplateVerdicts> {
  const resolved = new Map<string, TemplateVerdicts>();
  for (const [resolvedFile, committedFile] of resolvedMapping) {
    const committed = verdicts.get(committedFile);
    if (committed) {
      resolved.set(resolvedFile, committed);
    }
  }
  return resolved;
}

/**
 * Runs the static and resolved scans of the changed templates and writes their reports.
 *
 * The Condition verdicts come from the committed bytes in `changedDir`, read before preprocessing,
 * and both scans use them.
 */
export async function scanChangedTemplates(options: ScanOptions): Promise<ScanResult> {
  const { changedDir, resolvedDir, ruleSetPath, staticReport, resolvedReport, fileMapping, enhanceXml } = options;
  const judged = judgeTemplateFiles(changedDir);

  core.info('Preprocessing templates (resolving intrinsics and normalizing policies)');
  const { files: processedFiles, mapping: resolvedMapping } = preprocessTemplates(changedDir, resolvedDir);
  core.info(`Processed ${processedFiles.length} template(s)`);

  // A template the preprocessor wrote no resolved copy for has nothing for the resolved scan to fail,
  // so it keeps every static failure, as without verdicts
  const resolvedTemplates = new Set(resolvedMapping.values());
  const verdicts = new Map([...judged].filter(([file]) => resolvedTemplates.has(file)));
  for (const file of judged.keys()) {
    if (!resolvedTemplates.has(file)) {
      core.warning(`No resolved copy of ${file}, so its failures stay in the static report`);
    }
  }

  const combinedMapping = new Map([...fileMapping, ...resolvedMapping]);

  core.info(`Running cfn-guard (static) with rule set: ${ruleSetPath}`);
  const staticPassed = await runCfnGuardValidation(changedDir, ruleSetPath, staticReport, 'Static', combinedMapping, enhanceXml, verdicts);

  core.info(`Running cfn-guard (resolved) with rule set: ${ruleSetPath}`);
  const resolvedPassed = await runCfnGuardValidation(
    resolvedDir, ruleSetPath, resolvedReport, 'Resolved', combinedMapping, enhanceXml, verdictsOfResolvedCopies(verdicts, resolvedMapping),
  );

  return { staticPassed, resolvedPassed };
}
