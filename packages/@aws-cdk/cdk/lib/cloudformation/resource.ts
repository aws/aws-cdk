import cxapi = require('@aws-cdk/cx-api');
import { Construct, IConstruct } from '../core/construct';
import { TagManager } from '../core/tag-manager';
import { capitalizePropertyNames, ignoreEmpty, PostResolveToken } from '../core/util';
import { CfnReference } from './cfn-tokens';
import { Condition } from './condition';
import { CreationPolicy, DeletionPolicy, UpdatePolicy } from './resource-policy';
import { Referenceable } from './stack-element';

export interface ResourceProps {
  /**
   * CloudFormation resource type.
   */
  type: string;

  /**
   * CloudFormation properties.
   */
  properties?: any;
}

export interface ITaggable {
  /**
   * TagManager to set, remove and format tags
   */
  readonly tags: TagManager;
}
/**
 * Represents a CloudFormation resource.
 */
export class Resource extends Referenceable {
  /**
   * A decoration used to create a CloudFormation attribute property.
   * @param customName Custom name for the attribute (default is the name of the property)
   * NOTE: we return "any" here to satistfy jsii, which doesn't support lambdas.
   */
  public static attribute(customName?: string): any {
    return (prototype: any, key: string) => {
      const name = customName || key;
      Object.defineProperty(prototype, key, {
        get() {
          return (this as any).getAtt(name);
        }
      });
    };
  }

  /**
   * Check whether the given construct is a Resource
   */
  public static isResource(construct: IConstruct): construct is Resource {
    return (construct as any).resourceType !== undefined;
  }

  /**
   * Check whether the given construct is Taggable
   */
  public static isTaggable(construct: any): construct is ITaggable {
    return (construct as any).tags !== undefined;
  }

  /**
   * Options for this resource, such as condition, update policy etc.
   */
  public readonly options: ResourceOptions = {};

  /**
   * AWS resource type.
   */
  public readonly resourceType: string;

  /**
   * AWS resource properties.
   *
   * This object is rendered via a call to "renderProperties(this.properties)".
   */
  protected readonly properties: any;

  /**
   * AWS resource property overrides.
   *
   * During synthesis, the method "renderProperties(this.overrides)" is called
   * with this object, and merged on top of the output of
   * "renderProperties(this.properties)".
   *
   * Derived classes should expose a strongly-typed version of this object as
   * a public property called `propertyOverrides`.
   */
  protected readonly untypedPropertyOverrides: any = { };

  /**
   * An object to be merged on top of the entire resource definition.
   */
  private readonly rawOverrides: any = { };

  /**
   * Logical IDs of dependencies.
   *
   * Is filled during prepare().
   */
  private readonly dependsOn = new Set<Resource>();

  /**
   * Creates a resource construct.
   * @param resourceType The CloudFormation type of this resource (e.g. AWS::DynamoDB::Table)
   */
  constructor(scope: Construct, id: string, props: ResourceProps) {
    super(scope, id);

    if (!props.type) {
      throw new Error('The `type` property is required');
    }

    this.resourceType = props.type;
    this.properties = props.properties || { };

    // if aws:cdk:enable-path-metadata is set, embed the current construct's
    // path in the CloudFormation template, so it will be possible to trace
    // back to the actual construct path.
    if (this.node.getContext(cxapi.PATH_METADATA_ENABLE_CONTEXT)) {
      this.options.metadata = {
        [cxapi.PATH_METADATA_KEY]: this.node.path
      };
    }
  }

  /**
   * Returns a token for an runtime attribute of this resource.
   * Ideally, use generated attribute accessors (e.g. `resource.arn`), but this can be used for future compatibility
   * in case there is no generated attribute.
   * @param attributeName The name of the attribute.
   */
  public getAtt(attributeName: string) {
    return new CfnReference({ 'Fn::GetAtt': [this.logicalId, attributeName] }, attributeName, this);
  }

  /**
   * Adds an override to the synthesized CloudFormation resource. To add a
   * property override, either use `addPropertyOverride` or prefix `path` with
   * "Properties." (i.e. `Properties.TopicName`).
   *
   * @param path  The path of the property, you can use dot notation to
   *        override values in complex types. Any intermdediate keys
   *        will be created as needed.
   * @param value The value. Could be primitive or complex.
   */
  public addOverride(path: string, value: any) {
    const parts = path.split('.');
    let curr: any = this.rawOverrides;

    while (parts.length > 1) {
      const key = parts.shift()!;

      // if we can't recurse further or the previous value is not an
      // object overwrite it with an object.
      const isObject = curr[key] != null && typeof(curr[key]) === 'object' && !Array.isArray(curr[key]);
      if (!isObject) {
        curr[key] = { };
      }

      curr = curr[key];
    }

    const lastKey = parts.shift()!;
    curr[lastKey] = value;
  }

  /**
   * Syntactic sugar for `addOverride(path, undefined)`.
   * @param path The path of the value to delete
   */
  public addDeletionOverride(path: string) {
    this.addOverride(path, undefined);
  }

  /**
   * Adds an override to a resource property.
   *
   * Syntactic sugar for `addOverride("Properties.<...>", value)`.
   *
   * @param propertyPath The path of the property
   * @param value The value
   */
  public addPropertyOverride(propertyPath: string, value: any) {
    this.addOverride(`Properties.${propertyPath}`, value);
  }

  /**
   * Adds an override that deletes the value of a property from the resource definition.
   * @param propertyPath The path to the property.
   */
  public addPropertyDeletionOverride(propertyPath: string) {
    this.addPropertyOverride(propertyPath, undefined);
  }

