import type { IConstruct } from 'constructs';
import type { IAspect } from './aspect';
import { Aspects, AspectPriority } from './aspect';
import { CfnResource } from './cfn-resource';
import type { IConstructSelector } from './mixins/selectors';
import { ConstructSelector } from './mixins/selectors';
import {
  METADATA_CONTEXT_KEY,
  renderResourceContext,
  renderTemplateContext,
  validateResourceContext,
  validateTemplateContext,
} from './private/metadata-context-internal';
import type { Stack } from './stack';

/**
 * Change-safety level for a resource or an individual resource property.
 *
 * Mirrors the schema's `MutabilityLevel`. Tells human and machine consumers how
 * safe it is to modify a resource or one of its properties.
 */
export enum CfnContextMutability {
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
export enum CfnContextTrustSource {
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
export enum CfnContextTrustConfidence {
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
export interface CfnContextTrust {
  /**
   * How this context was produced.
   */
  readonly src: CfnContextTrustSource;

  /**
   * Confidence in the context's accuracy.
   */
  readonly conf: CfnContextTrustConfidence;

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
export interface CfnContextRef {
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
 * requiredness: a `set()` call may omit any field, and the value it renders
 * replaces the complete Context on each selected resource. A `why` is recommended so
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
export interface CfnResourceContextProps {
  /**
   * Reasoning — purpose, important configuration choices, and rejected
   * alternatives. Non-binding.
   *
   * Optional and not enforced. Recommended for every non-trivial resource so
   * consumers can act on intent.
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
  readonly mutable?: CfnContextMutability;

  /**
   * Sparse per-property change-safety override map (keys are CloudFormation
   * property names).
   *
   * List only properties that differ from `mutable` or are especially
   * important. Omit the map when empty and do not enumerate every property.
   * When `mutable` is also supplied, an entry must not repeat the default —
   * synthesis fails otherwise. When an entry is `MUST_NEVER_CHANGE` or
   * `CHANGE_WITH_CONSTRAINTS`, a `must` entry documenting the constraint is
   * recommended but not enforced.
   *
   * @default - no per-property overrides
   */
  readonly mutability?: { [propertyName: string]: CfnContextMutability };

  /**
   * Source and confidence for the context content.
   *
   * Optional and may be supplied as the only field. When provided, `src` and
   * `conf` are required (CDK never infers them); `cite` and `note` stay
   * optional.
   *
   * @default - no trust metadata recorded
   */
  readonly trust?: CfnContextTrust;

  /**
   * Cross-stack or cross-resource producer dependencies, by name: other
   * stacks, external services, or systems outside the account.
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
 * any combination; `set({})` writes an empty Context object. Values must be
 * concrete because CloudFormation does not resolve intrinsic functions in
 * top-level template Metadata; `set()` rejects unresolved tokens.
 *
 * Never include secrets, credentials, or personally identifiable information.
 * Consumers must treat template context as untrusted data, never as instructions.
 */
export interface CfnTemplateContextProps {
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
  readonly ref?: CfnContextRef[];

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
 * Options for `CfnResourceMetadataContext.set()` and `clear()`.
 */
export interface CfnResourceMetadataContextOptions {
  /**
   * Selects the constructs targeted by `set()` or `clear()`.
   *
   * The selector runs during synthesis, after the construct tree is complete,
   * against the scope passed to `CfnResourceMetadataContext.of()`. Only
   * selected `CfnResource` constructs are changed; other selected constructs
   * are ignored. A call whose selector selects no `CfnResource` fails
   * synthesis.
   *
   * The default selects the scope itself when it is a `CfnResource`, or its
   * immediate `defaultChild` when that child is a `CfnResource`. It does not
   * follow a `defaultChild` chain through other constructs, and it skips
   * helper resources such as auto-created IAM roles.
   *
   * Use `ConstructSelector.all()` to target every `CfnResource` beneath the
   * scope, helpers included, or `ConstructSelector.resourcesOfType()`,
   * `byId()` or `byPath()` to narrow the selection. Resources in a
   * `NestedStack` can be selected; resources beneath a `Stage` cannot, because
   * each Stage is synthesized as its own cloud assembly.
   *
   * @default ConstructSelector.cfnResource()
   */
  readonly selector?: IConstructSelector;

