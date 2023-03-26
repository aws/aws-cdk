import { CfnCondition } from './cfn-condition';
import { CfnRefElement } from './cfn-element';
import { CfnCreationPolicy, CfnDeletionPolicy, CfnUpdatePolicy } from './cfn-resource-policy';
import { Construct, IConstruct } from 'constructs';
import { Reference } from './reference';
import { RemovalPolicy, RemovalPolicyOptions } from './removal-policy';
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
    readonly properties?: {
        [name: string]: any;
    };
}
/**
 * Represents a CloudFormation resource.
 */
export declare class CfnResource extends CfnRefElement {
    /**
     * Check whether the given construct is a CfnResource
     */
    static isCfnResource(construct: IConstruct): construct is CfnResource;
    /**
     * Options for this resource, such as condition, update policy etc.
     */
    readonly cfnOptions: ICfnResourceOptions;
    /**
     * AWS resource type.
     */
    readonly cfnResourceType: string;
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
    private readonly rawOverrides;
    /**
     * Logical IDs of dependencies.
     *
     * Is filled during prepare().
     */
    private readonly dependsOn;
    /**
     * Creates a resource construct.
     * @param cfnResourceType The CloudFormation type of this resource (e.g. AWS::DynamoDB::Table)
     */
    constructor(scope: Construct, id: string, props: CfnResourceProps);
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
    applyRemovalPolicy(policy: RemovalPolicy | undefined, options?: RemovalPolicyOptions): void;
    /**
     * Returns a token for an runtime attribute of this resource.
     * Ideally, use generated attribute accessors (e.g. `resource.arn`), but this can be used for future compatibility
     * in case there is no generated attribute.
     * @param attributeName The name of the attribute.
     */
    getAtt(attributeName: string, typeHint?: ResolutionTypeHint): Reference;
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
    addOverride(path: string, value: any): void;
    /**
     * Syntactic sugar for `addOverride(path, undefined)`.
     * @param path The path of the value to delete
     */
    addDeletionOverride(path: string): void;
    /**
     * Adds an override to a resource property.
     *
     * Syntactic sugar for `addOverride("Properties.<...>", value)`.
     *
     * @param propertyPath The path of the property
     * @param value The value
     */
    addPropertyOverride(propertyPath: string, value: any): void;
    /**
     * Adds an override that deletes the value of a property from the resource definition.
     * @param propertyPath The path to the property.
     */
    addPropertyDeletionOverride(propertyPath: string): void;
    /**
     * Indicates that this resource depends on another resource and cannot be
     * provisioned unless the other resource has been successfully provisioned.
     *
     * @deprecated use addDependency
     */
    addDependsOn(target: CfnResource): void;
    /**
     * Indicates that this resource depends on another resource and cannot be
     * provisioned unless the other resource has been successfully provisioned.
     *
     * This can be used for resources across stacks (or nested stack) boundaries
     * and the dependency will automatically be transferred to the relevant scope.
     */
    addDependency(target: CfnResource): void;
    /**
     * Indicates that this resource no longer depends on another resource.
     *
     * This can be used for resources across stacks (including nested stacks)
     * and the dependency will automatically be removed from the relevant scope.
     */
    removeDependency(target: CfnResource): void;
    /**
     * Retrieves an array of resources this resource depends on.
     *
     * This assembles dependencies on resources across stacks (including nested stacks)
     * automatically.
     */
    obtainDependencies(): import("./deps").Element[];
    /**
     * Replaces one dependency with another.
     * @param target The dependency to replace
     * @param newTarget The new dependency to add
     */
    replaceDependency(target: CfnResource, newTarget: CfnResource): void;
    /**
     * Add a value to the CloudFormation Resource Metadata
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     *
     * Note that this is a different set of metadata from CDK node metadata; this
     * metadata ends up in the stack template under the resource, whereas CDK
     * node metadata ends up in the Cloud Assembly.
     */
    addMetadata(key: string, value: any): void;
    /**
     * Retrieve a value value from the CloudFormation Resource Metadata
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     *
     * Note that this is a different set of metadata from CDK node metadata; this
     * metadata ends up in the stack template under the resource, whereas CDK
     * node metadata ends up in the Cloud Assembly.
     */
    getMetadata(key: string): any;
    /**
     * @returns a string representation of this resource
     */
    toString(): string;
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
    _addResourceDependency(target: CfnResource): void;
    /**
     * Get a shallow copy of dependencies between this resource and other resources
     * in the same stack.
     */
    obtainResourceDependencies(): CfnResource[];
    /**
     * Remove a dependency between this resource and other resources in the same
     * stack.
     *
     * @internal
     */
    _removeResourceDependency(target: CfnResource): void;
    /**
     * Emits CloudFormation for this resource.
     * @internal
     */
    _toCloudFormation(): object;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
    /**
     * Deprecated
     * @deprecated use `updatedProperties`
     *
     * Return properties modified after initiation
     *
     * Resources that expose mutable properties should override this function to
     * collect and return the properties object for this resource.
     */
    protected get updatedProperites(): {
        [key: string]: any;
    };
    /**
     * Return properties modified after initiation
     *
     * Resources that expose mutable properties should override this function to
     * collect and return the properties object for this resource.
     */
    protected get updatedProperties(): {
        [key: string]: any;
    };
    protected validateProperties(_properties: any): void;
    /**
     * Can be overridden by subclasses to determine if this resource will be rendered
     * into the cloudformation template.
     *
     * @returns `true` if the resource should be included or `false` is the resource
     * should be omitted.
     */
    protected shouldSynthesize(): boolean;
}
export declare enum TagType {
    STANDARD = "StandardTag",
    AUTOSCALING_GROUP = "AutoScalingGroupTag",
    MAP = "StringToStringMap",
    KEY_VALUE = "KeyValue",
    NOT_TAGGABLE = "NotTaggable"
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
    metadata?: {
        [key: string]: any;
    };
}
