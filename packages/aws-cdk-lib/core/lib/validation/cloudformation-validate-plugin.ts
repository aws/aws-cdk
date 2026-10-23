import * as fs from 'fs';
import * as path from 'path';
import { CompositeEngine, TemplateFile, version } from '@aws/cloudformation-validate';
import type { AdditionalSchemaSource, CompositeEngineConfig, Engine, RuleInfo, Severity } from '@aws/cloudformation-validate';
import type { PolicyValidationPluginReport, PolicyViolatingResource } from './report';
import type { IPolicyValidationPlugin, IPolicyValidationContext } from './validation';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';
import { profileSpan, recordPerformanceEntry } from '../private/perf';
import type { RegoRuleIndex } from './private/rego-rule-index-types';

const VALIDATE_METRIC = 'CloudFormationValidate.validate';
const DIAGNOSTICS_METRIC = 'CloudFormationValidate.diagnostics';

interface MutableViolation {
  ruleName: string;
  description: string;
  severity?: string;
  fix?: string;
  violatingResources: PolicyViolatingResource[];
  ruleMetadata?: { readonly [key: string]: string };
}

/**
 * A custom rule source for the validation engine.
 */
export interface ValidationRuleSource {
  /**
   * The name of the rule source.
   */
  readonly name: string;

  /**
   * The rule content (e.g., Rego policy source code).
   */
  readonly content: string;
}

/**
 * Properties for configuring the CloudFormationValidatePlugin.
 */
export interface CloudFormationValidatePluginProps {
  /**
   * Custom Rego rules to evaluate in addition to built-in rules.
   *
   * @default - no custom rules
   */
  readonly regoRules?: ValidationRuleSource[];

  /**
   * Custom Guard rules to evaluate in addition to built-in rules.
   *
   * @default - no guard rules
   */
  readonly guardRules?: ValidationRuleSource[];

  /**
   * Whether to evaluate the default Rego rules that ship with the CDK.
   *
   * Registering a `CloudFormationValidatePlugin` explicitly replaces the
   * auto-registered default instance, so without this flag adding custom
   * rules would silently drop the CDK default rules. Individual default
   * rules can be suppressed by ID via `Validations.of(scope).acknowledge()`.
   *
   * @default true
   */
  readonly includeDefaultRules?: boolean;

  /**
   * Path to a directory containing additional CloudFormation resource provider
   * schema files (JSON) to merge with the bundled schemas.
   *
   * The directory should contain **only** valid CFN resource provider schema
   * files. All `.json` files found (recursively) are treated as schemas and
   * must contain a valid JSON object with a `typeName` field. Non-JSON files
   * (e.g., `.keep`, `.md`) are safely ignored.
   *
   * Fails hard on invalid JSON or missing `typeName` in `.json` files to
   * prevent silent validation gaps.
   *
   * Use case: validating templates that use pre-GA CloudFormation properties
   * not yet in the published registry (e.g., from spec2cdk/temporary-schemas).
   *
   * @default - no additional schemas
   * @internal
   */
  readonly _additionalSchemasDirectory?: string;
}

/**
 * Validation plugin that uses the CloudFormation validation engine
 * to evaluate templates against built-in rules.
 */
export class CloudFormationValidatePlugin implements IPolicyValidationPlugin {
  /**
   * The default name of this plugin
   */
  public static readonly PLUGIN_NAME = 'CloudFormation Validate';

  /**
   * Return a global singleton instance of this plugin.
   *
   * This is used because initializing the engine is somewhat expensive, which makes
   * a noticeable difference in tests.
   *
   * @internal
   */
  public static _singletonInstance() {
    if (!CloudFormationValidatePlugin._instance) {
      CloudFormationValidatePlugin._instance = new CloudFormationValidatePlugin();
    }
    return CloudFormationValidatePlugin._instance;
  }

  /**
   * Pre-configure the singleton with specific props before first access.
   * Used by test infrastructure to inject schema overlays without per-App registration.
   *
   * Must be called before any App synthesis triggers `_singletonInstance()`.
   * Calling this when a singleton already exists replaces it.
   *
   * @internal
   */
  public static _configureSingleton(props: CloudFormationValidatePluginProps) {
    CloudFormationValidatePlugin._disposeSingleton();
    CloudFormationValidatePlugin._instance = new CloudFormationValidatePlugin(props);
  }

  /**
   * Release the validator engine’s off-heap WASM memory and forget the instance
   *
   * @internal
   */
  public static _disposeSingleton() {
    CloudFormationValidatePlugin._instance?._dispose();
    CloudFormationValidatePlugin._instance = undefined;
  }

  private static _instance: CloudFormationValidatePlugin | undefined;

  public readonly name = CloudFormationValidatePlugin.PLUGIN_NAME;

