import type { IConstruct } from 'constructs';
import type { IAspect } from './aspect';
import { Aspects, AspectPriority } from './aspect';
import { CfnResource } from './cfn-resource';
import { ValidationError } from './errors';
import type { IConstructSelector } from './mixins/selectors';
import { ConstructSelector } from './mixins/selectors';
import { lit } from './private/literal-string';
import type { Stack } from './stack';
import { Token } from './token';

const METADATA_CONTEXT_KEY = 'com.aws.cloudformation.Context';

/**
 * Change-safety level for a resource or resource property.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export enum CfnContextMutability {
  /**
   * The value must never change.
   */
  MUST_NEVER_CHANGE = 'must-never-change',

  /**
   * The value can change within stated constraints.
   */
  CHANGE_WITH_CONSTRAINTS = 'change-with-constraints',

  /**
   * The value requires review before it changes.
   */
  REVIEW_REQUIRED = 'review-required',

  /**
   * The value can change without coordination.
   */
  FREE_TO_TUNE = 'free-to-tune',
}

/**
 * How context was produced.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export enum CfnContextTrustSource {
  /**
   * Human-authored or human-confirmed context.
   */
  AUTHORED = 'authored',

  /**
   * Context derived from a code comment.
   */
  COMMENT = 'comment',

  /**
   * Context derived from a commit message.
   */
  COMMIT = 'commit',

  /**
   * Context inferred by a tool.
   */
  INFER = 'infer',
}

/**
 * Confidence in the accuracy of context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export enum CfnContextTrustConfidence {
  /**
   * High confidence.
   */
  HIGH = 'high',

  /**
   * Medium confidence.
   */
  MEDIUM = 'medium',

  /**
   * Low confidence.
   */
  LOW = 'low',
}

/**
 * Provenance and confidence for context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export interface CfnContextTrust {
  /**
   * How the context was produced.
   */
  readonly src: CfnContextTrustSource;

  /**
   * Confidence in the context.
   */
  readonly conf: CfnContextTrustConfidence;

  /**
   * Reference to the source of the context.
   *
   * @default - no citation
   */
  readonly cite?: string;

  /**
   * Additional provenance details.
   *
   * @default - no note
   */
  readonly note?: string;
}

/**
 * Reference to supporting context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export interface CfnContextRef {
  /**
   * Location of the supporting context.
   */
  readonly at: string;

  /**
   * Summary of the referenced context.
   *
   * @default - no summary
   */
  readonly has?: string;

  /**
   * Scope of the referenced context.
   *
   * @default - no scope
   */
  readonly scope?: string;
}

/**
 * Resource-level CloudFormation Metadata Context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export interface CfnResourceMetadataContextProps {
  /**
   * Rationale for the resource.
   *
   * @default - no rationale
   */
  readonly why?: string;

  /**
   * Constraints that must remain true.
   *
   * @default - no constraints
   */
  readonly must?: string[];

  /**
   * Default mutability of the resource.
   *
   * @default - no default mutability
   */
  readonly mutable?: CfnContextMutability;

  /**
   * Mutability by CloudFormation property name.
   *
   * @default - no property mutability
   */
  readonly mutability?: { [propertyName: string]: CfnContextMutability };

  /**
   * Provenance and confidence for the context.
   *
   * @default - no trust information
   */
  readonly trust?: CfnContextTrust;

  /**
   * Dependencies of the resource.
   *
   * @default - no dependencies
   */
  readonly deps?: string[];
}

/**
 * Template-level CloudFormation Metadata Context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export interface CfnTemplateMetadataContextProps {
  /**
   * High-level architecture of the template.
   *
   * @default - no architecture overview
   */
  readonly arch?: string;

  /**
   * Constraints that apply across the template.
   *
   * @default - no constraints
   */
  readonly must?: string[];

  /**
   * References to supporting context.
   *
   * @default - no references
   */
  readonly ref?: CfnContextRef[];

  /**
   * Owner of the template.
   *
   * @default - no owner
   */
  readonly owner?: string;
}

/**
 * Options for `CfnResourceMetadataContext.of()`.
 */
export interface CfnResourceMetadataContextOptions {
  /**
   * Selects the constructs targeted by `set()` or `clear()`.
   *
   * Selection runs during synthesis and only selected `CfnResource` constructs
   * are updated. Synthesis fails when no `CfnResource` is selected. The default
   * selects a `CfnResource` scope or its immediate `CfnResource` default child.
   *
   * @default ConstructSelector.cfnResource()
   */
  readonly selector?: IConstructSelector;
}

