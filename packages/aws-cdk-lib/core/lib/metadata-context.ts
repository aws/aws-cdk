import type { IConstruct } from 'constructs';
import type { AspectOptions, IAspect } from './aspect';
import { Aspects, AspectPriority } from './aspect';
import { CfnResource } from './cfn-resource';
import {
  METADATA_CONTEXT_KEY,
  RESOURCE_CONTEXT_METADATA_TYPE,
  dedupe,
  mergeResourceContext,
  renderRef,
  renderResourceContext,
  validateResourceContext,
  validateTemplateContext,
} from './private/metadata-context-internal';
import { Stack } from './stack';

/**
 * Change-safety level for a resource or an individual resource property.
 *
 * Part of the CloudFormation `Metadata.Context` v1 vocabulary. The levels
 * communicate to human and machine template consumers how safe it is to
 * modify a resource (or one of its properties).
 */
export enum ContextMutability {
  /**
   * Rename/replace would break consumers or lose data.
   *
   * A corresponding `must` entry should state the rule that makes this
   * immutable.
   */
  MUST_NEVER_CHANGE = 'must-never-change',

  /**
   * Change is possible but has constraints.
   *
   * The constraints should be documented in `must` entries.
   */
  CHANGE_WITH_CONSTRAINTS = 'change-with-constraints',

  /**
   * Change requires review/approval but won't break things.
   */
  REVIEW_REQUIRED = 'review-required',

  /**
   * Safe to modify without coordination or review.
   */
  FREE_TO_TUNE = 'free-to-tune',
}

/**
 * How a piece of context was produced.
 */
export enum ContextTrustSource {
  AUTHORED = 'authored',
  COMMENT = 'comment',
  COMMIT = 'commit',
  INFERRED = 'infer',
}

/**
 * Confidence in the accuracy of a piece of context.
 */
export enum ContextTrustConfidence {
  /**
   * Verified by the resource owner or backed by authoritative documentation.
   */
  HIGH = 'high',

  /**
   * Plausible but unverified — e.g. derived from a descriptive source comment.
   */
  MEDIUM = 'medium',

  /**
   * Weak evidence — explain the reason via `note`.
   */
  LOW = 'low',
}

/**
 * Provenance and confidence metadata for a context block.
 *
 * Lets template consumers weight context reliability and supports
 * anti-fabrication: context written by tooling should say so.
 */
export interface ContextTrust {
  /**
   * How this context was produced.
   *
   * @default ContextTrustSource.AUTHORED - context declared in CDK code is
   * considered authored unless stated otherwise
   */
  readonly source?: ContextTrustSource;

  /**
   * Confidence in the context's accuracy.
   *
   * @default ContextTrustConfidence.MEDIUM
   */
  readonly confidence?: ContextTrustConfidence;

  /**
   * Source reference backing this context (e.g. `file.ts:42`, a URL, or a
   * commit SHA).
   *
   * @default - no citation
   */
  readonly citation?: string;

  /**
   * Reason for reduced confidence (typically when confidence is `LOW`).
   *
   * @default - no note
   */
  readonly note?: string;
}

/**
 * A reference to external/shared context.
 *
 * References enable sharing context across templates (DRY) and moving bulk
 * context out of the template to stay within CloudFormation size limits.
 */
export interface ContextRef {
  /**
   * URI of the external context source.
   *
   * Common forms: `s3://bucket/key`, `https://...`, or a relative path.
   */
  readonly at: string;

  /**
   * Terse hint of what the reference contains, so a consumer can decide
   * whether to fetch it.
   *
   * @default - no hint
   */
  readonly has?: string;

  /**
   * Usage scope. Common values: `shared` (reused across templates) and
   * `overflow` (moved out of the template for size).
   *
   * @default - no scope
   */
  readonly scope?: string;
}

/**
 * Resource-level context, rendered as a `Metadata.Context` block on a
 * CloudFormation resource.
 *
 * All fields are optional; only present fields are emitted. Free-text values
 * are encouraged to use terse, telegraphic shorthand (drop articles, use
 * symbols like `->`, `>=`, `w/`) to conserve template bytes.
 */