  private readonly props: CloudFormationValidatePluginProps;

  /**
   * Schema overlays, loaded eagerly so that a bad schema directory fails on
   * plugin construction rather than at first validation.
   */
  private readonly additionalSchemas?: AdditionalSchemaSource[];

  /**
   * Engine without any of the default Rego rules.
   *
   * Also the engine used by templates that match no default rule at all, which
   * is the overwhelmingly common case.
   */
  private baseEngine?: Engine;

  /**
   * Engine for the most recently requested set of default Rego rules.
   *
   * Only one is retained: an app validates all of its stacks in a single
   * `validate()` call, so this is reused across stacks, and holding on to
   * engines for rule sets we are done with would waste WASM memory.
   */
  private ruleEngine?: { readonly key: string; readonly engine: Engine };

  private disposed = false;

  constructor(props: CloudFormationValidatePluginProps = {}) {
    this.props = props;
    this.additionalSchemas = props._additionalSchemasDirectory
      ? loadSchemasFromDirectory(props._additionalSchemasDirectory)
      : undefined;
  }

  /**
   * Release the validator engine’s off-heap WASM memory
   *
   * @internal
   */
  public _dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.baseEngine?.free();
    this.baseEngine = undefined;
    this.ruleEngine?.engine.free();
    this.ruleEngine = undefined;
  }

  public get version(): string | undefined {
    return version();
  }

  public get ruleIds(): string[] | undefined {
    // The engine does not report custom Rego rule IDs, so the base engine lists
    // exactly the same rules as any other and we avoid paying for rule loading
    // just to answer this (analytics-only) question.
    return this.engineWithRules([]).listRules()
      // Pretend the ignored rules don't exist
      .filter((r: RuleInfo) => !IGNORE_RULES.has(r.id) && r.severity !== 'INFO' && r.severity !== 'DEBUG')
      .map((r: RuleInfo) => r.id);
  }

  public validate(context: IPolicyValidationContext): PolicyValidationPluginReport {
    const violations: MutableViolation[] = [];

    const engine = this.engineForTemplates(context.stackTemplates.map(t => t.templatePath));

    for (const { stackConstructPath, templatePath, accountId, region } of context.stackTemplates) {
      const templateFile = new TemplateFile(templatePath);
      const report = (() => {
        using _span = profileSpan(VALIDATE_METRIC, { telemetry: true });

        return engine.validateTemplate(templateFile, {
          detailLevel: 'STANDARD',
          pseudoParameterOverrides: {
            accountId,
            region,
          },
          exclude: {
            ids: [...IGNORE_RULES],
            services: [{
              // CDK still synthesizes AWS::AutoScaling::LaunchConfiguration for applications using
              // the legacy launch-configuration behavior. Auto Scaling remains deployable despite
              // its maintenance-mode classification, so suppress only its W3697 lifecycle warning
              // rather than hiding lifecycle findings for every service.
              // <https://github.com/aws-cloudformation/cloudformation-validate/issues/37>
              ruleId: 'W3697',
              service: 'AWS::AutoScaling',
            }],
          },
          severityLevel: 'WARN',
        });
      })();

      recordPerformanceEntry(DIAGNOSTICS_METRIC, {
        count: report.diagnostics.length,
        telemetry: true,
      });
      const diagnosticsBySeverity = new Map<Severity, number>();

      for (const diagnostic of report.diagnostics) {
        diagnosticsBySeverity.set(diagnostic.severity, (diagnosticsBySeverity.get(diagnostic.severity) ?? 0) + 1);
      }

      for (const [severity, count] of diagnosticsBySeverity) {
        recordPerformanceEntry(`${DIAGNOSTICS_METRIC}.${severity}`, {
          count,
          telemetry: true,
        });
      }

      for (const diagnostic of report.diagnostics) {
        const severity = mapSeverity(diagnostic.severity);

        const resourceLogicalId = diagnostic.entity?.entityType === 'Resource'
          ? diagnostic.entity.logicalId
          : undefined;

        const violatingResource: PolicyViolatingResource = {
          resourceLogicalId,
          // If this is not about any resources, best we can do is point it to the stack
          constructPath: !resourceLogicalId ? stackConstructPath : undefined,
          templatePath,
          locations: diagnostic.propertyPath ? [diagnostic.propertyPath] : [],
        };

        const propertyPathPefix = diagnostic.propertyPath ? `${diagnostic.propertyPath.replace(/^Properties\./, '')}: ` : '';
        const description = `${propertyPathPefix}${diagnostic.message}`;

        // Only diagnostics with the same description share a violation, so each
        // violating resource is reported with its own message.
        const existing = violations.find(
          v => v.ruleName === diagnostic.ruleId && v.severity === severity && v.description === description,
        );

        if (existing) {
          existing.violatingResources.push(violatingResource);
        } else {
          violations.push({
            ruleName: diagnostic.ruleId,
            description,
            severity,
            fix: diagnostic.suggestedFix,
            violatingResources: [violatingResource],
            ruleMetadata: diagnostic.category ? { category: diagnostic.category } : undefined,
          });
        }
      }
    }

    return {
      success: violations.every(v => v.severity !== 'error' && v.severity !== 'fatal'),
      violations,
    };
  }

  /**
   * The engine to validate the given templates with.
   *
   * Only the default rules that can fire on a resource type occurring in one of
   * the templates are loaded. Loading any Rego rule at all has a fixed cost of
   * roughly 150ms, so apps that use none of the covered resource types (most of
   * them) should not be loading rules in the first place.
   */
  private engineForTemplates(templatePaths: string[]): Engine {
    if (!(this.props.includeDefaultRules ?? true)) {
      return this.engineWithRules([]);
    }

    const resourceTypes = new Set<string>();
    for (const templatePath of templatePaths) {
      for (const type of resourceTypesInTemplate(templatePath)) {
        resourceTypes.add(type);
      }
    }

    const applicable = defaultRegoRuleIndex().rules.filter(
      rule => rule.types === null || rule.types.some(type => resourceTypes.has(type)),
    );

    return this.engineWithRules(applicable.map(rule => rule.file));
  }

  /**
   * An engine with the given default rule files loaded, creating it if necessary.
   */
  private engineWithRules(ruleFiles: string[]): Engine {
    if (this.disposed) {
      throw new UnscopedValidationError(lit`ValidationEngineDisposed`,
        '[CloudFormation Validate] the validation engine has already been disposed',
      );
    }

    if (ruleFiles.length === 0) {
      return this.baseEngine ??= new CompositeEngine(this.engineConfig([]));
    }

    const key = ruleFiles.join(',');
    if (this.ruleEngine?.key !== key) {
      this.ruleEngine?.engine.free();
      this.ruleEngine = { key, engine: new CompositeEngine(this.engineConfig(ruleFiles)) };
    }
    return this.ruleEngine.engine;
  }

  private engineConfig(ruleFiles: string[]): CompositeEngineConfig {
    const config: CompositeEngineConfig = {};
    const regoRules = [
      ...ruleFiles.map(file => ({
        name: file,
        content: fs.readFileSync(path.join(RULES_DIRECTORY, file), 'utf-8'),
      })),
      // Rules handed to us by the user are always loaded; we have no index for those.
      ...this.props.regoRules ?? [],
    ];
    if (regoRules.length > 0) {
      config.regoRules = regoRules;
    }
    if (this.props.guardRules) {
      config.guardRules = this.props.guardRules;
    }
    if (this.additionalSchemas) {
      config.schemaValidatorConfig = {
        additionalSchemas: this.additionalSchemas,
      };
    }
    return config;
  }
}

