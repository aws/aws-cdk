import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type * as private_cxapi from '@aws-cdk/cloud-assembly-api';
import type { IConstruct } from 'constructs';
import { AnnotationPlugin } from './annotation-plugin';
import { collectAcknowledgedRuleIds } from './collect-acknowledged-rule-ids';
import { collectAnnotationReport } from './collect-annotation-report';
import { lit } from './literal-string';
import * as cxapi from '../../../cx-api';
import { _convertCloudAssemblyBuilder } from '../../../cx-api/lib/legacy-moved';
import { App } from '../app';
import { _aspectTreeRevisionReader } from '../aspect';
import { AssumptionError, UnscopedValidationError } from '../errors';
import { FeatureFlags } from '../feature-flags';
import { Stage } from '../stage';
import type { IPolicyValidationPlugin } from '../validation';
import { profileSpan } from './perf';
import { CloudFormationValidatePlugin } from '../validation/cloudformation-validate-plugin';
import { ConstructTree } from '../validation/private/construct-tree';
import { formatValidationReports, humanFriendlyFilename } from '../validation/private/modern-formatter';
import type { NamedValidationPluginReport, SuppressedViolation } from '../validation/private/report';
import { isPluginFailure, isSuppressibleViolation, mkPluginFailure, PolicyValidationReportFormatter } from '../validation/private/report';

const LEGACY_POLICY_VALIDATION_FILE_PATH = 'policy-validation-report.json';

/**
 * Invoke validation plugins for all stages in an App.
 */
export function validateTemplates(root: IConstruct, outdir: string, assembly: private_cxapi.CloudAssembly) {
  if (!App.isApp(root)) return;

  using _span = profileSpan('validateTemplates', { telemetry: true });
  const assemblies = getAssemblies(root, assembly);
  const stacksByPlugin: Map<IPolicyValidationPlugin, private_cxapi.CloudFormationStackArtifact[]> = new Map();

  visitAssemblies(root, 'post', construct => {
    if (Stage.isStage(construct)) {
      const stageAssembly = assemblies.get(construct.artifactId);
      if (!stageAssembly) throw new AssumptionError(lit`ValidationFailed`, `Validation failed, cannot find cloud assembly for stage ${construct.stageName}`);

      const plugins = pluginsToEvaluate(construct, construct, stageAssembly);
      for (const plugin of plugins) {
        if (!stacksByPlugin.has(plugin)) {
          stacksByPlugin.set(plugin, []);
        }
        stacksByPlugin.get(plugin)!.push(...stageAssembly.stacksRecursively);
      }
    }
  });

  if (stacksByPlugin.size === 0) return;

  const reports: NamedValidationPluginReport[] = doInvokeValidationPlugins(outdir, Array.from(stacksByPlugin), root);

  // When the default validation plugin is not explicitly opted-in, downgrade
  // its errors to warnings so synthesis does not fail.
  const validateFlagExplicitlyEnabled = root.node.tryGetContext(cxapi.VALIDATE_AGAINST_DEFAULT_RULES) === true;
  let warningifiedAnyErrors = false;
  if (!validateFlagExplicitlyEnabled) {
    warningifiedAnyErrors = downgradeCfnValidateErrorsToWarnings(reports);
  }

  const suppressedByReport: Map<number, SuppressedViolation[]> = collectSuppressions(root, reports);

  const formatter = new PolicyValidationReportFormatter(new ConstructTree(root));
  const reportJson = formatter.formatJson(reports, assembly.version, suppressedByReport);

  // Always write validation report to disk
  const reportFile = path.join(assembly.directory, cxapi.VALIDATION_REPORT_FILE);
  fs.writeFileSync(reportFile, JSON.stringify(reportJson, undefined, 2));

  // Write legacy report if requested
  if (getBooleanContext(root, cxapi.VALIDATION_REPORT_JSON_CONTEXT, false)) {
    fs.writeFileSync(
      path.join(assembly.directory, LEGACY_POLICY_VALIDATION_FILE_PATH),
      JSON.stringify(formatter.formatLegacyJson(reports), undefined, 2),
    );
  }

  // Construct library strict mode -- everything is errors. This is intended for construct library testing.
  // Its behavior is not intended to be user-facing, and behavior may change to suit our needs.
  const constructLibStrictMode = getBooleanContext(root, cxapi.STRICT_CFN_VALIDATE_ERRORS, false);

  if (warningifiedAnyErrors) {
    if (constructLibStrictMode) {
      // eslint-disable-next-line no-console
      console.error(
        '\n[Warning] Template validation found issues in your templates. Construct library strict mode considers these errors.\n',
      );
    } else {
      // eslint-disable-next-line no-console
      console.error(
        '\n[Warning] Template validation found issues in your templates (reported as warnings).'
        + `\nSet feature flag "${cxapi.VALIDATE_AGAINST_DEFAULT_RULES}" to true to turn these into errors.\n`,
      );
    }
  }

  // Whether the CDK app handles validation output (default true). The CLI can set this to false to take over the
  // responsibility of printing the validation report and setting the exit code.
  const cdkAppHandlesValidationReporting = getBooleanContext(root, cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT, true);
  if (cdkAppHandlesValidationReporting || constructLibStrictMode) {
    const output = formatValidationReports(process.cwd(), reportJson.pluginReports);
    if (output) {
      // eslint-disable-next-line no-console
      console.error(output.join('\n\n'));
    }

    let failed = reports.some(r => !r.success);
    // If requested for "strict mode", also consider warnings as failed.
    if (constructLibStrictMode) {
      failed ||= reports.some(r => r.violations.some(v => v.severity === 'warning'));
    }

    if (failed) {
      const reportPath = humanFriendlyFilename(process.cwd(), reportFile);

      // This used to be `process.exitCode = 1`, but that doesn't do the same
      // thing if synthesis happens in (1) unit tests (2) in-memory in the
      // toolkit library. So we have to throw an error here to make sure we
      // properly fail in all cases. Potentially we can optimize this to a
      // "clean" exitCode if we know (via an environment variable) that we are
      // being executed as a subprocess.
      throw new UnscopedValidationError(lit`ValidationFailed`, `Validation failed. A copy of this report can be found in: ${reportPath}`);
    }
  }
}

