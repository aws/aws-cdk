import type { IConstruct } from 'constructs';
import type { AspectOptions, IAspect } from './aspect';
import { Aspects, AspectPriority } from './aspect';
import { CfnResource } from './cfn-resource';
import {
  RESOURCE_CONTEXT_METADATA_TYPE,
  dedupe,
  mergeResourceContext,
  renderRef,
  renderResourceContext,
  validateResourceContext,
  validateTemplateContext,
} from './private/metadata-context-internal';
import {
  getTemplateMetadataContext,
  setResourceMetadataContext,
  setTemplateMetadataContext,
} from './private/metadata-context-metadata';
import { Stack } from './stack';

/**
 * Change-safety level for a resource or an individual resource property.
 *
 * Part of the CloudFormation Context advisory schema. The levels
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
 *
 * Consumers weigh a source against the confidence to decide how much to
 * trust a context block; producers must declare the source honestly rather
 * than dressing up inference as authored fact.
 */
export enum ContextTrustSource {
  /**
   * Human-authored, or produced by tooling and subsequently confirmed by a
   * human.
   */
  AUTHORED = 'authored',

  /**
   * Directly derived from a code comment.
   */
  COMMENT = 'comment',

  /**
   * Directly derived from a commit message / commit rationale.
   */
  COMMIT = 'commit',

  /**
   * Produced by agent inference or synthesis, not lifted verbatim from an
   * authoritative source.
   */
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
 * anti-fabrication: context written by tooling should say so. Supplying
 * `trust` is optional, but when supplied both `source` and `confidence` are
 * required — CDK never infers them on your behalf.
 */
export interface ContextTrust {
  /**
   * How this context was produced.
   */
  readonly source: ContextTrustSource;

  /**
   * Confidence in the context's accuracy.
   */
  readonly confidence: ContextTrustConfidence;

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
 * Resource-level context, rendered as a `Metadata["com.aws.cloudformation.Context"]` block on a
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
   * Rendered under the canonical wire key `mutable`.
   *
   * @default - no change-safety default recorded
   */
  readonly defaultMutability?: ContextMutability;

  /**
   * Sparse per-property change-safety override map (keys are CloudFormation
   * property names).
   *
   * Rendered under the canonical wire key `mutability`. List ONLY properties
   * that deviate from the `defaultMutability` default or are high-stakes
   * (e.g. replacement-triggering). Omit when empty; never enumerate all
   * properties. When `defaultMutability` is also supplied, an entry MUST NOT
   * repeat that default value — the map is sparse and records deviations only.
   *
   * @default - no per-property overrides
   */
  readonly propertyMutability?: { [propertyName: string]: ContextMutability };

  /**
   * Provenance and confidence metadata for this context block.
   *
   * @default - no trust metadata recorded
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
 * Template-level context, rendered as a top-level `Metadata["com.aws.cloudformation.Context"]` block
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
 * Options for adding resource-level context via `ResourceMetadataContext.of()`.
 */
export interface ResourceMetadataContextOptions {
  /**
   * Cascade the context block to descendant resources beneath the scope,
   * treating plain grouping constructs, L3 patterns and stacks as
   * transparent.
   *
   * By default (`false`), `add()` targets only the scope itself when it is a
   * `CfnResource`, or the `defaultChild` chain of the scope (e.g. the
   * `AWS::SQS::Queue` inside an `sqs.Queue`). Plain grouping constructs, L3
   * patterns and stacks are NOT transparent, so context does not leak onto
   * resources nested behind them.
   *
   * Set to `true` to make those grouping/L3/stack nodes transparent, so
   * context cascades to the primary resource of every construct beneath the
   * scope. Incidental helper resources (auto-created IAM policies, log
   * retention functions, custom-resource plumbing) are still skipped — use
   * `applyToAllResources` to include those.
   *
   * @default false
   */
  readonly applyToDescendants?: boolean;

  /**
   * Apply the context block to every CloudFormation resource in scope,
   * including incidental helper resources.
   *
   * Implies descendant traversal: setting this to `true` cascades context to
   * all resources beneath the scope — primary resources and helper resources
   * (IAM policies, log groups, custom-resource plumbing) alike — regardless
   * of `applyToDescendants`.
   *
   * @default false
   */
  readonly applyToAllResources?: boolean;