/**
 * The resource types used in a synthesized template.
 *
 * A template we cannot read or parse contributes no types; the validation run
 * itself will produce a better diagnostic about it than we could here.
 */
function resourceTypesInTemplate(templatePath: string): string[] {
  let template: any;
  try {
    template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
  } catch {
    return [];
  }

  return Object.values(template?.Resources ?? {})
    .map((resource: any) => resource?.Type)
    .filter((type): type is string => typeof type === 'string');
}

function mapSeverity(severity: Severity): string {
  switch (severity) {
    // FIXME: Temporarily map FATAL to ERROR; FATALs are not suppressible but there are still a lot
    // of false positives in the engine, and we cannot afford to accidentally present a customer with
    // an accidentally unsupressible fatal.
    case 'FATAL': return 'error';
    case 'ERROR': return 'error';
    case 'WARN': return 'warning';
    case 'INFO': return 'informational';
    case 'DEBUG': return 'debug';
    default: return 'warning';
  }
}

/**
 * Directory holding the CDK-authored default Rego rules, shipped with aws-cdk-lib.
 *
 * These are ports of L2 construct validations to template-level rules, so the
 * same checks also apply to templates produced via L1 constructs, escape
 * hatches, or `CfnInclude`.
 */
const RULES_DIRECTORY = path.join(__dirname, 'rules');

let ruleIndex: RegoRuleIndex | undefined;

/**
 * The applicability index, generated at build time by
 * `core/build-tools/generate-rego-rule-index.ts`.
 */
function defaultRegoRuleIndex(): RegoRuleIndex {
  if (!ruleIndex) {
    const indexFile = path.join(RULES_DIRECTORY, 'index.generated.json');
    ruleIndex = JSON.parse(fs.readFileSync(indexFile, 'utf-8')) as RegoRuleIndex;
  }
  return ruleIndex;
}