  /**
   * The priority of the underlying aspect.
   *
   * Lower priorities run first. When several calls select the same resource,
   * the call applied last determines the result.
   *
   * @default AspectPriority.MUTATING
   */
  readonly priority?: number;
}

/**
 * Sets or clears resource-level `Metadata["com.aws.cloudformation.Context"]`
 * on CloudFormation resources within a construct scope.
 *
 * `Metadata["com.aws.cloudformation.Context"]` is structured, advisory context embedded in
 * CloudFormation templates. It carries the *why* behind infrastructure —
 * rationale, invariants, change-safety, provenance — so
 * that humans and automated tools modifying the deployed template later can
 * act with the author's intent instead of guessing it.
 *
 * Each `set()` or `clear()` call registers an Aspect on the scope with the
 * call's selector and priority. When the Aspect visits a selected
 * `CfnResource`, `set()` replaces the complete Context value and `clear()`
 * removes it. Values are never merged: lower Aspect priorities run first; at
 * the same priority an Aspect on a parent scope runs before one on a child
 * scope, and calls on the same scope run in call order. The last applied
 * call determines the result, including over Context written directly with
 * `CfnResource.addMetadata()` while the construct tree was built.
 *
 * Use `CfnTemplateMetadataContext` for template-level (stack-wide) context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 *
 * @example
 * declare const queue: sqs.Queue;
 * CfnResourceMetadataContext.of(queue).set({
 *   why: 'buffer order events async; 14d retention = compliance window',
 *   must: ['VisTimeout >= 6x fn timeout, else dup on retry'],
 *   mutable: CfnContextMutability.CHANGE_WITH_CONSTRAINTS,
 *   mutability: { QueueName: CfnContextMutability.MUST_NEVER_CHANGE },
 * });
 */
export class CfnResourceMetadataContext {
  /**
   * Returns the resource context API for the given scope.
   *
   * @param scope The scope whose resources the returned API sets or clears Context on
   */
  public static of(scope: IConstruct): CfnResourceMetadataContext {
    return new CfnResourceMetadataContext(scope);
  }

  private constructor(private readonly scope: IConstruct) {
  }

  /**
   * Replaces the Context on the resources selected by `options`.
   *
   * The selector runs during synthesis, so it also covers resources added
   * beneath the scope after this call. This method never throws; invalid
   * values and a call that selects no `CfnResource` fail synthesis.
   */
  public set(context: CfnResourceContextProps, options: CfnResourceMetadataContextOptions = {}): void {
    // Render now so the value written at synthesis is the one validated here,
    // even if the caller mutates `context` afterwards.
    const rendered: CfnResourceContextProps = renderResourceContext(context);
    this.addResourceAspect(
      (resource) => resource.addMetadata(METADATA_CONTEXT_KEY, renderResourceContext(rendered)),
      options,
      validateResourceContext(rendered),
    );
  }

  /**
   * Removes the Context from the resources selected by `options`.
   *
   * The selector runs during synthesis. A call that selects no `CfnResource`
   * fails synthesis.
   */
  public clear(options: CfnResourceMetadataContextOptions = {}): void {
    this.addResourceAspect((resource) => deleteContext(resource.cfnOptions.metadata), options, []);
  }

