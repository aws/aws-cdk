import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as private_cxapi from '@aws-cdk/cloud-assembly-api';
import type { IConstruct } from 'constructs';
import { AnnotationPlugin } from './annotation-plugin';
import { collectAcknowledgedRuleIds } from './collect-acknowledged-rule-ids';
import { collectAnnotationReport } from './collect-annotation-report';
import { generateFeatureFlagReport } from './feature-flag-report';
import { lit } from './literal-string';
import { MetadataResource } from './metadata-resource';
import { prepareApp } from './prepare-app';
import { TreeMetadata } from './tree-metadata';
import * as cxapi from '../../../cx-api';
import { _convertCloudAssemblyBuilder } from '../../../cx-api/lib/legacy-moved';
import { Annotations } from '../annotations';
import { App } from '../app';
import { _aspectTreeRevisionReader, AspectApplication, AspectPriority, Aspects } from '../aspect';
import { AssumptionError, UnscopedValidationError } from '../errors';
import { FeatureFlags } from '../feature-flags';
import { Stack } from '../stack';
import type { ISynthesisSession } from '../stack-synthesizers/types';
import type { StageSynthesisOptions } from '../stage';
import { Stage } from '../stage';
import type { IPolicyValidationPlugin } from '../validation';
import { profileSpan } from './perf';
import { CloudFormationValidatePlugin } from '../validation/cloudformation-validate-plugin';
import { ConstructTree } from '../validation/private/construct-tree';
import { formatValidationReports, humanFriendlyFilename } from '../validation/private/modern-formatter';
import type { NamedValidationPluginReport, SuppressedViolation } from '../validation/private/report';
import { isSuppressibleViolation, mkPluginFailure, PolicyValidationReportFormatter } from '../validation/private/report';

const LEGACY_POLICY_VALIDATION_FILE_PATH = 'policy-validation-report.json';

/**
 * Options for `synthesize()`
 */
export interface SynthesisOptions extends StageSynthesisOptions {
  /**
   * The output directory into which to synthesize the cloud assembly.
   * @default - creates a temporary directory
   */
  readonly outdir?: string;
}