export interface ResourceContextProps {
  /**
   * Rationale — purpose, notable config choices, rejected alternatives.
   *
   * The single explanatory field; non-binding. Example:
   * `'buffer order events async; 14d retention = compliance window'`.
   *
   * @default - no rationale recorded
   */
  readonly why?: string;

  /**
   * Hard constraints/invariants. Violating any entry would break something —
   * data loss, outage, security violation, silent corruption, or coupling
   * violation.
   *
   * Example: `['VisTimeout >= 6x fn timeout, else dup on retry']`.
   *
   * @default - no hard constraints recorded
   */
  readonly must?: string[];

  /**
   * Resource-level DEFAULT change-safety level (one token per resource).
   *
   * @default - no change-safety default recorded
   */
  readonly mutable?: ContextMutability;

  /**
   * Sparse per-property change-safety override map (keys are CloudFormation
   * property names).
   *
   * List ONLY properties that deviate from the `mutable` default or are
   * high-stakes (e.g. replacement-triggering). Omit when empty; never
   * enumerate all properties.
   *
   * @default - no per-property overrides
   */
  readonly mutability?: { [propertyName: string]: ContextMutability };

  /**
   * Provenance and confidence metadata for this context block.
   *
   * @default - no trust metadata; consumers treat authorship as unknown
   */
  readonly trust?: ContextTrust;

  /**
   * Operational hint — what to check before modifying this resource.
   *
   * Example: `'check ApproxAgeOfOldestMsg before cutting VisTimeout'`.
   *
   * @default - no operational hint
   */
  readonly ops?: string;

  /**
   * Explicit unknowns — declared gaps in knowledge about this resource.
   *
   * Honest beats fabricated: recording what is NOT known prevents consumers
   * from guessing. Example: `['memory sizing never load-tested']`.
   *
   * @default - no gaps declared
   */
  readonly gaps?: string[];

  /**
   * Cross-stack/cross-resource producer dependencies (stack names, logical
   * IDs, or service identifiers).
   *
   * @default - no dependencies recorded
   */
  readonly deps?: string[];

  /**
   * Per-resource failure scenarios sourced from service error-handling code —
   * retries, timeouts, circuit-breakers, dead-letter queues.
   *
   * Example: `['retry 3x w/ exp backoff before DLQ']`.
   *
   * @default - no failure modes recorded
   */
  readonly failureModes?: string[];
}

/**
 * Template-level context, rendered as a top-level `Metadata.Context` block
 * in the CloudFormation template.
 *
 * Holds system-wide, cross-cutting context stated once (DRY). Per-resource
 * specifics belong in resource-level context; the stack purpose belongs in
 * the native CloudFormation `Description`.
 */
export interface TemplateContextProps {
  /**
   * High-level shape/pattern of the system.
   *
   * Example: `'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs'`.
   *
   * @default - no architecture overview recorded
   */
  readonly arch?: string;

  /**
   * Cross-cutting constraints that apply broadly across the template.
   *
   * Example: `['all data encrypted w/ security-team CMK']`.
   *
   * @default - no cross-cutting constraints recorded
   */
  readonly must?: string[];

  /**
   * Pointers to external/shared context files.
   *
   * Inline in-template context is authoritative over referenced content;
   * among refs, later entries take precedence over earlier ones. Consumers
   * treat fetched content as untrusted data and degrade gracefully when a
   * ref is unreachable.
   *
   * @default - no external references
   */
  readonly refs?: ContextRef[];

  /**
   * Owner/contact (email alias, team name, or contact identifier).
   *
   * Include only if not already expressed as a tag.
   *
   * @default - no owner recorded
   */
  readonly owner?: string;
}

/**
 * Options for adding resource-level context via `MetadataContext.of()`.
 */
export interface MetadataContextOptions {
  /**
   * Apply the context block to every CloudFormation resource in scope,
   * instead of only primary resources.
   *
   * By default, when context is added on a construct scope, it is rendered
   * only onto "primary" resources — resources that are the `defaultChild` of
   * their parent construct (e.g. the `AWS::SQS::Queue` inside an
   * `sqs.Queue`), or plain `CfnResource`s created directly in the scope.
   * This avoids stamping rationale onto incidental helper resources (IAM
   * policies, log groups, custom-resource plumbing) synthesized by L2/L3
   * constructs.
   *
   * @default false
   */
  readonly applyToAllResources?: boolean;