/**
 * Find all the assemblies in the app, including all levels of nested assemblies
 * and return a map where the assemblyId is the key
 */
function getAssemblies(root: App, rootAssembly: private_cxapi.CloudAssembly): Map<string, private_cxapi.CloudAssembly> {
  const assemblies = new Map<string, private_cxapi.CloudAssembly>();
  assemblies.set(root.artifactId, rootAssembly);
  visitAssemblies(root, 'pre', construct => {
    const stage = construct as Stage;
    if (stage.parentStage && assemblies.has(stage.parentStage.artifactId)) {
      assemblies.set(
        stage.artifactId,
        assemblies.get(stage.parentStage.artifactId)!.getNestedAssembly(stage.artifactId),
      );
    }
  });
  return assemblies;
}

/**
 * Return the list of plugins to invoke for the given stage
 */
function pluginsToEvaluate(root: IConstruct, stage: Stage, stageAssembly: private_cxapi.CloudAssembly): IPolicyValidationPlugin[] {
  const ret: IPolicyValidationPlugin[] = [];

  // 1. User-registered plugins
  ret.push(...stage._validationPlugins);

  // 2. Default validation engine (always runs, unless user registered one explicitly)
  if (!hasUserRegisteredCloudFormationValidatePlugin(root)) {
    ret.push(CloudFormationValidatePlugin._singletonInstance());
  }

  // 3. Construct annotations (as a plugin, only if there are annotations to report)
  if (FeatureFlags.of(root).isEnabled(cxapi.ANNOTATIONS_IN_VALIDATION_REPORT)) {
    const annotationReport = collectAnnotationReport(stage, stageAssembly.directory);
    if (annotationReport) {
      ret.push(new AnnotationPlugin(annotationReport));
    }
  }

  return ret;
}

