import { Construct } from 'constructs';
import { Fn } from './cfn-fn';
import { CfnForEachFragment } from './cfn-foreach-fragment';
import { CfnResource } from './cfn-resource';
import { UnscopedValidationError } from './errors';
import { Lazy } from './lazy';
import { IResolvable } from './resolvable';
import { Stack } from './stack';

const FOR_EACH_RESOURCE_SYMBOL = Symbol.for('@aws-cdk/core.ForEachResource');

/**
 * Properties for ForEachResource.
 */
export interface ForEachResourceProps {
  /**
   * Unique identifier for this loop (alphanumeric only).
   */
  readonly loopName: string;

  /**
   * Values to iterate over.
   */
  readonly collection: string[];

  /**
   * CloudFormation resource type (e.g., 'AWS::S3::Bucket').
   */
  readonly resourceType: string;

  /**
   * Logical ID template - use ${loopName} as placeholder.
   */
  readonly logicalIdTemplate: string;

  /**
   * Resource properties - use Fn.forEachRef() for loop variable.
   *
   * @default - no properties
   */
  readonly properties?: Record<string, any>;
}

/**
 * A virtual CfnResource that doesn't render to the template.
 * Used as a template for ForEach that Aspects can visit.
 */
class VirtualCfnResource extends CfnResource {
  protected shouldSynthesize(): boolean {
    return false;
  }
}

/**
 * Creates multiple CloudFormation resources using Fn::ForEach.
 *
 * This construct allows you to create multiple resources of the same type
 * by iterating over a collection of values at deploy time.
 *
 * @example
 * new ForEachResource(this, 'Buckets', {
 *   loopName: 'Env',
 *   collection: ['dev', 'prod'],
 *   resourceType: 'AWS::S3::Bucket',
 *   logicalIdTemplate: 'Bucket${Env}',
 *   properties: { BucketName: Fn.sub('my-bucket-${Env}') },
 * });
 */
export class ForEachResource extends Construct {
  /**
   * Checks if the given construct is a ForEachResource.
   */
  public static isForEachResource(x: any): x is ForEachResource {
    return x !== null && typeof x === 'object' && FOR_EACH_RESOURCE_SYMBOL in x;
  }

  /**
   * Virtual CfnResource representing the template. Aspects can modify this.
   */
  public readonly templateResource: CfnResource;

  /**
   * The logical ID template with loop variable placeholder.
   */
  public readonly logicalIdTemplate: string;

  private readonly loopName: string;
  private readonly collection: string[];
  private readonly resourceType: string;

  constructor(scope: Construct, id: string, props: ForEachResourceProps) {
    super(scope, id);

    if (!/^[A-Za-z0-9]+$/.test(props.loopName)) {
      throw new UnscopedValidationError(`forEach loop name must be alphanumeric, got '${props.loopName}'`);
    }

    this.loopName = props.loopName;
    this.collection = props.collection;
    this.resourceType = props.resourceType;
    this.logicalIdTemplate = props.logicalIdTemplate;

    Object.defineProperty(this, FOR_EACH_RESOURCE_SYMBOL, { value: true });

    Stack.of(this).addTransform('AWS::LanguageExtensions');

    this.templateResource = new VirtualCfnResource(this, 'Template', {
      type: props.resourceType,
      properties: props.properties ?? {},
    });

    const lazyFragment = Lazy.any({ produce: () => this.buildForEachStructure() });
    new CfnForEachFragment(this, 'Fragment', { section: 'Resources', fragment: lazyFragment });
  }

  /**
   * Reference to resources created by this loop (Ref).
   *
   * @returns a token representing the Ref to the templated resource
   */
  public ref(): string {
    return Fn.ref(this.logicalIdTemplate);
  }

  /**
   * Get attribute of resources created by this loop.
   *
   * @param attributeName the name of the attribute
   * @returns a token representing the attribute value
   */
  public getAtt(attributeName: string): IResolvable {
    return Fn.getAtt(this.logicalIdTemplate, attributeName);
  }

  /**
   * Get Ref to a specific resource by collection value.
   *
   * @param collectionValue the value from the collection
   * @returns a token representing the Ref to the specific resource
   */
  public refFor(collectionValue: string): string {
    const logicalId = this.logicalIdTemplate.replace(`\${${this.loopName}}`, collectionValue);
    return Fn.ref(logicalId);
  }

  /**
   * Get attribute of a specific resource by collection value.
   *
   * @param collectionValue the value from the collection
   * @param attributeName the name of the attribute
   * @returns a token representing the attribute value
   */
  public getAttFor(collectionValue: string, attributeName: string): IResolvable {
    const logicalId = this.logicalIdTemplate.replace(`\${${this.loopName}}`, collectionValue);
    return Fn.getAtt(logicalId, attributeName);
  }

  private buildForEachStructure(): any {
    const resourceDef: Record<string, any> = {
      Type: this.resourceType,
      Properties: (this.templateResource as any)._cfnProperties,
    };

    const options = this.templateResource.cfnOptions;
    if (options.condition) {
      resourceDef.Condition = options.condition.logicalId;
    }
    if (options.metadata && Object.keys(options.metadata).length > 0) {
      resourceDef.Metadata = options.metadata;
    }
    if (options.deletionPolicy) {
      resourceDef.DeletionPolicy = options.deletionPolicy;
    }
    if (options.updatePolicy) {
      resourceDef.UpdatePolicy = options.updatePolicy;
    }

    return {
      [`Fn::ForEach::${this.loopName}`]: [
        this.collection,
        { [this.logicalIdTemplate]: resourceDef },
      ],
    };
  }
}