export function synthesize(root: IConstruct, options: SynthesisOptions = { }): private_cxapi.CloudAssembly {
  // add the TreeMetadata resource to the App first
  injectTreeMetadata(root);
  // we start by calling "synth" on all nested assemblies (which will take care of all their children)
  synthNestedAssemblies(root, options);

  if (options.aspectStabilization) {
    invokeAspectsV2(root);
  } else {
    invokeAspects(root);
  }

  injectMetadataResources(root);

  // resolve references
  prepareApp(root);

  // give all children an opportunity to validate now that we've finished prepare
  if (!options.skipValidation) {
    validateTree(root);
  }

  // in unit tests, we support creating free-standing stacks, so we create the
  // assembly builder here.
  const builder = Stage.isStage(root)
    ? _convertCloudAssemblyBuilder(root._assemblyBuilder)
    : new private_cxapi.CloudAssemblyBuilder(options.outdir);

  // next, we invoke "onSynthesize" on all of our children. this will allow
  // stacks to add themselves to the synthesized cloud assembly.
  synthesizeTree(root, builder, options.validateOnSynthesis);

  generateFeatureFlagReport(builder, root);

  const assembly = builder.buildAssembly();

  validateTemplates(root, builder.outdir, assembly);

  return assembly;
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
 * Invoke validation plugins for all stages in an App.
 */
function validateTemplates(root: IConstruct, outdir: string, assembly: private_cxapi.CloudAssembly) {
  if (!App.isApp(root)) return;

  using _span = profileSpan('validateTemplates', { telemetry: true });
  const assemblies = getAssemblies(root, assembly);
  const templatePathsByPlugin: Map<IPolicyValidationPlugin, string[]> = new Map();
  visitAssemblies(root, 'post', construct => {
    if (Stage.isStage(construct)) {
      for (const plugin of construct._validationPlugins) {
        if (!templatePathsByPlugin.has(plugin)) {
          templatePathsByPlugin.set(plugin, []);
        }
        let assemblyToUse = assemblies.get(construct.artifactId);
        if (!assemblyToUse) throw new AssumptionError(lit`ValidationFailed`, `Validation failed, cannot find cloud assembly for stage ${construct.stageName}`);
        templatePathsByPlugin.get(plugin)!.push(...assemblyToUse.stacksRecursively.map(stack => stack.templateFullPath));
      }
    }
  });

  // Build the unified list of plugins to run
  const plugins: Array<PendingPluginInvocation> = [];

  // 1. User-registered plugins
  for (const [plugin, paths] of templatePathsByPlugin.entries()) {
    plugins.push({ plugin, templatePaths: paths });
  }

  // 2. Default validation engine (always runs, unless user registered one explicitly)
  if (!hasUserRegisteredCloudFormationValidatePlugin(root)) {
    const defaultEnginePaths = assembly.stacksRecursively.map(s => s.templateFullPath);
    if (defaultEnginePaths.length > 0) {
      plugins.push({ plugin: CloudFormationValidatePlugin._singletonInstance(), templatePaths: defaultEnginePaths });
    }
  }
  // 3. Construct annotations (as a plugin, only if there are annotations to report)
  if (FeatureFlags.of(root).isEnabled(cxapi.ANNOTATIONS_IN_VALIDATION_REPORT)) {
    const annotationReport = collectAnnotationReport(root, assembly.directory);
    if (annotationReport) {
      plugins.push({ plugin: new AnnotationPlugin(annotationReport), templatePaths: [] });
    }
  }

  if (plugins.length === 0) return;

  const reports: NamedValidationPluginReport[] = doInvokeValidationPlugins(outdir, plugins, root);

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

const CUSTOM_SYNTHESIS_SYM = Symbol.for('@aws-cdk/core:customSynthesis');

/**
 * Interface for constructs that want to do something custom during synthesis
 */
export interface ICustomSynthesis {
  /**
   * Called when the construct is synthesized
   */
  onSynthesize(session: ISynthesisSession): void;
}

interface PendingPluginInvocation {
  plugin: IPolicyValidationPlugin;
  templatePaths: string[];
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
function doInvokeValidationPlugins(outdir: string, plugins: PendingPluginInvocation[], root: App) {
  const preExistingFileHashes = snapshotFileHashes(outdir);

  // Run all plugins through the same loop
  const reports: NamedValidationPluginReport[] = [];
  for (const { plugin, templatePaths } of plugins) {
    try {
      const report = plugin.validate({ templatePaths, appConstruct: root });
      reports.push({ ...report, pluginName: plugin.name, pluginVersion: plugin.version });
    } catch (e: any) {
      reports.push(mkPluginFailure(plugin, e));
    }
    if (hasModifiedPreExistingFiles(preExistingFileHashes)) {
      throw new AssumptionError(lit`IllegalOperationValidationPlugin`, `Illegal operation: validation plugin '${plugin.name}' modified the cloud assembly`);
    }
  }
  return reports;
}

export function addCustomSynthesis(construct: IConstruct, synthesis: ICustomSynthesis): void {
  Object.defineProperty(construct, CUSTOM_SYNTHESIS_SYM, {
    value: synthesis,
    enumerable: false,
  });
}

function getCustomSynthesis(construct: IConstruct): ICustomSynthesis | undefined {
  return (construct as any)[CUSTOM_SYNTHESIS_SYM];
}

/**
 * Find Assemblies inside the construct and call 'synth' on them
 *
 * (They will in turn recurse again)
 */
function synthNestedAssemblies(root: IConstruct, options: StageSynthesisOptions) {
  for (const child of root.node.children) {
    if (Stage.isStage(child)) {
      child.synth(options);
    } else {
      synthNestedAssemblies(child, options);
    }
  }
}

/**
 * Invoke aspects on the given construct tree.
 *
 * Aspects are not propagated across Assembly boundaries. The same Aspect will not be invoked
 * twice for the same construct.
 */
function invokeAspects(root: IConstruct) {
  const invokedByPath: { [nodePath: string]: AspectApplication[] } = { };

  let nestedAspectWarning = false;
  recurse(root, []);

  function recurse(construct: IConstruct, inheritedAspects: AspectApplication[]) {
    const node = construct.node;
    const aspects = Aspects.of(construct);

    let localAspects = getAspectApplications(construct);
    const allAspectsHere = sortAspectsByPriority(inheritedAspects, localAspects);

    const nodeAspectsCount = aspects.all.length;
    for (const aspectApplication of allAspectsHere) {
      let invoked = invokedByPath[node.path];
      if (!invoked) {
        invoked = invokedByPath[node.path] = [];
      }

      if (invoked.some(invokedApp => invokedApp.aspect === aspectApplication.aspect)) {
        continue;
      }

      aspectApplication.aspect.visit(construct);

      // if an aspect was added to the node while invoking another aspect it will not be invoked, emit a warning
      // the `nestedAspectWarning` flag is used to prevent the warning from being emitted for every child
      if (!nestedAspectWarning && nodeAspectsCount !== aspects.all.length) {
        Annotations.of(construct).addWarningV2('@aws-cdk/core:ignoredAspect', 'We detected an Aspect was added via another Aspect, and will not be applied');
        nestedAspectWarning = true;
      }

      // mark as invoked for this node
      invoked.push(aspectApplication);
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        recurse(child, allAspectsHere);
      }
    }
  }
}

/**
 * Invoke aspects V2 runs a stabilization loop and allows Aspects to invoke other Aspects.
 * Runs if the feature flag '@aws-cdk/core:aspectStabilization' is enabled.
 *
 * Unlike the original function, this function does not emit a warning for ignored aspects, since this
 * function invokes Aspects that are created by other Aspects.
 *
 * Throws an error if the function attempts to invoke an Aspect on a node that has a lower priority value
 * than the most recently invoked Aspect on that node.
 */
function invokeAspectsV2(root: IConstruct) {
  const invokedByPath = new Map<string, AspectApplication[]>();

  recurse(root, []);

  for (let i = 0; i <= 100; i++) {
    const didAnythingToTree = recurse(root, []);

    // Keep on invoking until nothing gets invoked anymore
    if (didAnythingToTree === 'nothing') {
      return;
    }
  }

  throw new UnscopedValidationError(lit`PossibleInfiniteLoopDetected`, 'We have detected a possible infinite loop while invoking Aspects. Please check your Aspects and verify there is no configuration that would cause infinite Aspect or Node creation.');

  function recurse(construct: IConstruct, inheritedAspects: AspectApplication[]): 'invoked' | 'abort-recursion' | 'nothing' {
    const node = construct.node;

    let ret: ReturnType<typeof recurse> = 'nothing';
    const currentAspectTreeRevision = _aspectTreeRevisionReader(construct);
    const versionAtStart = currentAspectTreeRevision();

    const allAspectsHere = sortAspectsByPriority(inheritedAspects, getAspectApplications(construct));
    for (const aspectApplication of allAspectsHere) {
      let invoked = invokedByPath.get(node.path);
      if (!invoked) {
        invokedByPath.set(node.path, invoked = []);
      }

      if (invoked.some(invokedApp => invokedApp.aspect === aspectApplication.aspect)) {
        continue;
      }

      // If the last invoked Aspect has a higher priority than the current one, throw an error:
      const lastInvokedAspect = invoked[invoked.length - 1];
      if (lastInvokedAspect && lastInvokedAspect.priority > aspectApplication.priority) {
        throw new UnscopedValidationError(lit`CannotInvokeAspectWithLowerPriority`,
          `Cannot invoke Aspect ${aspectApplication.aspect.constructor.name} with priority ${aspectApplication.priority} on node ${node.path}: an Aspect ${lastInvokedAspect.aspect.constructor.name} with a lower priority (added at ${lastInvokedAspect.construct.node.path} with priority ${lastInvokedAspect.priority}) was already invoked on this node.`,
        );
      }

      aspectApplication.aspect.visit(construct);

      ret = 'invoked';

      // mark as invoked for this node
      invoked.push(aspectApplication);

      // If this aspect added another aspect, we need to reconsider everything;
      // it might have added an aspect above us and we need to restart the
      // entire tree. This could probably be made more efficient, but restarting
      // the tree from the top currently does it as well.
      if (currentAspectTreeRevision() !== versionAtStart) {
        return 'abort-recursion';
      }
    }

    for (const child of construct.node.children) {
      if (!Stage.isStage(child)) {
        const childDidSomething = recurse(child, allAspectsHere);
        ret = childDidSomething !== 'nothing' ? childDidSomething : ret;

        if (ret === 'abort-recursion') {
          break;
        }
      }
    }

    return ret;
  }
}

/**
 * Given two lists of AspectApplications (inherited and locally defined), this function returns a list of
 * AspectApplications ordered by priority. For Aspects of the same priority, inherited Aspects take precedence.
 */
function sortAspectsByPriority(inheritedAspects: AspectApplication[], localAspects: AspectApplication[]): AspectApplication[] {
  const allAspects = [...inheritedAspects, ...localAspects].sort((a, b) => {
    // Compare by priority first
    if (a.priority !== b.priority) {
      return a.priority - b.priority; // Ascending order by priority
    }
    // If priorities are equal, give preference to inheritedAspects
    const isAInherited = inheritedAspects.includes(a);
    const isBInherited = inheritedAspects.includes(b);
    if (isAInherited && !isBInherited) return -1; // a comes first
    if (!isAInherited && isBInherited) return 1; // b comes first
    return 0; // Otherwise, maintain original order
  });
  return allAspects;
}

/**
 * Helper function to get aspect applications.
 * If `Aspects.applied` is available, it is used; otherwise, create AspectApplications from `Aspects.all`.
 */
function getAspectApplications(node: IConstruct): AspectApplication[] {
  const aspects = Aspects.of(node);
  if (aspects.applied !== undefined) {
    return aspects.applied;
  }

  // Fallback: Create AspectApplications from `aspects.all`
  const typedAspects = aspects as Aspects;
  return typedAspects.all.map(aspect => new AspectApplication(node, aspect, AspectPriority.DEFAULT));
}

/**
 * Find all stacks and add Metadata Resources to all of them
 *
 * There is no good generic place to do this. Can't do it in the constructor
 * (because adding a child construct makes it impossible to set context on the
 * node), and the generic prepare phase is deprecated.
 *
 * Only do this on [parent] stacks (not nested stacks), don't do this when
 * disabled by the user.
 *
 * Also, only when running via the CLI. If we do it unconditionally,
 * all unit tests everywhere are going to break massively. I've spent a day
 * fixing our own, but downstream users would be affected just as badly.
 *
 * Stop at Assembly boundaries.
 */
function injectMetadataResources(root: IConstruct) {
  visit(root, 'post', construct => {
    if (!Stack.isStack(construct) || !construct._versionReportingEnabled) { return; }

    // Because of https://github.com/aws/aws-cdk/blob/main/packages/assert-internal/lib/synth-utils.ts#L74
    // synthesize() may be called more than once on a stack in unit tests, and the below would break
    // if we execute it a second time. Guard against the constructs already existing.
    const CDKMetadata = 'CDKMetadata';
    if (construct.node.tryFindChild(CDKMetadata)) { return; }

    new MetadataResource(construct, CDKMetadata);
  });
}

/**
 * Find the root App and add the TreeMetadata resource (if enabled).
 *
 * There is no good generic place to do this. Can't do it in the constructor
 * (because adding a child construct makes it impossible to set context on the
 * node), and the generic prepare phase is deprecated.
 */
function injectTreeMetadata(root: IConstruct) {
  visit(root, 'post', construct => {
    if (!App.isApp(construct) || !construct._treeMetadata) return;
    const CDKTreeMetadata = 'Tree';
    if (construct.node.tryFindChild(CDKTreeMetadata)) return;
    new TreeMetadata(construct);
  });
}

/**
 * Synthesize children in post-order into the given builder
 *
 * Stop at Assembly boundaries.
 */
function synthesizeTree(root: IConstruct, builder: private_cxapi.CloudAssemblyBuilder, validateOnSynth: boolean = false) {
  visit(root, 'post', construct => {
    const session = {
      outdir: builder.outdir,
      assembly: _convertCloudAssemblyBuilder(builder),
      validateOnSynth,
    };

    if (Stack.isStack(construct)) {
      construct.synthesizer.synthesize(session);
    } else if (construct instanceof TreeMetadata) {
      construct._synthesizeTree(session);
    } else {
      const custom = getCustomSynthesis(construct);
      custom?.onSynthesize(session);
    }
  });
}

interface ValidationError {
  readonly message: string;
  readonly source: IConstruct;
}

/**
 * Validate all constructs in the given construct tree
 */
function validateTree(root: IConstruct) {
  const errors = new Array<ValidationError>();

  visit(root, 'pre', construct => {
    for (const message of construct.node.validate()) {
      errors.push({ message, source: construct });
    }
  });

  if (errors.length > 0) {
    const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
    throw new UnscopedValidationError(lit`ValidationFailedWithErrors`, `Validation failed with the following errors:\n  ${errorList}`);
  }
}

/**
 * Visit the given construct tree in either pre or post order, only looking at Assemblies
 */
function visitAssemblies(root: IConstruct, order: 'pre' | 'post', cb: (x: IConstruct) => void) {
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

/**
 * Visit the given construct tree in either pre or post order, stopping at Assemblies
 */
function visit(root: IConstruct, order: 'pre' | 'post', cb: (x: IConstruct) => void) {
  if (order === 'pre') {
    cb(root);
  }

  for (const child of root.node.children) {
    if (Stage.isStage(child)) { continue; }
    visit(child, order, cb);
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