  /**
   * Whether this entry inherits context merged from enclosing (ancestor)
   * scopes.
   *
   * By default context added closer to a resource merges on top of context
   * added further up the tree (nearest-wins for scalars, union for lists).
   * Set to `false` to make this a fresh starting point for the resources it
   * targets: any context merged from ancestor scopes is discarded before this
   * entry (and any entries closer to the resource) is applied.
   *
   * @default true
   */
  readonly inheritAncestorContext?: boolean;

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
 * Manages resource-level `Metadata["com.aws.cloudformation.Context"]` blocks for CloudFormation
 * resources within a construct scope.
 *
 * `Metadata["com.aws.cloudformation.Context"]` is structured, advisory context embedded in
 * CloudFormation templates. It carries the *why* behind infrastructure —
 * rationale, invariants, change-safety, provenance, operational hints — so
 * that humans and automated tools modifying the deployed template later can
 * act with the author's intent instead of guessing it.
 *
 * By default context targets only the resource the scope resolves to (the
 * scope itself when it is a `CfnResource`, or its `defaultChild` chain).
 * Opt into broader fan-out with `applyToDescendants` or `applyToAllResources`.
 * When multiple applicable entries target the same resource, they merge with
 * nearest-wins semantics: scalar fields (`why`, `defaultMutability`, `trust`,
 * `ops`) from entries closer to the resource win, while list-valued fields
 * (`must`, `gaps`, `deps`, `failureModes`) accumulate and de-duplicate.
 *
 * Use `TemplateMetadataContext` for template-level (stack-wide) context.
 *
 * @example
 * declare const queue: sqs.Queue;
 * ResourceMetadataContext.of(queue).add({
 *   why: 'buffer order events async; 14d retention = compliance window',
 *   must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
 *   defaultMutability: ContextMutability.CHANGE_WITH_CONSTRAINTS,
 *   propertyMutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
 * });
 */
export class ResourceMetadataContext {
  /**
   * Returns the resource context API for the given scope.
   *
   * @param scope The scope on which to add context
   */
  public static of(scope: IConstruct): ResourceMetadataContext {
    return new ResourceMetadataContext(scope);
  }

  private constructor(private readonly scope: IConstruct) {
  }