function downgradeCfnValidateErrorsToWarnings(reports: NamedValidationPluginReport[]) {
  let warningifiedAnyErrors = false;
  for (const report of reports) {
    if (report.pluginName !== CloudFormationValidatePlugin.PLUGIN_NAME) {
      continue;
    }
    for (const v of report.violations) {
      if (v.severity === 'error' || v.severity === 'fatal') {
        mutable(v).severity = 'warning';
        warningifiedAnyErrors = true;
      }
    }
    mutable(report).success = true;
  }
  return warningifiedAnyErrors;
}

/**
 * Filter out suppressed violations. Collect all acknowledged rule IDs
 * from construct metadata across the tree, then remove matching violations
 * from reports. Fatal violations cannot be suppressed.
 *
 * Rule matching: violations are matched as <pluginName>::<ruleName> with
 * spaces replaced by dashes. Users suppress with:
 *   Validations.of(x).acknowledge({ id: '<plugin-name>::<rule-id>' })
 */
function collectSuppressions(root: App, reports: NamedValidationPluginReport[]) {
  const suppressedByReport: Map<number, SuppressedViolation[]> = new Map();
  const acknowledgedRules = collectAcknowledgedRuleIds(root);

  if (acknowledgedRules.size > 0) {
    for (let i = 0; i < reports.length; i++) {
      const pluginName = reports[i].pluginName.replace(/ /g, '-');
      const active: typeof reports[0]['violations'] = [];
      const suppressed: SuppressedViolation[] = [];
      for (const v of reports[i].violations) {
        if (!isSuppressibleViolation(v)) {
          active.push(v);
          continue;
        }
        const ruleId = `${pluginName}::${v.ruleName.replace(/ /g, '-')}`;
        const ack = acknowledgedRules.get(ruleId);
        if (ack) {
          suppressed.push({
            ...v,
            acknowledgedId: ruleId,
            reason: ack.reason,
            acknowledgedAt: ack.constructPath,
            acknowledgedStackTrace: ack.stackTrace,
          });
        } else {
          active.push(v);
        }
      }
      if (suppressed.length > 0) {
        suppressedByReport.set(i, suppressed);
        reports[i] = {
          ...reports[i],
          violations: active,
          success: active.every(v => v.severity !== 'error' && v.severity !== 'fatal'),
        };
      }
    }
  }
  return suppressedByReport;
}

/**
 * Invoke all validation plugins, make sure they don't accidentally modify any files in the output directory (so they are strictly readonly).
 */
function doInvokeValidationPlugins(
  outdir: string,
  plugins: Array<[IPolicyValidationPlugin, private_cxapi.CloudFormationStackArtifact[]]>,
  root: App,
) {
  const preExistingFileHashes = snapshotFileHashes(outdir);

  return plugins.flatMap(([plugin, stacks]) => invokeSinglePlugin(plugin, stacks));

  function invokeSinglePlugin(
    plugin: IPolicyValidationPlugin,
    stackArtifacts: private_cxapi.CloudFormationStackArtifact[],
  ): NamedValidationPluginReport[] {
    const stacksByEnv = groupStacksByEnvironment(stackArtifacts);

    const reports = stacksByEnv.map(({ accountId, region, stacks }) => {
      try {
        const report = plugin.validate({
          templatePaths: stacks.map(s => s.templateFullPath),
          appConstruct: root,
          accountId,
          region,
        });

        if (hasModifiedPreExistingFiles(preExistingFileHashes)) {
          throw new AssumptionError(lit`IllegalOperationValidationPlugin`, `Illegal operation: validation plugin '${plugin.name}' modified the cloud assembly`);
        }

        return { ...report, pluginName: plugin.name, pluginVersion: plugin.version } satisfies NamedValidationPluginReport;
      } catch (e: any) {
        return mkPluginFailure(plugin, e);
      }
    });

    return mergeReports(reports);
  }
}

interface StacksByEnvironment {
  readonly accountId: string | undefined;
  readonly region: string | undefined;
  readonly stacks: private_cxapi.CloudFormationStackArtifact[];
}

