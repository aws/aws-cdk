import * as cxapi from '@aws-cdk/cx-api';
import { Annotations } from './annotations';
import { CfnCondition } from './cfn-condition';
// import required to be here, otherwise causes a cycle when running the generated JavaScript
/* eslint-disable import/order */
import { CfnRefElement } from './cfn-element';
import { CfnCreationPolicy, CfnDeletionPolicy, CfnUpdatePolicy } from './cfn-resource-policy';
import { Construct, IConstruct, Node } from 'constructs';
import { addDependency, obtainDependencies, removeDependency } from './deps';
import { CfnReference } from './private/cfn-reference';
import { CLOUDFORMATION_TOKEN_RESOLVER } from './private/cloudformation-lang';
import { Reference } from './reference';
import { RemovalPolicy, RemovalPolicyOptions } from './removal-policy';
import { TagManager } from './tag-manager';
import { Tokenization } from './token';
import { capitalizePropertyNames, ignoreEmpty, PostResolveToken } from './util';
import { FeatureFlags } from './feature-flags';
import { ResolutionTypeHint } from './type-hints';

export interface CfnResourceProps {
  /**
   * CloudFormation resource type (e.g. `AWS::S3::Bucket`).
   */
  readonly type: string;

  /**
   * Resource properties.
   *
   * @default - No resource properties.
   */
  readonly properties?: { [name: string]: any };
}

/**
 * Represents a CloudFormation resource.
 */
export class CfnResource extends CfnRefElement {
  /**
   * Check whether the given construct is a CfnResource
   */
  public static isCfnResource(construct: IConstruct): construct is CfnResource {
    return (construct as any).cfnResourceType !== undefined;
  }

  // MAINTAINERS NOTE: this class serves as the base class for the generated L1
  // ("CFN") resources (such as `s3.CfnBucket`). These resources will have a
  // property for each CloudFormation property of the resource. This means that
  // if at some point in the future a property is introduced with a name similar
  // to one of the properties here, it will be "masked" by the derived class. To
  // that end, we prefix all properties in this class with `cfnXxx` with the
  // hope to avoid those conflicts in the future.

  /**
   * Options for this resource, such as condition, update policy etc.
   */
  public readonly cfnOptions: ICfnResourceOptions = {};

  /**
   * AWS resource type.
   */
  public readonly cfnResourceType: string;

  /**
   * AWS CloudFormation resource properties.
   *
   * This object is returned via cfnProperties
   * @internal
   */
  protected readonly _cfnProperties: any;

  /**
   * An object to be merged on top of the entire resource definition.
   */
  private readonly rawOverrides: any = {};

  /**
   * Logical IDs of dependencies.
   *
   * Is filled during prepare().
   */
  private readonly dependsOn = new Set<CfnResource>();