  /**
   * Add a resource-level context block targeting resources within this scope.
   *
   * Calling `add()` multiple times on the same scope merges the blocks:
   * scalar fields (`why`, `defaultMutability`, `trust`, `ops`) from later
   * calls override earlier ones; list fields and the `propertyMutability`
   * map accumulate.
   */
  public add(context: ResourceContextProps, options: ResourceMetadataContextOptions = {}) {
    validateResourceContext(context);

    // Stage the entry as construct-node metadata so the rendering aspect can
    // walk ancestor scopes deterministically (nearest-wins) regardless of
    // aspect invocation order.
    this.scope.node.addMetadata(RESOURCE_CONTEXT_METADATA_TYPE, {
      context,
      options: {
        applyToDescendants: options.applyToDescendants ?? false,
        applyToAllResources: options.applyToAllResources ?? false,
        inheritAncestorContext: options.inheritAncestorContext ?? true,
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
}

/**
 * Manages the template-level `Metadata["com.aws.cloudformation.Context"]` block for a stack.
 *
 * Template-level context holds cross-cutting facts stated once: the
 * architecture overview, template-wide invariants, external context
 * references and ownership. It is rendered as a top-level `Metadata` block in
 * the synthesized CloudFormation template. For per-resource context, use
 * `ResourceMetadataContext`.
 *
 * @example
 * declare const stack: Stack;
 * TemplateMetadataContext.of(stack).add({
 *   arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
 *   must: ['all data encrypted w/ security-team CMK'],
 *   owner: 'order-processing@example.com',
 * });
 */
export class TemplateMetadataContext {
  /**
   * Returns the template context API for the given stack.
   *
   * @param stack The stack whose template receives the context
   */
  public static of(stack: Stack): TemplateMetadataContext {
    return new TemplateMetadataContext(stack);
  }

  private constructor(private readonly stack: Stack) {
  }

  /**
   * Add template-level context to this stack's template.
   *
   * Calling this method multiple times merges blocks: `arch` and `owner`
   * from later calls win, `must` entries and `refs` accumulate.
   */
  public add(context: TemplateContextProps) {
    validateTemplateContext(context);

    const existing = getTemplateMetadataContext(this.stack) ?? {};
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

    setTemplateMetadataContext(this.stack, merged);
  }
}

/**
 * A staged context entry recovered from construct-node metadata.
 */
interface StagedEntry {
  readonly context: ResourceContextProps;
  readonly options: {
    readonly applyToDescendants: boolean;
    readonly applyToAllResources: boolean;
    readonly inheritAncestorContext: boolean;
    readonly includeResourceTypes?: string[];
    readonly excludeResourceTypes?: string[];
  };
}

/**
 * The aspect that renders staged context entries into `Metadata["com.aws.cloudformation.Context"]`
 * blocks on CloudFormation resources.
 *
 * This is an internal implementation detail of `ResourceMetadataContext`; it
 * is registered automatically by `ResourceMetadataContext.of(scope).add()`.
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
      const applicableEntries: StagedEntry[] = [];
      for (const metadataEntry of scope.node.metadata) {
        if (metadataEntry.type !== RESOURCE_CONTEXT_METADATA_TYPE) {
          continue;
        }
        const staged = metadataEntry.data as StagedEntry;
        if (this.applies(node, scope, staged)) {
          applicableEntries.push(staged);
        }
      }

      if (applicableEntries.some((entry) => !entry.options.inheritAncestorContext)) {
        // Opt out of inherited ancestor context once before processing this
        // scope, preserving all declarations made on the scope itself.
        merged = undefined;
      }
      for (const staged of applicableEntries) {
        merged = mergeResourceContext(merged, renderResourceContext(staged.context));
      }
    }

    if (merged === undefined || Object.keys(merged).length === 0) {
      return;
    }

    setResourceMetadataContext(node, merged);
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
    if (staged.options.applyToAllResources) {
      // Every resource beneath the scope, helpers included.
      return true;
    }
    if (staged.options.applyToDescendants) {
      // Grouping/L3/stack nodes are transparent; helper resources are skipped.
      return isPrimaryDescendant(resource, appliedScope);
    }
    // Default: only the scope's own resource or its defaultChild chain.
    return isOnDefaultChildChain(resource, appliedScope);
  }
}

/**
 * Safely read a construct's `defaultChild`.
 *
 * `node.defaultChild` throws when a construct has both a `Resource` and a
 * `Default` child (ambiguous designation). Rather than crash synthesis, treat
 * that ambiguity as "no designation".
 */
function safeDefaultChild(construct: IConstruct): IConstruct | undefined {
  try {
    return construct.node.defaultChild as IConstruct | undefined;
  } catch {
    return undefined;
  }
}

/**
 * Whether `resource` is reachable from `appliedScope` purely by following
 * `defaultChild` links (the default, narrow targeting).
 *
 * This matches the scope itself when it is the resource, or the primary
 * resource of an L2 (e.g. the `AWS::SQS::Queue` designated as the
 * `defaultChild` of an `sqs.Queue`). Plain grouping constructs, L3 patterns
 * and stacks are NOT transparent: if any construct on the path does not
 * designate the next node down as its `defaultChild`, the resource is not a
 * target. Ambiguous `defaultChild` designations are treated as no
 * designation, so they block the chain rather than crash synthesis.
 */
function isOnDefaultChildChain(resource: CfnResource, appliedScope: IConstruct): boolean {
  let current: IConstruct = resource;
  while (current !== appliedScope) {
    const parent = current.node.scope;
    if (parent === undefined) {
      // appliedScope is not an ancestor (should not happen for a staged entry).
      return false;
    }
    if (Stack.isStack(parent)) {
      return false;
    }
    if (safeDefaultChild(parent) !== current) {
      return false;
    }
    current = parent;
  }
  return true;
}

/**
 * Whether `resource` is a "primary" resource beneath `appliedScope` when
 * descendant fan-out is explicitly enabled.
 *
 * Grouping constructs, L3 patterns and stacks are transparent: context
 * cascades through them. Within an L2 wrapper, only the `defaultChild` chain
 * is a target, so incidental helper resources (auto-created IAM roles/policies,
 * log retention functions, custom-resource plumbing) are skipped. Stack nodes
 * (including `NestedStack`, whose `defaultChild` is the
 * `AWS::CloudFormation::Stack` embedding resource) are structural boundaries,
 * not L2 wrappers — their `defaultChild` designation does not gate the walk,
 * so context cascades into nested stacks like `Tags` does. Ambiguous
 * `defaultChild` designations are treated as no designation (transparent).
 */
function isPrimaryDescendant(resource: CfnResource, appliedScope: IConstruct): boolean {
  let current: IConstruct = resource;
  while (current !== appliedScope) {
    const parent = current.node.scope;
    if (parent === undefined) {
      // appliedScope not an ancestor (should not happen) — be permissive.
      return true;
    }
    const defaultChild = Stack.isStack(parent) ? undefined : safeDefaultChild(parent);
    if (defaultChild !== undefined && defaultChild !== current) {
      return false;
    }
    current = parent;
  }
  return true;
}