/**
 * Manages resource-level CloudFormation Metadata Context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export class CfnResourceMetadataContext {
  /**
   * Returns the resource context API for a construct scope.
   *
   * @param scope The scope whose resources receive the context
   * @param options Resource selection options
   */
  public static of(
    scope: IConstruct,
    options: CfnResourceMetadataContextOptions = {},
  ): CfnResourceMetadataContext {
    return new CfnResourceMetadataContext(scope, options);
  }

  private constructor(
    private readonly scope: IConstruct,
    private readonly options: CfnResourceMetadataContextOptions,
  ) {
  }

  /**
   * Replaces the complete Context value on the selected resources.
   *
   * Includes resources added after this call.
   */
  public set(context: CfnResourceMetadataContextProps): void {
    this.addResourceAspect(resource => resource.addMetadata(METADATA_CONTEXT_KEY, context));
  }

  /**
   * Removes Context from the selected resources.
   */
  public clear(): void {
    this.addResourceAspect(resource => deleteContext(resource.cfnOptions.metadata));
  }

  private addResourceAspect(applyToResource: (resource: CfnResource) => void): void {
    const aspect = new CfnResourceMetadataContextAspect(
      this.scope,
      this.options.selector ?? ConstructSelector.cfnResource(),
      applyToResource,
    );
    Aspects.of(this.scope).add(aspect, { priority: AspectPriority.MUTATING });
    this.scope.node.addValidation({
      validate: () => aspect.hasSelectedResource ? [] : [NO_RESOURCE_SELECTED_ERROR],
    });
  }
}

/**
 * Manages template-level CloudFormation Metadata Context.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-metadata.html#aws-attribute-metadata-context-schema
 */
export class CfnTemplateMetadataContext {
  /**
   * Returns the template context API for a stack.
   *
   * @param stack The stack whose template receives the context
   */
  public static of(stack: Stack): CfnTemplateMetadataContext {
    return new CfnTemplateMetadataContext(stack);
  }

  private constructor(private readonly stack: Stack) {
  }

  /**
   * Replaces the complete template Context value.
   *
   * Values must be concrete because CloudFormation does not resolve intrinsic
   * functions in template metadata.
   */
  public set(context: CfnTemplateMetadataContextProps): void {
    validateTemplateContext(this.stack, context);
    this.stack.addMetadata(METADATA_CONTEXT_KEY, context);
  }

  /**
   * Removes the template Context value.
   */
  public clear(): void {
    deleteContext(this.stack.templateOptions.metadata);
  }
}

const NO_RESOURCE_SELECTED_ERROR = 'metadata context set() or clear() selected no CfnResource; '
  + 'target a CfnResource or a construct whose defaultChild is a CfnResource, set a selector such as '
  + 'ConstructSelector.all() or ConstructSelector.resourcesOfType(), or call the API inside each Stage';

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
    // Re-evaluate when an earlier Aspect adds a resource.
    if (this.selection === undefined || !this.selection.scanned.has(resource)) {
      this.selection = {
        scanned: new Set(this.scope.node.findAll()),
        selected: new Set(this.selector.select(this.scope)),
      };
    }
    return this.selection.selected.has(resource);
  }
}

function validateTemplateContext(scope: IConstruct, context: CfnTemplateMetadataContextProps): void {
  for (const [field, value] of Object.entries(context)) {
    rejectUnresolvedTokens(scope, value, field);
  }
}

function rejectUnresolvedTokens(scope: IConstruct, value: unknown, path: string): void {
  if (Token.isUnresolved(value)) {
    throw new ValidationError(
      lit`UnresolvedTokenInTemplateMetadataContext`,
      `template context field '${path}' cannot contain unresolved tokens because CloudFormation does not resolve intrinsic functions in template metadata`,
      scope,
    );
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => rejectUnresolvedTokens(scope, entry, `${path}[${index}]`));
    return;
  }

  if (value === null || typeof value !== 'object') {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    rejectUnresolvedTokens(scope, nestedValue, `${path}.${key}`);
  }
}

function deleteContext(metadata: { [key: string]: any } | undefined): void {
  if (metadata !== undefined) {
    delete metadata[METADATA_CONTEXT_KEY];
  }
}