  /**
   * Indicates that this resource depends on another resource and cannot be provisioned
   * unless the other resource has been successfully provisioned.
   */
  public addDependsOn(resource: Resource) {
    this.dependsOn.add(resource);
  }

  /**
   * Emits CloudFormation for this resource.
   */
  public toCloudFormation(): object {
    try {
      if (Resource.isTaggable(this)) {
        const tags = this.tags.renderTags();
        this.properties.tags = tags === undefined ? this.properties.tags : tags;
      }
      // merge property overrides onto properties and then render (and validate).
      const properties = this.renderProperties(deepMerge(this.properties || { }, this.untypedPropertyOverrides));

      return {
        Resources: {
          // Post-Resolve operation since otherwise deepMerge is going to mix values into
          // the Token objects returned by ignoreEmpty.
          [this.logicalId]: new PostResolveToken({
            Type: this.resourceType,
            Properties: ignoreEmpty(properties),
            DependsOn: ignoreEmpty(renderDependsOn(this.dependsOn)),
            CreationPolicy:  capitalizePropertyNames(this, this.options.creationPolicy),
            UpdatePolicy: capitalizePropertyNames(this, this.options.updatePolicy),
            UpdateReplacePolicy: capitalizePropertyNames(this, this.options.updateReplacePolicy),
            DeletionPolicy: capitalizePropertyNames(this, this.options.deletionPolicy),
            Metadata: ignoreEmpty(this.options.metadata),
            Condition: this.options.condition && this.options.condition.logicalId
          }, props => deepMerge(props, this.rawOverrides))
        }
      };
    } catch (e) {
      // Change message
      e.message = `While synthesizing ${this.node.path}: ${e.message}`;
      // Adjust stack trace (make it look like node built it, too...)
      const creationStack = ['--- resource created at ---', ...this.creationStackTrace].join('\n  at ');
      const problemTrace = e.stack.substr(e.stack.indexOf(e.message) + e.message.length);
      e.stack = `${e.message}\n  ${creationStack}\n  --- problem discovered at ---${problemTrace}`;
      // Re-throw
      throw e;
    }

    // returns the set of logical ID (tokens) this resource depends on
    // sorted by construct paths to ensure test determinism
    function renderDependsOn(dependsOn: Set<Resource>) {
      return Array
        .from(dependsOn)
        .sort((x, y) => x.node.path.localeCompare(y.node.path))
        .map(r => r.logicalId);
    }
  }

  protected renderProperties(properties: any): { [key: string]: any } {
    return properties;
  }

}

export enum TagType {
  Standard = 'StandardTag',
  AutoScalingGroup = 'AutoScalingGroupTag',
  Map = 'StringToStringMap',
  NotTaggable = 'NotTaggable',
}

export interface ResourceOptions {
  /**
   * A condition to associate with this resource. This means that only if the condition evaluates to 'true' when the stack
   * is deployed, the resource will be included. This is provided to allow CDK projects to produce legacy templates, but noramlly
   * there is no need to use it in CDK projects.
   */
  condition?: Condition;

  /**
   * Associate the CreationPolicy attribute with a resource to prevent its status from reaching create complete until
   * AWS CloudFormation receives a specified number of success signals or the timeout period is exceeded. To signal a
   * resource, you can use the cfn-signal helper script or SignalResource API. AWS CloudFormation publishes valid signals
   * to the stack events so that you track the number of signals sent.
   */
  creationPolicy?: CreationPolicy;

  /**
   * With the DeletionPolicy attribute you can preserve or (in some cases) backup a resource when its stack is deleted.
   * You specify a DeletionPolicy attribute for each resource that you want to control. If a resource has no DeletionPolicy
   * attribute, AWS CloudFormation deletes the resource by default. Note that this capability also applies to update operations
   * that lead to resources being removed.
   */
  deletionPolicy?: DeletionPolicy;

  /**
   * Use the UpdatePolicy attribute to specify how AWS CloudFormation handles updates to the AWS::AutoScaling::AutoScalingGroup
   * resource. AWS CloudFormation invokes one of three update policies depending on the type of change you make or whether a
   * scheduled action is associated with the Auto Scaling group.
   */
  updatePolicy?: UpdatePolicy;

  /**
   * Use the UpdateReplacePolicy attribute to retain or (in some cases) backup the existing physical instance of a resource
   * when it is replaced during a stack update operation.
   */
  updateReplacePolicy?: DeletionPolicy;

  /**
   * Metadata associated with the CloudFormation resource. This is not the same as the construct metadata which can be added
   * using construct.addMetadata(), but would not appear in the CloudFormation template automatically.
   */
  metadata?: { [key: string]: any };
}

/**
 * Merges `source` into `target`, overriding any existing values.
 * `null`s will cause a value to be deleted.
 */
export function deepMerge(target: any, source: any) {
  if (typeof(source) !== 'object' || typeof(target) !== 'object') {
    throw new Error(`Invalid usage. Both source (${JSON.stringify(source)}) and target (${JSON.stringify(target)}) must be objects`);
  }

  for (const key of Object.keys(source)) {
    const value = source[key];
    if (typeof(value) === 'object' && value != null && !Array.isArray(value)) {
      // if the value at the target is not an object, override it with an
      // object so we can continue the recursion
      if (typeof(target[key]) !== 'object') {
        target[key] = { };
      }

      deepMerge(target[key], value);

      // if the result of the merge is an empty object, it's because the
      // eventual value we assigned is `undefined`, and there are no
      // sibling concrete values alongside, so we can delete this tree.
      const output = target[key];
      if (typeof(output) === 'object' && Object.keys(output).length === 0) {
        delete target[key];
      }
    } else if (value === undefined) {
      delete target[key];
    } else {
      target[key] = value;
    }
  }

  return target;
}