  /**
   * Creates a resource construct.
   * @param cfnResourceType The CloudFormation type of this resource (e.g. AWS::DynamoDB::Table)
   */
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id);

    if (!props.type) {
      throw new Error('The `type` property is required');
    }

    this.cfnResourceType = props.type;
    this._cfnProperties = props.properties || {};

    // if aws:cdk:enable-path-metadata is set, embed the current construct's
    // path in the CloudFormation template, so it will be possible to trace
    // back to the actual construct path.
    if (Node.of(this).tryGetContext(cxapi.PATH_METADATA_ENABLE_CONTEXT)) {
      this.addMetadata(cxapi.PATH_METADATA_KEY, Node.of(this).path);
    }
  }

  /**
   * Sets the deletion policy of the resource based on the removal policy specified.
   *
   * The Removal Policy controls what happens to this resource when it stops
   * being managed by CloudFormation, either because you've removed it from the
   * CDK application or because you've made a change that requires the resource
   * to be replaced.
   *
   * The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
   * account for data recovery and cleanup later (`RemovalPolicy.RETAIN`). In some
   * cases, a snapshot can be taken of the resource prior to deletion
   * (`RemovalPolicy.SNAPSHOT`). A list of resources that support this policy
   * can be found in the following link:
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options
   */
  public applyRemovalPolicy(policy: RemovalPolicy | undefined, options: RemovalPolicyOptions = {}) {
    policy = policy || options.default || RemovalPolicy.RETAIN;

    let deletionPolicy;

    switch (policy) {
      case RemovalPolicy.DESTROY:
        deletionPolicy = CfnDeletionPolicy.DELETE;
        break;

      case RemovalPolicy.RETAIN:
        deletionPolicy = CfnDeletionPolicy.RETAIN;
        break;

      case RemovalPolicy.SNAPSHOT:
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html
        const snapshottableResourceTypes = [
          'AWS::EC2::Volume',
          'AWS::ElastiCache::CacheCluster',
          'AWS::ElastiCache::ReplicationGroup',
          'AWS::Neptune::DBCluster',
          'AWS::RDS::DBCluster',
          'AWS::RDS::DBInstance',
          'AWS::Redshift::Cluster',
        ];

        // error if flag is set, warn if flag is not
        const problematicSnapshotPolicy = !snapshottableResourceTypes.includes(this.cfnResourceType);
        if (problematicSnapshotPolicy) {
          if (FeatureFlags.of(this).isEnabled(cxapi.VALIDATE_SNAPSHOT_REMOVAL_POLICY) ) {
            throw new Error(`${this.cfnResourceType} does not support snapshot removal policy`);
          } else {
            Annotations.of(this).addWarning(`${this.cfnResourceType} does not support snapshot removal policy. This policy will be ignored.`);
          }
        }

        deletionPolicy = CfnDeletionPolicy.SNAPSHOT;
        break;

      default:
        throw new Error(`Invalid removal policy: ${policy}`);
    }

    this.cfnOptions.deletionPolicy = deletionPolicy;
    if (options.applyToUpdateReplacePolicy !== false) {
      this.cfnOptions.updateReplacePolicy = deletionPolicy;
    }
  }

  /**
   * Returns a token for an runtime attribute of this resource.
   * Ideally, use generated attribute accessors (e.g. `resource.arn`), but this can be used for future compatibility
   * in case there is no generated attribute.
   * @param attributeName The name of the attribute.
   */
  public getAtt(attributeName: string, typeHint?: ResolutionTypeHint): Reference {
    return CfnReference.for(this, attributeName, undefined, typeHint);
  }

  /**
   * Adds an override to the synthesized CloudFormation resource. To add a
   * property override, either use `addPropertyOverride` or prefix `path` with
   * "Properties." (i.e. `Properties.TopicName`).
   *
   * If the override is nested, separate each nested level using a dot (.) in the path parameter.
   * If there is an array as part of the nesting, specify the index in the path.
   *
   * To include a literal `.` in the property name, prefix with a `\`. In most
   * programming languages you will need to write this as `"\\."` because the
   * `\` itself will need to be escaped.
   *
   * For example,
   * ```typescript
   * cfnResource.addOverride('Properties.GlobalSecondaryIndexes.0.Projection.NonKeyAttributes', ['myattribute']);
   * cfnResource.addOverride('Properties.GlobalSecondaryIndexes.1.ProjectionType', 'INCLUDE');
   * ```
   * would add the overrides
   * ```json
   * "Properties": {
   *   "GlobalSecondaryIndexes": [
   *     {
   *       "Projection": {
   *         "NonKeyAttributes": [ "myattribute" ]
   *         ...
   *       }
   *       ...
   *     },
   *     {
   *       "ProjectionType": "INCLUDE"
   *       ...
   *     },
   *   ]
   *   ...
   * }
   * ```
   *
   * The `value` argument to `addOverride` will not be processed or translated
   * in any way. Pass raw JSON values in here with the correct capitalization
   * for CloudFormation. If you pass CDK classes or structs, they will be
   * rendered with lowercased key names, and CloudFormation will reject the
   * template.
   *
   * @param path - The path of the property, you can use dot notation to
   *        override values in complex types. Any intermdediate keys
   *        will be created as needed.
   * @param value - The value. Could be primitive or complex.
   */
  public addOverride(path: string, value: any) {
    const parts = splitOnPeriods(path);
    let curr: any = this.rawOverrides;

    while (parts.length > 1) {
      const key = parts.shift()!;

      // if we can't recurse further or the previous value is not an
      // object overwrite it with an object.
      const isObject = curr[key] != null && typeof(curr[key]) === 'object' && !Array.isArray(curr[key]);
      if (!isObject) {
        curr[key] = {};
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
   * Indicates that this resource depends on another resource and cannot be
   * provisioned unless the other resource has been successfully provisioned.
   *
   * @deprecated use addDependency
   */
  public addDependsOn(target: CfnResource) {
    return this.addDependency(target);
  }

  /**
   * Indicates that this resource depends on another resource and cannot be
   * provisioned unless the other resource has been successfully provisioned.
   *
   * This can be used for resources across stacks (or nested stack) boundaries
   * and the dependency will automatically be transferred to the relevant scope.
   */
  public addDependency(target: CfnResource) {
    // skip this dependency if the target is not part of the output
    if (!target.shouldSynthesize()) {
      return;
    }

    addDependency(this, target, `{${this.node.path}}.addDependency({${target.node.path}})`);
  }

  /**
   * Indicates that this resource no longer depends on another resource.
   *
   * This can be used for resources across stacks (including nested stacks)
   * and the dependency will automatically be removed from the relevant scope.
   */
  public removeDependency(target: CfnResource) : void {
    // skip this dependency if the target is not part of the output
    if (!target.shouldSynthesize()) {
      return;
    }

    removeDependency(this, target);
  }

  /**
   * Retrieves an array of resources this resource depends on.
   *
   * This assembles dependencies on resources across stacks (including nested stacks)
   * automatically.
   */
  public obtainDependencies() {
    return obtainDependencies(this);
  }

  /**
   * Replaces one dependency with another.
   * @param target The dependency to replace
   * @param newTarget The new dependency to add
   */
  public replaceDependency(target: CfnResource, newTarget: CfnResource) : void {
    if (this.obtainDependencies().includes(target)) {
      this.removeDependency(target);
      this.addDependency(newTarget);
    } else {
      throw new Error(`"${Node.of(this).path}" does not depend on "${Node.of(target).path}"`);
    }
  }

  /**
   * Add a value to the CloudFormation Resource Metadata
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
   *
   * Note that this is a different set of metadata from CDK node metadata; this
   * metadata ends up in the stack template under the resource, whereas CDK
   * node metadata ends up in the Cloud Assembly.
   */
  public addMetadata(key: string, value: any) {
    if (!this.cfnOptions.metadata) {
      this.cfnOptions.metadata = {};
    }

    this.cfnOptions.metadata[key] = value;
  }

  /**
   * Retrieve a value value from the CloudFormation Resource Metadata
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
   *
   * Note that this is a different set of metadata from CDK node metadata; this
   * metadata ends up in the stack template under the resource, whereas CDK
   * node metadata ends up in the Cloud Assembly.
   */
  public getMetadata(key: string): any {
    return this.cfnOptions.metadata?.[key];
  }

  /**
   * @returns a string representation of this resource
   */
  public toString() {
    return `${super.toString()} [${this.cfnResourceType}]`;
  }

  /**
   * Called by the `addDependency` helper function in order to realize a direct
   * dependency between two resources that are directly defined in the same
   * stacks.
   *
   * Use `resource.addDependency` to define the dependency between two resources,
   * which also takes stack boundaries into account.
   *
   * @internal
   */
  public _addResourceDependency(target: CfnResource) {
    this.dependsOn.add(target);
  }

  /**
   * Get a shallow copy of dependencies between this resource and other resources
   * in the same stack.
   */
  public obtainResourceDependencies() {
    return Array.from(this.dependsOn.values());
  }

  /**
   * Remove a dependency between this resource and other resources in the same
   * stack.
   *
   * @internal
   */
  public _removeResourceDependency(target: CfnResource) {
    this.dependsOn.delete(target);
  }

  /**
   * Emits CloudFormation for this resource.
   * @internal
   */
  public _toCloudFormation(): object {
    if (!this.shouldSynthesize()) {
      return { };
    }

    try {
      const ret = {
        Resources: {
          // Post-Resolve operation since otherwise deepMerge is going to mix values into
          // the Token objects returned by ignoreEmpty.
          [this.logicalId]: new PostResolveToken({
            Type: this.cfnResourceType,
            Properties: ignoreEmpty(this.cfnProperties),
            DependsOn: ignoreEmpty(renderDependsOn(this.dependsOn)),
            CreationPolicy: capitalizePropertyNames(this, renderCreationPolicy(this.cfnOptions.creationPolicy)),
            UpdatePolicy: capitalizePropertyNames(this, this.cfnOptions.updatePolicy),
            UpdateReplacePolicy: capitalizePropertyNames(this, this.cfnOptions.updateReplacePolicy),
            DeletionPolicy: capitalizePropertyNames(this, this.cfnOptions.deletionPolicy),
            Version: this.cfnOptions.version,
            Description: this.cfnOptions.description,
            Metadata: ignoreEmpty(this.cfnOptions.metadata),
            Condition: this.cfnOptions.condition && this.cfnOptions.condition.logicalId,
          }, resourceDef => {
            const renderedProps = this.renderProperties(resourceDef.Properties || {});
            if (renderedProps) {
              const hasDefined = Object.values(renderedProps).find(v => v !== undefined);
              resourceDef.Properties = hasDefined !== undefined ? renderedProps : undefined;
            }
            const resolvedRawOverrides = Tokenization.resolve(this.rawOverrides, {
              scope: this,
              resolver: CLOUDFORMATION_TOKEN_RESOLVER,
              // we need to preserve the empty elements here,
              // as that's how removing overrides are represented as
              removeEmpty: false,
            });
            return deepMerge(resourceDef, resolvedRawOverrides);
          }),
        },
      };
      return ret;
    } catch (e: any) {
      // Change message
      e.message = `While synthesizing ${this.node.path}: ${e.message}`;
      // Adjust stack trace (make it look like node built it, too...)
      const trace = this.creationStack;
      if (trace) {
        const creationStack = ['--- resource created at ---', ...trace].join('\n  at ');
        const problemTrace = e.stack.slice(e.stack.indexOf(e.message) + e.message.length);
        e.stack = `${e.message}\n  ${creationStack}\n  --- problem discovered at ---${problemTrace}`;
      }

      // Re-throw
      throw e;
    }

    // returns the set of logical ID (tokens) this resource depends on
    // sorted by construct paths to ensure test determinism
    function renderDependsOn(dependsOn: Set<CfnResource>) {
      return Array
        .from(dependsOn)
        .sort((x, y) => x.node.path.localeCompare(y.node.path))
        .map(r => r.logicalId);
    }

    function renderCreationPolicy(policy: CfnCreationPolicy | undefined): any {
      if (!policy) { return undefined; }
      const result: any = { ...policy };
      if (policy.resourceSignal && policy.resourceSignal.timeout) {
        result.resourceSignal = policy.resourceSignal;
      }
      return result;
    }
  }

  protected get cfnProperties(): { [key: string]: any } {
    const props = this._cfnProperties || {};
    if (TagManager.isTaggable(this)) {
      const tagsProp: { [key: string]: any } = {};
      tagsProp[this.tags.tagPropertyName] = this.tags.renderTags();
      return deepMerge(props, tagsProp);
    }
    return props;
  }

  protected renderProperties(props: {[key: string]: any}): { [key: string]: any } {
    return props;
  }

  /**
   * Deprecated
   * @deprecated use `updatedProperties`
   *
   * Return properties modified after initiation
   *
   * Resources that expose mutable properties should override this function to
   * collect and return the properties object for this resource.
   */
  protected get updatedProperites(): { [key: string]: any } {
    return this.updatedProperties;
  }

  /**
   * Return properties modified after initiation
   *
   * Resources that expose mutable properties should override this function to
   * collect and return the properties object for this resource.
   */
  protected get updatedProperties(): { [key: string]: any } {
    return this._cfnProperties;
  }

  protected validateProperties(_properties: any) {
    // Nothing
  }

  /**
   * Can be overridden by subclasses to determine if this resource will be rendered
   * into the cloudformation template.
   *
   * @returns `true` if the resource should be included or `false` is the resource
   * should be omitted.
   */
  protected shouldSynthesize() {
    return true;
  }
}

export enum TagType {
  STANDARD = 'StandardTag',
  AUTOSCALING_GROUP = 'AutoScalingGroupTag',
  MAP = 'StringToStringMap',
  KEY_VALUE = 'KeyValue',
  NOT_TAGGABLE = 'NotTaggable',
}

export interface ICfnResourceOptions {
  /**
   * A condition to associate with this resource. This means that only if the condition evaluates to 'true' when the stack
   * is deployed, the resource will be included. This is provided to allow CDK projects to produce legacy templates, but normally
   * there is no need to use it in CDK projects.
   */
  condition?: CfnCondition;

  /**
   * Associate the CreationPolicy attribute with a resource to prevent its status from reaching create complete until
   * AWS CloudFormation receives a specified number of success signals or the timeout period is exceeded. To signal a
   * resource, you can use the cfn-signal helper script or SignalResource API. AWS CloudFormation publishes valid signals
   * to the stack events so that you track the number of signals sent.
   */
  creationPolicy?: CfnCreationPolicy;

  /**
   * With the DeletionPolicy attribute you can preserve or (in some cases) backup a resource when its stack is deleted.
   * You specify a DeletionPolicy attribute for each resource that you want to control. If a resource has no DeletionPolicy
   * attribute, AWS CloudFormation deletes the resource by default. Note that this capability also applies to update operations
   * that lead to resources being removed.
   */
  deletionPolicy?: CfnDeletionPolicy;

  /**
   * Use the UpdatePolicy attribute to specify how AWS CloudFormation handles updates to the AWS::AutoScaling::AutoScalingGroup
   * resource. AWS CloudFormation invokes one of three update policies depending on the type of change you make or whether a
   * scheduled action is associated with the Auto Scaling group.
   */
  updatePolicy?: CfnUpdatePolicy;

  /**
   * Use the UpdateReplacePolicy attribute to retain or (in some cases) backup the existing physical instance of a resource
   * when it is replaced during a stack update operation.
   */
  updateReplacePolicy?: CfnDeletionPolicy;

  /**
   * The version of this resource.
   * Used only for custom CloudFormation resources.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html
   */
  version?: string;

  /**
   * The description of this resource.
   * Used for informational purposes only, is not processed in any way
   * (and stays with the CloudFormation template, is not passed to the underlying resource,
   * even if it does have a 'description' property).
   */
  description?: string;

  /**
   * Metadata associated with the CloudFormation resource. This is not the same as the construct metadata which can be added
   * using construct.addMetadata(), but would not appear in the CloudFormation template automatically.
   */
  metadata?: { [key: string]: any };
}

/**
 * Object keys that deepMerge should not consider. Currently these include
 * CloudFormation intrinsics
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
 */

const MERGE_EXCLUDE_KEYS: string[] = [
  'Ref',
  'Fn::Base64',
  'Fn::Cidr',
  'Fn::FindInMap',
  'Fn::GetAtt',
  'Fn::GetAZs',
  'Fn::ImportValue',
  'Fn::Join',
  'Fn::Select',
  'Fn::Split',
  'Fn::Sub',
  'Fn::Transform',
  'Fn::And',
  'Fn::Equals',
  'Fn::If',
  'Fn::Not',
  'Fn::Or',
];

/**
 * Merges `source` into `target`, overriding any existing values.
 * `null`s will cause a value to be deleted.
 */
function deepMerge(target: any, ...sources: any[]) {
  for (const source of sources) {
    if (typeof(source) !== 'object' || typeof(target) !== 'object') {
      throw new Error(`Invalid usage. Both source (${JSON.stringify(source)}) and target (${JSON.stringify(target)}) must be objects`);
    }

    for (const key of Object.keys(source)) {
      const value = source[key];
      if (typeof(value) === 'object' && value != null && !Array.isArray(value)) {
        // if the value at the target is not an object, override it with an
        // object so we can continue the recursion
        if (typeof(target[key]) !== 'object') {
          target[key] = {};

          /**
           * If we have something that looks like:
           *
           *   target: { Type: 'MyResourceType', Properties: { prop1: { Ref: 'Param' } } }
           *   sources: [ { Properties: { prop1: [ 'Fn::Join': ['-', 'hello', 'world'] ] } } ]
           *
           * Eventually we will get to the point where we have
           *
           *   target: { prop1: { Ref: 'Param' } }
           *   sources: [ { prop1: { 'Fn::Join': ['-', 'hello', 'world'] } } ]
           *
           * We need to recurse 1 more time, but if we do we will end up with
           *   { prop1: { Ref: 'Param', 'Fn::Join': ['-', 'hello', 'world'] } }
           * which is not what we want.
           *
           * Instead we check to see whether the `target` value (i.e. target.prop1)
           * is an object that contains a key that we don't want to recurse on. If it does
           * then we essentially drop it and end up with:
           *
           *   { prop1: { 'Fn::Join': ['-', 'hello', 'world'] } }
           */
        } else if (Object.keys(target[key]).length === 1) {
          if (MERGE_EXCLUDE_KEYS.includes(Object.keys(target[key])[0])) {
            target[key] = {};
          }
        }

        /**
         * There might also be the case where the source is an intrinsic
         *
         *    target: {
         *      Type: 'MyResourceType',
         *      Properties: {
         *        prop1: { subprop: { name: { 'Fn::GetAtt': 'abc' } } }
         *      }
         *    }
         *    sources: [ {
         *      Properties: {
         *        prop1: { subprop: { 'Fn::If': ['SomeCondition', {...}, {...}] }}
         *      }
         *    } ]
         *
         * We end up in a place that is the reverse of the above check, the source
         * becomes an intrinsic before the target
         *
         *   target: { subprop: { name: { 'Fn::GetAtt': 'abc' } } }
         *   sources: [{
         *     'Fn::If': [ 'MyCondition', {...}, {...} ]
         *   }]
         */
        if (Object.keys(value).length === 1) {
          if (MERGE_EXCLUDE_KEYS.includes(Object.keys(value)[0])) {
            target[key] = {};
          }
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
  }

  return target;
}

/**
 * Split on periods while processing escape characters \
 */
function splitOnPeriods(x: string): string[] {
  // Build this list in reverse because it's more convenient to get the "current"
  // item by doing ret[0] than by ret[ret.length - 1].
  const ret = [''];
  for (let i = 0; i < x.length; i++) {
    if (x[i] === '\\' && i + 1 < x.length) {
      ret[0] += x[i + 1];
      i++;
    } else if (x[i] === '.') {
      ret.unshift('');
    } else {
      ret[0] += x[i];
    }
  }

  ret.reverse();
  return ret;
}
