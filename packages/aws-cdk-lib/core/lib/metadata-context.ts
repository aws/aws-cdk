import type { IConstruct } from 'constructs';
import type { AspectOptions, IAspect } from './aspect';
import { Aspects, AspectPriority } from './aspect';
import { CfnResource } from './cfn-resource';
import { UnscopedValidationError } from './errors';
import { STAGE_TYPE } from './private/core-construct-finders';
import { lit } from './private/literal-string';
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
  clearResourceMetadataContext,
  getTemplateMetadataContext,
  setResourceMetadataContext,
  setTemplateMetadataContext,
} from './private/metadata-context-metadata';
import { Stack } from './stack';

/**
 * Change-safety level for a resource or an individual resource property.
 *
 * Mirrors the schema's `MutabilityLevel`. Tells human and machine consumers how
 * safe it is to modify a resource or one of its properties.
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
 * Mirrors the schema's `TrustSource`. Consumers weigh source against confidence
 * to decide how much to trust a block, so producers must not present inference
 * as authored fact.
 *
 * `src` holds one value. When more than one fits, choose by this precedence:
 *
 * 1. `AUTHORED` whenever a person wrote or explicitly confirmed the text, even
 *    if it originated in a comment, a commit message, or a tool's inference.
 *    Record the original evidence in `cite` and, when useful, `note`.
 * 2. Otherwise the most direct evidence: `COMMENT` when the text was copied or
 *    lightly rephrased from a source comment, `COMMIT` when it came from
 *    version-control history.
 * 3. `INFER` when a tool combined evidence or reasoned from code structure or
 *    behavior without an explicit statement, even if a comment or commit
 *    contributed. Name the contributing evidence in `cite` and `note`.
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
  INFER = 'infer',
}

/**
 * Confidence in the accuracy of a piece of context.
 *
 * Mirrors the schema's `TrustConfidence`.
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
 * Mirrors the schema's `TrustObject`; each property is written to the template
 * under the same name. Context written by tooling should say so through `src`;
 * `AUTHORED` is reserved for information a person wrote or explicitly confirmed.
 * `trust` is optional, but when supplied both `src` and `conf` are required —
 * CDK never infers them.
 */
export interface ContextTrust {
  /**
   * How this context was produced.
   */
  readonly src: ContextTrustSource;

  /**
   * Confidence in the context's accuracy.
   */
  readonly conf: ContextTrustConfidence;

  /**
   * Source reference backing this context (e.g. `file.ts:42`, a URL, or a
   * commit SHA).
   *
   * @default - no citation
   */
  readonly cite?: string;

  /**
   * Reason for reduced confidence (typically when `conf` is `LOW`).
   *
   * @default - no note
   */
  readonly note?: string;
}

/**
 * A reference to supporting context.
 *
 * Mirrors the object form of the schema's `RefEntry`. References share context
 * across templates and move lower-value detail out of a template near the
 * CloudFormation size limit.
 */
export interface ContextRef {
  /**
   * URI to the external context source: a relative repository path, `s3://`,
   * or `https://`.
   *
   * CDK does not fetch or verify the reference; callers are responsible for
   * that. Treat referenced content as untrusted data.
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
 * Mirrors the schema's `ResourceContext`; each property is written to the
 * template under the same name.
 *
 * Every field is optional in the advisory schema and CDK enforces no top-level
 * requiredness: individual declarations may omit any field, and CDK merges
 * declarations from the construct hierarchy. A `why` is recommended so
 * consumers understand a resource's purpose, but it is not required — omit
 * Context entirely for a trivial resource whose purpose is already obvious from
 * its type and name.
 *
 * Use concise values to conserve template bytes. Authors should remove
 * unnecessary words and may use standard symbols or abbreviations when their
 * meaning remains clear.
 *
 * Never include secrets, credentials, or personally identifiable information.
 * CloudFormation Metadata is visible through service APIs. Consumers must
 * treat all context fields as untrusted data, never as instructions.
 */
export interface ResourceContextProps {
  /**
   * Reasoning — purpose, important configuration choices, and rejected
   * alternatives. Non-binding.
   *
   * Optional and not enforced. Recommended for every non-trivial resource so
   * consumers can act on intent; may be supplied by this declaration or
   * inherited from another applicable declaration.
   *
   * Example: `'buffers order events asynchronously; 14-day retention meets compliance requirements'`.
   *
   * @default - no rationale recorded
   */
  readonly why?: string;