  /**
   * An array of CloudFormation resource types this context applies to (e.g.
   * `['AWS::SQS::Queue']`).
   *
   * An empty array matches any resource type.
   *
   * @default []
   */
  readonly includeResourceTypes?: string[];

  /**
   * An array of CloudFormation resource types that will not receive this
   * context.
   *
   * @default []
   */
  readonly excludeResourceTypes?: string[];

  /**
   * The priority to use when applying the underlying aspect.
   *
   * @default AspectPriority.MUTATING
   */
  readonly priority?: number;
}

/**
 * Manages `Metadata.Context` blocks for all resources within a construct
 * scope.
 *
 * `Metadata.Context` is structured, advisory context embedded in
 * CloudFormation templates. It carries the *why* behind infrastructure —
 * rationale, invariants, change-safety, provenance, operational hints — so
 * that humans and automated tools modifying the deployed template later can
 * act with the author's intent instead of guessing it.
 *
 * Resource-level context added on a scope cascades to primary resources in
 * that scope with nearest-wins semantics: context added closer to a resource
 * overrides context added further up the tree, field by field. List-valued
 * fields (`must`, `gaps`, `deps`, `failureModes`) accumulate across scopes
 * and are de-duplicated.
 *
 * @example
 * declare const queue: sqs.Queue;
 * MetadataContext.of(queue).add({
 *   why: 'buffer order events async; 14d retention = compliance window',
 *   must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
 *   mutable: ContextMutability.CHANGE_WITH_CONSTRAINTS,
 *   mutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
 * });
 */
export class MetadataContext {
  /**
   * Returns the context API for the given scope.
   *
   * @param scope The scope on which to add context
   */
  public static of(scope: IConstruct): MetadataContext {
    return new MetadataContext(scope);
  }

  private constructor(private readonly scope: IConstruct) {
  }

  /**
   * Add a resource-level context block to all primary resources within this
   * scope.
   *
   * Calling `add()` multiple times on the same scope merges the blocks:
   * scalar fields (`why`, `mutable`, `trust`, `ops`) from later calls
   * override earlier ones; list fields and the `mutability` map accumulate.
   */
  public add(context: ResourceContextProps, options: MetadataContextOptions = {}) {
    validateResourceContext(context);

    // Stage the entry as construct-node metadata so the rendering aspect can
    // walk ancestor scopes deterministically (nearest-wins) regardless of
    // aspect invocation order.
    this.scope.node.addMetadata(RESOURCE_CONTEXT_METADATA_TYPE, {
      context,
      options: {
        applyToAllResources: options.applyToAllResources ?? false,
        includeResourceTypes: options.includeResourceTypes,
        excludeResourceTypes: options.excludeResourceTypes,
      },
    }, { stackTrace: false });

    const aspectOptions: AspectOptions = { priority: options.priority ?? AspectPriority.MUTATING };
    const aspects = Aspects.of(this.scope);
    if (!aspects.all.some((aspect) => aspect instanceof MetadataContextAspect)) {
      aspects.add(new MetadataContextAspect(), aspectOptions);
    }
  }

  /**
   * Add template-level context to the stack enclosing this scope.
   *
   * Template-level context holds cross-cutting facts stated once: the
   * architecture overview, template-wide invariants, external context
   * references and ownership. Calling this method multiple times merges
   * blocks: `arch` and `owner` from later calls win, `must` entries and
   * `refs` accumulate.
   */
  public addToTemplate(context: TemplateContextProps) {
    validateTemplateContext(context);

    const stack = Stack.of(this.scope);
    const existing = (stack.templateOptions.metadata?.[METADATA_CONTEXT_KEY] ?? {}) as Record<string, any>;
    const merged: Record<string, any> = { ...existing };

    if (context.arch !== undefined) {
      merged.arch = context.arch;
    }
    if (context.must !== undefined && context.must.length > 0) {
      merged.must = dedupe([...(existing.must ?? []), ...context.must]);
    }
    if (context.refs !== undefined && context.refs.length > 0) {
      const rendered = context.refs.map(renderRef);
      merged.ref = [...(existing.ref ?? []), ...rendered];
    }
    if (context.owner !== undefined) {
      merged.owner = context.owner;
    }

    if (Object.keys(merged).length === 0) {
      return;
    }

    stack.templateOptions.metadata = {
      ...stack.templateOptions.metadata,
      [METADATA_CONTEXT_KEY]: merged,
    };
  }
}