function groupStacksByEnvironment(stacks: private_cxapi.CloudFormationStackArtifact[]): StacksByEnvironment[] {
  const ret = new Map<string, StacksByEnvironment>();

  for (const stack of stacks) {
    const key = `${stack.environment.account || ''}::${stack.environment.region || ''}`;
    if (!ret.has(key)) {
      ret.set(key, { accountId: stack.environment.account, region: stack.environment.region, stacks: [] });
    }
    ret.get(key)!.stacks.push(stack);
  }

  return Array.from(ret.values());
}

/**
 * Visit the given construct tree in either pre or post order, only looking at Assemblies
 */
export function visitAssemblies(root: IConstruct, order: 'pre' | 'post', cb: (x: IConstruct) => void) {
  if (order === 'pre') {
    cb(root);
  }

  for (const child of root.node.children) {
    if (!Stage.isStage(child)) { continue; }
    visitAssemblies(child, order, cb);
  }

  if (order === 'post') {
    cb(root);
  }
}

function getBooleanContext(root: IConstruct, key: string, defaultValue: boolean): boolean {
  const raw = root.node.tryGetContext(key);
  if (raw === undefined) return defaultValue;
  return raw !== false && raw !== 'false';
}

function snapshotFileHashes(dir: string): Map<string, string> {
  const hashes = new Map<string, string>();
  for (const filePath of collectFilePaths(dir)) {
    hashes.set(filePath, hashFile(filePath));
  }
  return hashes;
}

function hasModifiedPreExistingFiles(snapshot: Map<string, string>): boolean {
  for (const [filePath, originalHash] of snapshot) {
    if (!fs.existsSync(filePath) || hashFile(filePath) !== originalHash) {
      return true;
    }
  }
  return false;
}

function collectFilePaths(dir: string): string[] {
  const results: string[] = [];
  function walk(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Validate that CloudFormationValidatePlugin is registered correctly.
 * Returns true if the user registered exactly one valid instance, false if none.
 * Throws if the plugin is registered on a nested Stage or more than once.
 */
function hasUserRegisteredCloudFormationValidatePlugin(root: IConstruct): boolean {
  let count = 0;
  visitAssemblies(root, 'post', construct => {
    if (!Stage.isStage(construct)) return;
    for (const plugin of construct._validationPlugins) {
      if (!(plugin instanceof CloudFormationValidatePlugin)) continue;
      if (construct !== root) {
        throw new UnscopedValidationError(lit`CloudFormationValidatePluginNotAtApp`, 'CloudFormationValidatePlugin can only be registered at the App level, not on a Stage');
      }
      count++;
    }
  });
  if (count > 1) {
    throw new UnscopedValidationError(lit`DuplicateCloudFormationValidatePlugin`, 'only one instance of CloudFormationValidatePlugin can be registered');
  }
  return count === 1;
}

function mutable<A extends object>(obj: A): { -readonly [P in keyof A]: A[P] } {
  return obj as any;
}

/**
 * Merge the reports from multiple invocations of the same plugin into a single report.
 *
 * All non-errors are combined into a single report, and errors are combined by error message.
 */
function mergeReports(reports: NamedValidationPluginReport[]): NamedValidationPluginReport[] {
  const nonErrors = reports.filter(r => isPluginFailure(r) === undefined);
  const errors = reports.filter(r => isPluginFailure(r) !== undefined);

  const ret: NamedValidationPluginReport[] = [];
  if (nonErrors.length > 0) {
    const merged: NamedValidationPluginReport = nonErrors[0];
    for (const candidate of nonErrors.slice(1)) {
      merged.violations.push(...candidate.violations);
      mutable(merged).metadata = { ...merged.metadata, ...candidate.metadata };
      mutable(merged).success = merged.success && candidate.success;
    }
    ret.push(merged);
  }

  if (errors.length > 0) {
    const errorMap = new Map<string, NamedValidationPluginReport>();
    for (const candidate of errors) {
      const errorMessage = isPluginFailure(candidate);
      if (!errorMessage) continue;
      if (!errorMap.has(errorMessage)) {
        errorMap.set(errorMessage, candidate);
      }
    }
    ret.push(...errorMap.values());
  }

  return ret;
}