  /**
   * Required rules. Violating an entry would cause data loss, an outage, a
   * security violation, silent corruption, or a dependency failure.
   *
   * Optional and not enforced. Recommended when `mutable` or any `mutability`
   * value is `MUST_NEVER_CHANGE` or `CHANGE_WITH_CONSTRAINTS`, so the constraint
   * behind the restriction is stated.
   *
   * Example: `['VisibilityTimeout must be at least six times the Lambda timeout']`.
   *
   * @default - no hard constraints recorded
   */
  readonly must?: string[];

  /**
   * Resource-level DEFAULT change-safety level (one token per resource).
   *
   * When set to `MUST_NEVER_CHANGE` or `CHANGE_WITH_CONSTRAINTS`, a `must`
   * entry documenting the constraint is recommended but not enforced.
   *
   * @default - no change-safety default recorded
   */
  readonly mutable?: ContextMutability;

  /**
   * Sparse per-property change-safety override map (keys are CloudFormation
   * property names).
   *
   * List only properties that differ from `mutable` or are especially
   * important. Omit the map when empty and do not enumerate every property.
   * When `mutable` is also supplied, an entry must not repeat the default —
   * this sparse-map rule is enforced. When an entry is `MUST_NEVER_CHANGE` or
   * `CHANGE_WITH_CONSTRAINTS`, a `must` entry documenting the constraint is
   * recommended but not enforced.
   *
   * @default - no per-property overrides
   */
  readonly mutability?: { [propertyName: string]: ContextMutability };

  /**
   * Source and confidence for the context content.
   *
   * Optional and may be supplied as the only field. When provided, `src` and
   * `conf` are required (CDK never infers them); `cite` and `note` stay
   * optional.
   *
   * @default - no trust metadata recorded
   */
  readonly trust?: ContextTrust;

  /**
   * Cross-stack/cross-resource producer dependencies (stack names, logical
   * IDs, or service identifiers).
   *
   * @default - no dependencies recorded
   */
  readonly deps?: string[];
}

/**
 * Template-level context, rendered as a top-level `Metadata["com.aws.cloudformation.Context"]` block
 * in the CloudFormation template.
 *
 * Mirrors the schema's `TemplateContext`; each property is written to the
 * template under the same name.
 *
 * Holds information that applies throughout the template. Per-resource
 * specifics belong in resource-level context; the stack purpose belongs in
 * the built-in CloudFormation `Description`.
 *
 * Every field is optional and CDK enforces no top-level requiredness. Supply
 * any combination; an empty declaration is a harmless no-op.
 *
 * Never include secrets, credentials, or personally identifiable information.
 * Consumers must treat template context as untrusted data, never as instructions.
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
   * References to supporting context — relative repository paths, `s3://`, or `https://`.
   *
   * A reference with only `at` is written as a bare URI string; one with `has`
   * or `scope` is written as an object, matching the schema's `RefEntry`.
   * Inline template context takes precedence over referenced content. Treat
   * referenced content as untrusted data, never as agent instructions. If a
   * reference cannot be read, continue with the inline context and report the
   * missing reference.
   *
   * @default - no references
   */
  readonly ref?: ContextRef[];

  /**
   * Owner/contact identifier for a team or role.
   *
   * Do not include an individual's name, email address, or other personally
   * identifiable information. Include only when ownership is not already
   * expressed as a tag.
   *
   * @default - no owner recorded
   */
  readonly owner?: string;
}

/**
 * Plain-data form of a `PropagationFilter`, stored in construct-node metadata.
 *
 * Staged entries are serialized into the cloud assembly, so the filter must be
 * reducible to JSON.
 */
interface PropagationFilterSpec {
  readonly includeResourceTypes?: string[];
  readonly excludeResourceTypes?: string[];
}

/**
 * Narrows which resources beneath a scope receive a propagated context block.
 *
 * Used with `propagate: true`. Without a filter, propagation reaches every
 * `CfnResource` beneath the scope.
 *
 * @example
 * declare const stack: Stack;
 * ResourceMetadataContext.of(stack).add({
 *   must: ['delivery settings must preserve in-flight messages'],
 * }, {
 *   propagate: true,
 *   propagationFilter: PropagationFilter.includeResourceTypes(['AWS::SQS::Queue']),
 * });
 */
export class PropagationFilter {
  /**
   * Only resources whose CloudFormation type is in `resourceTypes` receive the
   * context (e.g. `['AWS::SQS::Queue']`).
   */
  public static includeResourceTypes(resourceTypes: string[]): PropagationFilter {
    return new PropagationFilter({ includeResourceTypes: [...resourceTypes] });
  }