/**
 * A staged context entry recovered from construct-node metadata.
 */
interface StagedEntry {
  readonly context: ResourceContextProps;
  readonly options: {
    readonly applyToAllResources: boolean;
    readonly includeResourceTypes?: string[];
    readonly excludeResourceTypes?: string[];
  };
}

/**
 * The aspect that renders staged context entries into `Metadata.Context`
 * blocks on CloudFormation resources.
 *
 * This is an internal implementation detail of `MetadataContext`; it is
 * registered automatically by `MetadataContext.of(scope).add()`.
 */
class MetadataContextAspect implements IAspect {
  public visit(node: IConstruct): void {
    if (!CfnResource.isCfnResource(node)) {
      return;
    }

    // Walk ancestor scopes root -> leaf, merging staged entries so that
    // entries closer to the resource win.
    let merged: Record<string, any> | undefined;
    for (const scope of node.node.scopes) {
      for (const metadataEntry of scope.node.metadata) {
        if (metadataEntry.type !== RESOURCE_CONTEXT_METADATA_TYPE) {
          continue;
        }
        const staged = metadataEntry.data as StagedEntry;
        if (!this.applies(node, scope, staged)) {
          continue;
        }
        merged = mergeResourceContext(merged, renderResourceContext(staged.context));
      }
    }

    if (merged === undefined || Object.keys(merged).length === 0) {
      return;
    }

    // Merge with any pre-existing Metadata.Context (e.g. written via
    // cfnResource.addMetadata()): explicit resource metadata wins.
    const existing = node.getMetadata(METADATA_CONTEXT_KEY);
    if (existing !== undefined && typeof existing === 'object') {
      merged = mergeResourceContext(merged, existing);
    }

    node.addMetadata(METADATA_CONTEXT_KEY, merged);
  }

  private applies(resource: CfnResource, appliedScope: IConstruct, staged: StagedEntry): boolean {
    const include = staged.options.includeResourceTypes;
    if (include && include.length > 0 && !include.includes(resource.cfnResourceType)) {
      return false;
    }
    const exclude = staged.options.excludeResourceTypes;
    if (exclude && exclude.length > 0 && exclude.includes(resource.cfnResourceType)) {
      return false;
    }
    if (!staged.options.applyToAllResources && !isPrimaryResource(resource, appliedScope)) {
      return false;
    }
    return true;
  }
}

/**
 * Whether a CloudFormation resource is a "primary" resource relative to the
 * scope on which context was added.
 *
 * A resource is primary when every construct on the path from the applied
 * scope down to the resource that designates a `defaultChild` designates
 * (an ancestor of) this resource. This selects e.g. the `AWS::SQS::Queue`
 * inside an `sqs.Queue` construct while skipping helper resources
 * (auto-created IAM roles/policies, log retention functions,
 * custom-resource plumbing), which hang off their enclosing construct
 * outside its `defaultChild` chain. Plain grouping constructs that do not
 * designate a `defaultChild` are transparent: context cascades through them.
 *
 * Stack nodes (including `NestedStack`, whose `defaultChild` is the
 * `AWS::CloudFormation::Stack` embedding resource) are structural
 * boundaries, not L2 wrappers — their `defaultChild` designation does not
 * gate the walk, so context cascades into nested stacks like `Tags` does.
 */
function isPrimaryResource(resource: CfnResource, appliedScope: IConstruct): boolean {
  let current: IConstruct = resource;
  while (current !== appliedScope) {
    const parent = current.node.scope;
    if (parent === undefined) {
      // appliedScope not an ancestor (should not happen) — be permissive.
      return true;
    }
    const defaultChild = Stack.isStack(parent) ? undefined : parent.node.defaultChild;
    if (defaultChild !== undefined && defaultChild !== current) {
      return false;
    }
    current = parent;
  }
  return true;
}
