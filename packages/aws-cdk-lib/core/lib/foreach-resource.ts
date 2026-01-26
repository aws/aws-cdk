import { Construct } from 'constructs';
import { CfnForEachFragment } from './cfn-foreach-fragment';
import { Fn } from './cfn-fn';
import { CfnResource } from './cfn-resource';
import { IResolvable } from './resolvable';
import { Lazy } from './lazy';
import { Stack } from './stack';

/**
 * Properties for ForEachResource.
 */
export interface ForEachResourceProps {
  /** Unique identifier for this loop (alphanumeric only) */
  readonly loopName: string;

  /** Values to iterate over */
  readonly collection: string[] | IResolvable;

  /** CloudFormation resource type (e.g., 'AWS::S3::Bucket') */
  readonly resourceType: string;

  /** Logical ID template - use ${loopName} as placeholder */
  readonly logicalIdTemplate: string;

  /** Resource properties - use Fn.forEachRef() for loop variable */
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
 */
export class ForEachResource extends Construct {
  /** Virtual CfnResource representing the template. Aspects can modify this. */
  public readonly templateResource: CfnResource;

  /** The logical ID template with loop variable placeholder */
  public readonly logicalIdTemplate: string;

  private readonly loopName: string;
  private readonly collection: string[] | IResolvable;
  private readonly resourceType: string;

  constructor(scope: Construct, id: string, props: ForEachResourceProps) {
    super(scope, id);

    if (!/^[A-Za-z0-9]+$/.test(props.loopName)) {
      throw new Error(`ForEach loop name must be alphanumeric, got: ${props.loopName}`);
    }

    this.loopName = props.loopName;
    this.collection = props.collection;
    this.resourceType = props.resourceType;
    this.logicalIdTemplate = props.logicalIdTemplate;

    Stack.of(this).addTransform('AWS::LanguageExtensions');

    this.templateResource = new VirtualCfnResource(this, 'Template', {
      type: props.resourceType,
      properties: props.properties ?? {},
    });

    const lazyFragment = Lazy.any({ produce: () => this.buildForEachStructure() });
    new CfnForEachFragment(this, 'Fragment', 'Resources', lazyFragment);
  }

  /** Reference to resources created by this loop (Ref). */
  public ref(): IResolvable {
    return Fn.ref(this.logicalIdTemplate);
  }

  /** Get attribute of resources created by this loop. */
  public getAtt(attributeName: string): IResolvable {
    return Fn.getAtt(this.logicalIdTemplate, attributeName);
  }

  /** Get Ref to a specific resource by collection value. */
  public refFor(collectionValue: string): IResolvable {
    const logicalId = this.logicalIdTemplate.replace(`\${${this.loopName}}`, collectionValue);
    return Fn.ref(logicalId);
  }

  /** Get attribute of a specific resource by collection value. */
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
    if (options.dependsOn && options.dependsOn.length > 0) {
      resourceDef.DependsOn = options.dependsOn.map(d => d.logicalId);
    }

    return {
      [`Fn::ForEach::${this.loopName}`]: [
        this.collection,
        { [this.logicalIdTemplate]: resourceDef },
      ],
    };
  }
}