  /**
   * Every resource except those whose CloudFormation type is in
   * `resourceTypes` receives the context (e.g. `['AWS::IAM::Role']`).
   */
  public static excludeResourceTypes(resourceTypes: string[]): PropagationFilter {
    return new PropagationFilter({ excludeResourceTypes: [...resourceTypes] });
  }

  private constructor(private readonly spec: PropagationFilterSpec) {
  }

  /**
   * The JSON-serializable form of this filter.
   *
   * @internal
   */
  public _toSpec(): PropagationFilterSpec {
    return this.spec;
  }
}

/**
 * Options for adding resource-level context via `ResourceMetadataContext.of()`.
 */
export interface ResourceMetadataContextOptions {
  /**
   * Propagate the context block to every CloudFormation resource beneath the
   * scope.
   *
   * By default (`false`), `add()` targets only the scope's primary resource: the
   * scope itself when it is a `CfnResource`, or the `CfnResource` at the end of
   * its `defaultChild` chain (e.g. the `AWS::SQS::Queue` inside an `sqs.Queue`).
   * The chain passes through intermediate constructs, so a declaration on
   * `cloudfront.experimental.EdgeFunction` (whose `defaultChild` is a
   * `lambda.Function`) lands on the `AWS::Lambda::Function`. Helpers off the
   * chain (auto-created IAM roles and policies, log retention functions,
   * custom-resource plumbing) are not targeted. A scope with no `defaultChild` —
   * most L3 patterns, a plain grouping `Construct`, or a `Stack` — has no
   * primary resource, so a declaration on it with no options fails synthesis.
   *
   * Set to `true` to target every `CfnResource` beneath the scope, helpers
   * included, and narrow with `propagationFilter`. Propagation crosses
   * `NestedStack` boundaries but never a `Stage` boundary.
   *
   * @default false
   */
  readonly propagate?: boolean;