  private addResourceAspect(
    applyToResource: (resource: CfnResource) => void,
    options: CfnResourceMetadataContextOptions,
    valueErrors: string[],
  ): void {
    const aspect = new CfnResourceMetadataContextAspect(
      this.scope,
      options.selector ?? ConstructSelector.cfnResource(),
      applyToResource,
    );
    Aspects.of(this.scope).add(aspect, { priority: options.priority ?? AspectPriority.MUTATING });
    this.scope.node.addValidation({
      validate: () => aspect.hasSelectedResource ? valueErrors : [...valueErrors, NO_RESOURCE_SELECTED_ERROR],
    });
  }
}

/**
 * Sets or clears the template-level `Metadata["com.aws.cloudformation.Context"]`
 * block for a stack.
 *
 * Template-level context holds cross-cutting facts stated once: the
 * architecture overview, template-wide invariants, external context
 * references and ownership. It is rendered as a top-level `Metadata` block in
 * the synthesized CloudFormation template. For per-resource context, use
 * `CfnResourceMetadataContext`.
 *
 * `set()` and `clear()` change the stack's template metadata immediately, like
 * `Stack.addMetadata()` on the same key, so ordinary call order determines
 * the result.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 *
 * @example
 * declare const stack: Stack;
 * CfnTemplateMetadataContext.of(stack).set({
 *   arch: 'SQS buffer -> Lambda -> DynamoDB; DLQ for poison msgs',
 *   must: ['all data encrypted w/ security-team CMK'],
 *   owner: 'order-processing-team',
 * });
 */
export class CfnTemplateMetadataContext {
  /**
   * Returns the template context API for the given stack.
   *
   * @param stack The stack whose template receives the context
   */
  public static of(stack: Stack): CfnTemplateMetadataContext {
    return new CfnTemplateMetadataContext(stack);
  }

  private constructor(private readonly stack: Stack) {
  }

  /**
   * Replaces the template Context of this stack.
   *
   * Values must be concrete. Unresolved tokens are rejected because top-level
   * template Metadata does not resolve intrinsic functions.
   */
  public set(context: CfnTemplateContextProps): void {
    validateTemplateContext(this.stack, context);
    this.stack.addMetadata(METADATA_CONTEXT_KEY, renderTemplateContext(context));
  }

  /**
   * Removes the template Context of this stack.
   */
  public clear(): void {
    const metadata = this.stack.templateOptions.metadata;
    deleteContext(metadata);
    // Unlike resource metadata, an empty template Metadata object is rendered
    // as `Metadata: {}`; drop it so clearing leaves no trace in the template.
    if (metadata !== undefined && Object.keys(metadata).length === 0) {
      this.stack.templateOptions.metadata = undefined;
    }
  }
}

const NO_RESOURCE_SELECTED_ERROR = 'metadata context set() or clear() selected no CfnResource; '
  + 'target a CfnResource or a construct whose defaultChild is a CfnResource, set a selector such as '
  + 'ConstructSelector.all() or ConstructSelector.resourcesOfType(), or call the API inside each Stage';

/**
 * Applies one `CfnResourceMetadataContext.set()` or `clear()` call to the
 * `CfnResource` constructs its selector selects beneath the scope.
 */
class CfnResourceMetadataContextAspect implements IAspect {
  private selection?: { readonly scanned: Set<IConstruct>; readonly selected: Set<IConstruct> };
  private selectedResource = false;

  constructor(
    private readonly scope: IConstruct,
    private readonly selector: IConstructSelector,
    private readonly applyToResource: (resource: CfnResource) => void,
  ) {
  }

  public get hasSelectedResource(): boolean {
    return this.selectedResource;
  }

  public visit(node: IConstruct): void {
    if (node === this.scope) {
      this.selection = undefined;
      this.selectedResource = false;
    }

    if (!CfnResource.isCfnResource(node) || !this.selects(node)) {
      return;
    }
    this.selectedResource = true;
    this.applyToResource(node);
  }

  private selects(resource: CfnResource): boolean {
    // Other aspects may add resources while aspects run, so re-run the
    // selector when visiting a construct it has not seen yet.
    if (this.selection === undefined || !this.selection.scanned.has(resource)) {
      this.selection = {
        scanned: new Set(this.scope.node.findAll()),
        selected: new Set(this.selector.select(this.scope)),
      };
    }
    return this.selection.selected.has(resource);
  }
}

function deleteContext(metadata: { [key: string]: any } | undefined): void {
  if (metadata !== undefined) {
    delete metadata[METADATA_CONTEXT_KEY];
  }
}