// Rules that the engine will report but we want to ignore because CDK creates
// the violation and customers don't control it.
const IGNORE_RULES = new Set([
  // WHAT: 'DependsOn' already implied by a 'GetAtt', remove the DependsOn.
  // WHY: CDK adds both. It doesn't hurt to have both, and it's more effort to remove them.
  // Will be silenced forever.
  'W3005',

  // WHAT: Optimize the format string of Fn::Sub
  // WHY: CDK is generating these, humans are not authoring them.
  // Will be silenced forever.
  'W1020',

  // WHAT: Fn::GetStackOutput is not an allowed direct source for Fn::Split.
  // WHY: CDK generates this nesting when deserializing weak string-list cross-stack references,
  // and customers cannot control the generated expression.
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference-split.html
  'E1018',

  // WHAT: Hardcoded ARNs
  // WHY: Hardcoding an ARN is part of the behavior of some constructs (e.g., setting up multi-account DynamoDB table replicas)
  'W9002',

  // WHAT: Hardcoded account IDs in ARNs
  // WHY: Hardcoding an account ID in ARNs is commonly done in CDK when we are setting up large applications that
  // span accounts.
  'W9013',

  // WHAT: built-in function not recognized
  // WHY: there are intrinsic functions that the plugin doesn't know about that are nevertheless valid.
  // This diagnostic is intended to protect against typos in templates, but since the intrinsics
  // are generated by CDK the chances of mistyping them is tiny, and so this diagnostic is more verbose
  // than it's worth.
  'W1103',
]);

/**
 * Check if `child` is contained within `root` using path.relative.
 * Avoids the startsWith prefix-collision bug (e.g., /tmp/schemas vs /tmp/schemas-evil).
 */
function isContainedWithin(root: string, child: string): boolean {
  const rel = path.relative(root, child);
  return !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * Maximum directory depth for recursive schema discovery.
 * The expected layout is temporary-schemas/<region>/<file>.json (depth 2).
 */
const MAX_SCHEMA_DIRECTORY_DEPTH = 5;

/**
 * Recursively discover and load CFN resource provider schema files from a directory.
 * Each file must be a valid JSON file with a "typeName" field.
 *
 * Fails hard on any unexpected condition — these indicate misconfiguration
 * or a compromised filesystem, and silently degrading would weaken the
 * validation gate without any signal.
 *
 * @throws Error on symlinks, path escape, depth exceeded, invalid JSON, or missing typeName
 */
function loadSchemasFromDirectory(dir: string): AdditionalSchemaSource[] {
  const schemas: AdditionalSchemaSource[] = [];
  if (!fs.existsSync(dir)) {
    return schemas;
  }

  const rootReal = fs.realpathSync(dir);

  function walk(currentDir: string, depth: number) {
    if (depth > MAX_SCHEMA_DIRECTORY_DEPTH) {
      throw new UnscopedValidationError(lit`SchemaLoadError`,
        `[CloudFormation Validate] Schema directory exceeds maximum depth of ${MAX_SCHEMA_DIRECTORY_DEPTH}: ${currentDir}`,
      );
    }

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isSymbolicLink()) {
        throw new UnscopedValidationError(lit`SchemaLoadError`,
          `[CloudFormation Validate] Symbolic link found in schema directory (not allowed): ${fullPath}`,
        );
      }

      if (entry.isDirectory()) {
        const resolved = fs.realpathSync(fullPath);
        if (!isContainedWithin(rootReal, resolved)) {
          throw new UnscopedValidationError(lit`SchemaLoadError`,
            `[CloudFormation Validate] Path escapes schema root directory: ${fullPath} resolves to ${resolved}`,
          );
        }
        walk(fullPath, depth + 1);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        let parsed: any;
        try {
          parsed = JSON.parse(content);
        } catch (e) {
          throw new UnscopedValidationError(lit`SchemaLoadError`,
            `[CloudFormation Validate] Invalid JSON in schema file: ${fullPath}: ${e}`,
          );
        }
        if (!parsed.typeName) {
          throw new UnscopedValidationError(lit`SchemaLoadError`,
            `[CloudFormation Validate] Schema file missing required "typeName" field: ${fullPath}`,
          );
        }
        schemas.push({
          typeName: parsed.typeName,
          schema: content,
        });
      }
    }
  }

  walk(rootReal, 0);

  if (schemas.length > 0) {
    // Audit trail: log which overlays were loaded so stale ones are detectable
    const typeNames = schemas.map(s => s.typeName).join(', ');
    process.stderr.write(`[CloudFormation Validate] Loaded ${schemas.length} schema overlay(s): ${typeNames}\n`);
  }

  return schemas;
}