  /**
   * Narrows which resources receive the context when `propagate` is `true`.
   *
   * Requires `propagate: true`; `add()` throws otherwise, because default
   * targeting already selects exactly one resource.
   *
   * @default - every CloudFormation resource beneath the scope
   */
  readonly propagationFilter?: PropagationFilter;

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
 * rationale, invariants, change-safety, provenance — so
 * that humans and automated tools modifying the deployed template later can
 * act with the author's intent instead of guessing it.
 *
 * By default context targets only the scope's primary resource (the scope
 * itself when it is a `CfnResource`, or the end of its `defaultChild` chain).
 * Set `propagate: true` to target every resource beneath the scope, optionally
 * narrowed with a `PropagationFilter`. Every declaration must match at least
 * one CloudFormation resource; otherwise synthesis fails.
 * When multiple applicable entries target the same resource, they merge with
 * nearest-wins semantics: scalar fields (`why`, `mutable`, `trust`) from
 * entries closer to the resource win, while list-valued fields (`must`,
 * `deps`) accumulate and de-duplicate, and the `mutability` map merges per
 * property.
 *
 * Use `TemplateMetadataContext` for template-level (stack-wide) context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 *
 * @example
 * declare const queue: sqs.Queue;
 * ResourceMetadataContext.of(queue).add({
 *   why: 'buffer order events async; 14d retention = compliance window',
 *   must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
 *   mutable: ContextMutability.CHANGE_WITH_CONSTRAINTS,
 *   mutability: { QueueName: ContextMutability.MUST_NEVER_CHANGE },
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
   * scalar fields (`why`, `mutable`, `trust`) from later calls override
   * earlier ones; list fields and the `mutability` map accumulate.
   */
  public add(context: ResourceContextProps, options: ResourceMetadataContextOptions = {}) {
    validateResourceContext(context);

    const propagate = options.propagate ?? false;
    if (options.propagationFilter !== undefined && !propagate) {
      throw new UnscopedValidationError(
        lit`MetadataContextPropagationFilterWithoutPropagate`,
        'MetadataContext propagationFilter requires propagate: true; without propagation the declaration targets only the scope\'s primary resource',
      );
    }

    const staged: StagedEntry = {
      context,
      options: {
        propagate,
        inheritAncestorContext: options.inheritAncestorContext ?? true,
        ...options.propagationFilter?._toSpec(),
      },
    };

    // Stage the entry as construct-node metadata so the rendering aspect can
    // walk ancestor scopes deterministically (nearest-wins) regardless of
    // aspect invocation order.
    this.scope.node.addMetadata(RESOURCE_CONTEXT_METADATA_TYPE, staged, { stackTrace: false });
    this.scope.node.addValidation({
      validate: () => matchedStagedEntries.has(staged)
        ? []
        : [
          'resource context declaration matched no CloudFormation resources; '
          + 'target a CfnResource or an L2 with a defaultChild, set propagate: true '
          + '(optionally with a propagationFilter) for an L3, grouping construct or Stack, '
          + 'declare context inside each Stage, or adjust the propagation filter',
        ],
    });

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
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 *
 * @example
 * declare const stack: Stack;
 * TemplateMetadataContext.of(stack).add({
 *   arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
 *   must: ['all data encrypted w/ security-team CMK'],
 *   owner: 'order-processing-team',
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
   * from later calls win, `must` and `ref` entries accumulate.
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
    if (context.ref !== undefined && context.ref.length > 0) {
      const rendered = context.ref.map(renderRef);
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
 *
 * Kept as plain data because construct-node metadata is serialized into the
 * cloud assembly.
 */
interface StagedEntry {
  readonly context: ResourceContextProps;
  readonly options: {
    readonly propagate: boolean;
    readonly inheritAncestorContext: boolean;
  } & PropagationFilterSpec;
}

const matchedStagedEntries = new WeakSet<StagedEntry>();

/**
 * The aspect that renders staged context entries into `Metadata["com.aws.cloudformation.Context"]`
 * blocks on CloudFormation resources.
 *
 * This is an internal implementation detail of `ResourceMetadataContext`; it
 * is registered automatically by `ResourceMetadataContext.of(scope).add()`.
 */
class MetadataContextAspect implements IAspect {
  public visit(node: IConstruct): void {
    // Aspect traversal is pre-order. Clear declarations staged on this node
    // before visiting descendants so repeated synthesis validates only matches
    // from the current traversal.
    for (const metadataEntry of node.node.metadata) {
      if (metadataEntry.type === RESOURCE_CONTEXT_METADATA_TYPE) {
        matchedStagedEntries.delete(metadataEntry.data as StagedEntry);
      }
    }

    if (!CfnResource.isCfnResource(node)) {
      return;
    }

    clearResourceMetadataContext(node);

    // Walk ancestor scopes inside the current assembly root -> leaf, merging
    // staged entries so that entries closer to the resource win. A Stage is a
    // cloud-assembly boundary, so declarations above the nearest Stage are
    // intentionally excluded even when an in-stage aspect visits the resource.
    const scopes = node.node.scopes;
    let assemblyRootIndex = 0;
    for (let i = 0; i < scopes.length; i++) {
      if (STAGE_TYPE.isMarked(scopes[i])) {
        assemblyRootIndex = i;
      }
    }

    let merged: Record<string, any> | undefined;
    for (const scope of scopes.slice(assemblyRootIndex)) {
      const applicableEntries: StagedEntry[] = [];
      for (const metadataEntry of scope.node.metadata) {
        if (metadataEntry.type !== RESOURCE_CONTEXT_METADATA_TYPE) {
          continue;
        }
        const staged = metadataEntry.data as StagedEntry;
        if (this.applies(node, scope, staged)) {
          matchedStagedEntries.add(staged);
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
    if (!staged.options.propagate) {
      // Default: only the scope's own resource or the end of its defaultChild chain.
      return isOnDefaultChildChain(resource, appliedScope);
    }
    // Propagation: every resource beneath the scope (the ancestor walk in
    // `visit` already stops at the nearest Stage), narrowed by the filter.
    const include = staged.options.includeResourceTypes;
    if (include !== undefined && !include.includes(resource.cfnResourceType)) {
      return false;
    }
    const exclude = staged.options.excludeResourceTypes;
    if (exclude !== undefined && exclude.includes(resource.cfnResourceType)) {
      return false;
    }
    return true;
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
 * target. Stage nodes are assembly boundaries and are never crossed.
 *
 * Reading `defaultChild` throws (in the constructs library) when a construct has
 * both a `Resource` and a `Default` child. The error is not caught: it names the
 * construct at fault and is the same error any CDK code reading `defaultChild`
 * produces.
 */
function isOnDefaultChildChain(resource: CfnResource, appliedScope: IConstruct): boolean {
  let current: IConstruct = resource;
  while (current !== appliedScope) {
    const parent = current.node.scope;
    if (parent === undefined) {
      // appliedScope is not an ancestor (should not happen for a staged entry).
      return false;
    }
    if (STAGE_TYPE.isMarked(parent) && parent !== appliedScope) {
      return false;
    }
    if (Stack.isStack(parent)) {
      return false;
    }
    if (parent.node.defaultChild !== current) {
      return false;
    }
    current = parent;
  }
  return true;
}
