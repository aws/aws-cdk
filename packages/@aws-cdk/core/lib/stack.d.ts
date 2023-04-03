import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct, Construct } from 'constructs';
import { ArnComponents, ArnFormat } from './arn';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from './assets';
import { CfnElement } from './cfn-element';
import { CfnResource } from './cfn-resource';
import { Environment } from './environment';
import { PermissionsBoundary } from './permissions-boundary';
export declare const STACK_RESOURCE_LIMIT_CONTEXT = "@aws-cdk/core:stackResourceLimit";
export interface StackProps {
    /**
     * A description of the stack.
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * The AWS environment (account/region) where this stack will be deployed.
     *
     * Set the `region`/`account` fields of `env` to either a concrete value to
     * select the indicated environment (recommended for production stacks), or to
     * the values of environment variables
     * `CDK_DEFAULT_REGION`/`CDK_DEFAULT_ACCOUNT` to let the target environment
     * depend on the AWS credentials/configuration that the CDK CLI is executed
     * under (recommended for development stacks).
     *
     * If the `Stack` is instantiated inside a `Stage`, any undefined
     * `region`/`account` fields from `env` will default to the same field on the
     * encompassing `Stage`, if configured there.
     *
     * If either `region` or `account` are not set nor inherited from `Stage`, the
     * Stack will be considered "*environment-agnostic*"". Environment-agnostic
     * stacks can be deployed to any environment but may not be able to take
     * advantage of all features of the CDK. For example, they will not be able to
     * use environmental context lookups such as `ec2.Vpc.fromLookup` and will not
     * automatically translate Service Principals to the right format based on the
     * environment's AWS partition, and other such enhancements.
     *
     * @example
     *
     * // Use a concrete account and region to deploy this stack to:
     * // `.account` and `.region` will simply return these values.
     * new Stack(app, 'Stack1', {
     *   env: {
     *     account: '123456789012',
     *     region: 'us-east-1'
     *   },
     * });
     *
     * // Use the CLI's current credentials to determine the target environment:
     * // `.account` and `.region` will reflect the account+region the CLI
     * // is configured to use (based on the user CLI credentials)
     * new Stack(app, 'Stack2', {
     *   env: {
     *     account: process.env.CDK_DEFAULT_ACCOUNT,
     *     region: process.env.CDK_DEFAULT_REGION
     *   },
     * });
     *
     * // Define multiple stacks stage associated with an environment
     * const myStage = new Stage(app, 'MyStage', {
     *   env: {
     *     account: '123456789012',
     *     region: 'us-east-1'
     *   }
     * });
     *
     * // both of these stacks will use the stage's account/region:
     * // `.account` and `.region` will resolve to the concrete values as above
     * new MyStack(myStage, 'Stack1');
     * new YourStack(myStage, 'Stack2');
     *
     * // Define an environment-agnostic stack:
     * // `.account` and `.region` will resolve to `{ "Ref": "AWS::AccountId" }` and `{ "Ref": "AWS::Region" }` respectively.
     * // which will only resolve to actual values by CloudFormation during deployment.
     * new MyStack(app, 'Stack1');
     *
     * @default - The environment of the containing `Stage` if available,
     * otherwise create the stack will be environment-agnostic.
     */
    readonly env?: Environment;
    /**
     * Name to deploy the stack with
     *
     * @default - Derived from construct path.
     */
    readonly stackName?: string;
    /**
     * Stack tags that will be applied to all the taggable resources and the stack itself.
     *
     * @default {}
     */
    readonly tags?: {
        [key: string]: string;
    };
    /**
     * Synthesis method to use while deploying this stack
     *
     * The Stack Synthesizer controls aspects of synthesis and deployment,
     * like how assets are referenced and what IAM roles to use. For more
     * information, see the README of the main CDK package.
     *
     * If not specified, the `defaultStackSynthesizer` from `App` will be used.
     * If that is not specified, `DefaultStackSynthesizer` is used if
     * `@aws-cdk/core:newStyleStackSynthesis` is set to `true` or the CDK major
     * version is v2. In CDK v1 `LegacyStackSynthesizer` is the default if no
     * other synthesizer is specified.
     *
     * @default - The synthesizer specified on `App`, or `DefaultStackSynthesizer` otherwise.
     */
    readonly synthesizer?: IStackSynthesizer;
    /**
     * Whether to enable termination protection for this stack.
     *
     * @default false
     */
    readonly terminationProtection?: boolean;
    /**
     * Include runtime versioning information in this Stack
     *
     * @default `analyticsReporting` setting of containing `App`, or value of
     * 'aws:cdk:version-reporting' context key
     */
    readonly analyticsReporting?: boolean;
    /**
     * Enable this flag to allow native cross region stack references.
     *
     * Enabling this will create a CloudFormation custom resource
     * in both the producing stack and consuming stack in order to perform the export/import
     *
     * This feature is currently experimental
     *
     * @default false
     */
    readonly crossRegionReferences?: boolean;
    /**
     * Options for applying a permissions boundary to all IAM Roles
     * and Users created within this Stage
     *
     * @default - no permissions boundary is applied
     */
    readonly permissionsBoundary?: PermissionsBoundary;
}
/**
 * A root construct which represents a single CloudFormation stack.
 */
export declare class Stack extends Construct implements ITaggable {
    /**
     * Return whether the given object is a Stack.
     *
     * We do attribute detection since we can't reliably use 'instanceof'.
     */
    static isStack(x: any): x is Stack;
    /**
     * Looks up the first stack scope in which `construct` is defined. Fails if there is no stack up the tree.
     * @param construct The construct to start the search from.
     */
    static of(construct: IConstruct): Stack;
    /**
     * Tags to be applied to the stack.
     */
    readonly tags: TagManager;
    /**
     * Options for CloudFormation template (like version, transform, description).
     */
    readonly templateOptions: ITemplateOptions;
    /**
     * The AWS region into which this stack will be deployed (e.g. `us-west-2`).
     *
     * This value is resolved according to the following rules:
     *
     * 1. The value provided to `env.region` when the stack is defined. This can
     *    either be a concrete region (e.g. `us-west-2`) or the `Aws.REGION`
     *    token.
     * 3. `Aws.REGION`, which is represents the CloudFormation intrinsic reference
     *    `{ "Ref": "AWS::Region" }` encoded as a string token.
     *
     * Preferably, you should use the return value as an opaque string and not
     * attempt to parse it to implement your logic. If you do, you must first
     * check that it is a concrete value an not an unresolved token. If this
     * value is an unresolved token (`Token.isUnresolved(stack.region)` returns
     * `true`), this implies that the user wishes that this stack will synthesize
     * into a **region-agnostic template**. In this case, your code should either
     * fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
     * implement some other region-agnostic behavior.
     */
    readonly region: string;
    /**
     * The AWS account into which this stack will be deployed.
     *
     * This value is resolved according to the following rules:
     *
     * 1. The value provided to `env.account` when the stack is defined. This can
     *    either be a concrete account (e.g. `585695031111`) or the
     *    `Aws.ACCOUNT_ID` token.
     * 3. `Aws.ACCOUNT_ID`, which represents the CloudFormation intrinsic reference
     *    `{ "Ref": "AWS::AccountId" }` encoded as a string token.
     *
     * Preferably, you should use the return value as an opaque string and not
     * attempt to parse it to implement your logic. If you do, you must first
     * check that it is a concrete value an not an unresolved token. If this
     * value is an unresolved token (`Token.isUnresolved(stack.account)` returns
     * `true`), this implies that the user wishes that this stack will synthesize
     * into a **account-agnostic template**. In this case, your code should either
     * fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
     * implement some other region-agnostic behavior.
     */
    readonly account: string;
    /**
     * The environment coordinates in which this stack is deployed. In the form
     * `aws://account/region`. Use `stack.account` and `stack.region` to obtain
     * the specific values, no need to parse.
     *
     * You can use this value to determine if two stacks are targeting the same
     * environment.
     *
     * If either `stack.account` or `stack.region` are not concrete values (e.g.
     * `Aws.ACCOUNT_ID` or `Aws.REGION`) the special strings `unknown-account` and/or
     * `unknown-region` will be used respectively to indicate this stack is
     * region/account-agnostic.
     */
    readonly environment: string;
    /**
     * Whether termination protection is enabled for this stack.
     */
    readonly terminationProtection?: boolean;
    /**
     * If this is a nested stack, this represents its `AWS::CloudFormation::Stack`
     * resource. `undefined` for top-level (non-nested) stacks.
     *
     */
    readonly nestedStackResource?: CfnResource;
    /**
     * The name of the CloudFormation template file emitted to the output
     * directory during synthesis.
     *
     * Example value: `MyStack.template.json`
     */
    readonly templateFile: string;
    /**
     * The ID of the cloud assembly artifact for this stack.
     */
    readonly artifactId: string;
    /**
     * Synthesis method for this stack
     *
     */
    readonly synthesizer: IStackSynthesizer;
    /**
     * Whether version reporting is enabled for this stack
     *
     * Controls whether the CDK Metadata resource is injected
     *
     * @internal
     */
    readonly _versionReportingEnabled: boolean;
    /**
     * Whether cross region references are enabled for this stack
     *
     * @internal
     */
    readonly _crossRegionReferences: boolean;
    /**
     * Logical ID generation strategy
     */
    private readonly _logicalIds;
    /**
     * Other stacks this stack depends on
     */
    private readonly _stackDependencies;
    /**
     * Lists all missing contextual information.
     * This is returned when the stack is synthesized under the 'missing' attribute
     * and allows tooling to obtain the context and re-synthesize.
     */
    private readonly _missingContext;
    private readonly _stackName;
    /**
     * Creates a new stack.
     *
     * @param scope Parent of this stack, usually an `App` or a `Stage`, but could be any construct.
     * @param id The construct ID of this stack. If `stackName` is not explicitly
     * defined, this id (and any parent IDs) will be used to determine the
     * physical ID of the stack.
     * @param props Stack properties.
     */
    constructor(scope?: Construct, id?: string, props?: StackProps);
    /**
     * If a permissions boundary has been applied on this scope or any parent scope
     * then this will return the ARN of the permissions boundary.
     *
     * This will return the permissions boundary that has been applied to the most
     * specific scope.
     *
     * For example:
     *
     * const stage = new Stage(app, 'stage', {
     *   permissionsBoundary: PermissionsBoundary.fromName('stage-pb'),
     * });
     *
     * const stack = new Stack(stage, 'Stack', {
     *   permissionsBoundary: PermissionsBoundary.fromName('some-other-pb'),
     * });
     *
     *  Stack.permissionsBoundaryArn === 'arn:${AWS::Partition}:iam::${AWS::AccountId}:policy/some-other-pb';
     *
     * @param scope the construct scope to retrieve the permissions boundary name from
     * @returns the name of the permissions boundary or undefined if not set
     */
    private get permissionsBoundaryArn();
    /**
     * Adds an aspect to the stack that will apply the permissions boundary.
     * This will only add the aspect if the permissions boundary has been set
     */
    private addPermissionsBoundaryAspect;
    /**
     * Resolve a tokenized value in the context of the current stack.
     */
    resolve(obj: any): any;
    /**
     * Convert an object, potentially containing tokens, to a JSON string
     */
    toJsonString(obj: any, space?: number): string;
    /**
     * Convert an object, potentially containing tokens, to a YAML string
     */
    toYamlString(obj: any): string;
    /**
     * DEPRECATED
     * @deprecated use `reportMissingContextKey()`
     */
    reportMissingContext(report: cxapi.MissingContext): void;
    /**
     * Indicate that a context key was expected
     *
     * Contains instructions which will be emitted into the cloud assembly on how
     * the key should be supplied.
     *
     * @param report The set of parameters needed to obtain the context
     */
    reportMissingContextKey(report: cxschema.MissingContext): void;
    /**
     * Rename a generated logical identities
     *
     * To modify the naming scheme strategy, extend the `Stack` class and
     * override the `allocateLogicalId` method.
     */
    renameLogicalId(oldId: string, newId: string): void;
    /**
     * Allocates a stack-unique CloudFormation-compatible logical identity for a
     * specific resource.
     *
     * This method is called when a `CfnElement` is created and used to render the
     * initial logical identity of resources. Logical ID renames are applied at
     * this stage.
     *
     * This method uses the protected method `allocateLogicalId` to render the
     * logical ID for an element. To modify the naming scheme, extend the `Stack`
     * class and override this method.
     *
     * @param element The CloudFormation element for which a logical identity is
     * needed.
     */
    getLogicalId(element: CfnElement): string;
    /**
     * Add a dependency between this stack and another stack.
     *
     * This can be used to define dependencies between any two stacks within an
     * app, and also supports nested stacks.
     */
    addDependency(target: Stack, reason?: string): void;
    /**
     * Return the stacks this stack depends on
     */
    get dependencies(): Stack[];
    /**
     * The concrete CloudFormation physical stack name.
     *
     * This is either the name defined explicitly in the `stackName` prop or
     * allocated based on the stack's location in the construct tree. Stacks that
     * are directly defined under the app use their construct `id` as their stack
     * name. Stacks that are defined deeper within the tree will use a hashed naming
     * scheme based on the construct path to ensure uniqueness.
     *
     * If you wish to obtain the deploy-time AWS::StackName intrinsic,
     * you can use `Aws.STACK_NAME` directly.
     */
    get stackName(): string;
    /**
     * The partition in which this stack is defined
     */
    get partition(): string;
    /**
     * The Amazon domain suffix for the region in which this stack is defined
     */
    get urlSuffix(): string;
    /**
     * The ID of the stack
     *
     * @example
     * // After resolving, looks like
     * 'arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123'
     */
    get stackId(): string;
    /**
     * Returns the list of notification Amazon Resource Names (ARNs) for the current stack.
     */
    get notificationArns(): string[];
    /**
     * Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent.
     */
    get nested(): boolean;
    /**
     * Creates an ARN from components.
     *
     * If `partition`, `region` or `account` are not specified, the stack's
     * partition, region and account will be used.
     *
     * If any component is the empty string, an empty string will be inserted
     * into the generated ARN at the location that component corresponds to.
     *
     * The ARN will be formatted as follows:
     *
     *   arn:{partition}:{service}:{region}:{account}:{resource}{sep}{resource-name}
     *
     * The required ARN pieces that are omitted will be taken from the stack that
     * the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
     * can be 'undefined'.
     */
    formatArn(components: ArnComponents): string;
    /**
     * Given an ARN, parses it and returns components.
     *
     * IF THE ARN IS A CONCRETE STRING...
     *
     * ...it will be parsed and validated. The separator (`sep`) will be set to '/'
     * if the 6th component includes a '/', in which case, `resource` will be set
     * to the value before the '/' and `resourceName` will be the rest. In case
     * there is no '/', `resource` will be set to the 6th components and
     * `resourceName` will be set to the rest of the string.
     *
     * IF THE ARN IS A TOKEN...
     *
     * ...it cannot be validated, since we don't have the actual value yet at the
     * time of this function call. You will have to supply `sepIfToken` and
     * whether or not ARNs of the expected format usually have resource names
     * in order to parse it properly. The resulting `ArnComponents` object will
     * contain tokens for the subexpressions of the ARN, not string literals.
     *
     * If the resource name could possibly contain the separator char, the actual
     * resource name cannot be properly parsed. This only occurs if the separator
     * char is '/', and happens for example for S3 object ARNs, IAM Role ARNs,
     * IAM OIDC Provider ARNs, etc. To properly extract the resource name from a
     * Tokenized ARN, you must know the resource type and call
     * `Arn.extractResourceName`.
     *
     * @param arn The ARN string to parse
     * @param sepIfToken The separator used to separate resource from resourceName
     * @param hasName Whether there is a name component in the ARN at all. For
     * example, SNS Topics ARNs have the 'resource' component contain the topic
     * name, and no 'resourceName' component.
     *
     * @returns an ArnComponents object which allows access to the various
     * components of the ARN.
     *
     * @returns an ArnComponents object which allows access to the various
     *      components of the ARN.
     *
     * @deprecated use splitArn instead
     */
    parseArn(arn: string, sepIfToken?: string, hasName?: boolean): ArnComponents;
    /**
     * Splits the provided ARN into its components.
     * Works both if 'arn' is a string like 'arn:aws:s3:::bucket',
     * and a Token representing a dynamic CloudFormation expression
     * (in which case the returned components will also be dynamic CloudFormation expressions,
     * encoded as Tokens).
     *
     * @param arn the ARN to split into its components
     * @param arnFormat the expected format of 'arn' - depends on what format the service 'arn' represents uses
     */
    splitArn(arn: string, arnFormat: ArnFormat): ArnComponents;
    /**
     * Returns the list of AZs that are available in the AWS environment
     * (account/region) associated with this stack.
     *
     * If the stack is environment-agnostic (either account and/or region are
     * tokens), this property will return an array with 2 tokens that will resolve
     * at deploy-time to the first two availability zones returned from CloudFormation's
     * `Fn::GetAZs` intrinsic function.
     *
     * If they are not available in the context, returns a set of dummy values and
     * reports them as missing, and let the CLI resolve them by calling EC2
     * `DescribeAvailabilityZones` on the target environment.
     *
     * To specify a different strategy for selecting availability zones override this method.
     */
    get availabilityZones(): string[];
    /**
     * Register a file asset on this Stack
     *
     * @deprecated Use `stack.synthesizer.addFileAsset()` if you are calling,
     * and a different IStackSynthesizer class if you are implementing.
     */
    addFileAsset(asset: FileAssetSource): FileAssetLocation;
    /**
     * Register a docker image asset on this Stack
     *
     * @deprecated Use `stack.synthesizer.addDockerImageAsset()` if you are calling,
     * and a different `IStackSynthesizer` class if you are implementing.
     */
    addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;
    /**
     * If this is a nested stack, returns it's parent stack.
     */
    get nestedStackParent(): Stack | undefined;
    /**
     * Returns the parent of a nested stack.
     *
     * @deprecated use `nestedStackParent`
     */
    get parentStack(): Stack | undefined;
    /**
     * Add a Transform to this stack. A Transform is a macro that AWS
     * CloudFormation uses to process your template.
     *
     * Duplicate values are removed when stack is synthesized.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html
     * @param transform The transform to add
     *
     * @example
     * declare const stack: Stack;
     *
     * stack.addTransform('AWS::Serverless-2016-10-31')
     */
    addTransform(transform: string): void;
    /**
     * Adds an arbitary key-value pair, with information you want to record about the stack.
     * These get translated to the Metadata section of the generated template.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html
     */
    addMetadata(key: string, value: any): void;
    /**
     * Called implicitly by the `addDependency` helper function in order to
     * realize a dependency between two top-level stacks at the assembly level.
     *
     * Use `stack.addDependency` to define the dependency between any two stacks,
     * and take into account nested stack relationships.
     *
     * @internal
     */
    _addAssemblyDependency(target: Stack, reason?: StackDependencyReason): void;
    /**
     * Called implicitly by the `obtainDependencies` helper function in order to
     * collect resource dependencies across two top-level stacks at the assembly level.
     *
     * Use `stack.obtainDependencies` to see the dependencies between any two stacks.
     *
     * @internal
     */
    _obtainAssemblyDependencies(reasonFilter: StackDependencyReason): Element[];
    /**
     * Called implicitly by the `removeDependency` helper function in order to
     * remove a dependency between two top-level stacks at the assembly level.
     *
     * Use `stack.addDependency` to define the dependency between any two stacks,
     * and take into account nested stack relationships.
     *
     * @internal
     */
    _removeAssemblyDependency(target: Stack, reasonFilter?: StackDependencyReason): void;
    /**
     * Synthesizes the cloudformation template into a cloud assembly.
     * @internal
     */
    _synthesizeTemplate(session: ISynthesisSession, lookupRoleArn?: string): void;
    /**
     * Look up a fact value for the given fact for the region of this stack
     *
     * Will return a definite value only if the region of the current stack is resolved.
     * If not, a lookup map will be added to the stack and the lookup will be done at
     * CDK deployment time.
     *
     * What regions will be included in the lookup map is controlled by the
     * `@aws-cdk/core:target-partitions` context value: it must be set to a list
     * of partitions, and only regions from the given partitions will be included.
     * If no such context key is set, all regions will be included.
     *
     * This function is intended to be used by construct library authors. Application
     * builders can rely on the abstractions offered by construct libraries and do
     * not have to worry about regional facts.
     *
     * If `defaultValue` is not given, it is an error if the fact is unknown for
     * the given region.
     */
    regionalFact(factName: string, defaultValue?: string): string;
    /**
     * Create a CloudFormation Export for a string value
     *
     * Returns a string representing the corresponding `Fn.importValue()`
     * expression for this Export. You can control the name for the export by
     * passing the `name` option.
     *
     * If you don't supply a value for `name`, the value you're exporting must be
     * a Resource attribute (for example: `bucket.bucketName`) and it will be
     * given the same name as the automatic cross-stack reference that would be created
     * if you used the attribute in another Stack.
     *
     * One of the uses for this method is to *remove* the relationship between
     * two Stacks established by automatic cross-stack references. It will
     * temporarily ensure that the CloudFormation Export still exists while you
     * remove the reference from the consuming stack. After that, you can remove
     * the resource and the manual export.
     *
     * ## Example
     *
     * Here is how the process works. Let's say there are two stacks,
     * `producerStack` and `consumerStack`, and `producerStack` has a bucket
     * called `bucket`, which is referenced by `consumerStack` (perhaps because
     * an AWS Lambda Function writes into it, or something like that).
     *
     * It is not safe to remove `producerStack.bucket` because as the bucket is being
     * deleted, `consumerStack` might still be using it.
     *
     * Instead, the process takes two deployments:
     *
     * ### Deployment 1: break the relationship
     *
     * - Make sure `consumerStack` no longer references `bucket.bucketName` (maybe the consumer
     *   stack now uses its own bucket, or it writes to an AWS DynamoDB table, or maybe you just
     *   remove the Lambda Function altogether).
     * - In the `ProducerStack` class, call `this.exportValue(this.bucket.bucketName)`. This
     *   will make sure the CloudFormation Export continues to exist while the relationship
     *   between the two stacks is being broken.
     * - Deploy (this will effectively only change the `consumerStack`, but it's safe to deploy both).
     *
     * ### Deployment 2: remove the bucket resource
     *
     * - You are now free to remove the `bucket` resource from `producerStack`.
     * - Don't forget to remove the `exportValue()` call as well.
     * - Deploy again (this time only the `producerStack` will be changed -- the bucket will be deleted).
     */
    exportValue(exportedValue: any, options?: ExportValueOptions): string;
    /**
     * Create a CloudFormation Export for a string list value
     *
     * Returns a string list representing the corresponding `Fn.importValue()`
     * expression for this Export. The export expression is automatically wrapped with an
     * `Fn::Join` and the import value with an `Fn::Split`, since CloudFormation can only
     * export strings. You can control the name for the export by passing the `name` option.
     *
     * If you don't supply a value for `name`, the value you're exporting must be
     * a Resource attribute (for example: `bucket.bucketName`) and it will be
     * given the same name as the automatic cross-stack reference that would be created
     * if you used the attribute in another Stack.
     *
     * One of the uses for this method is to *remove* the relationship between
     * two Stacks established by automatic cross-stack references. It will
     * temporarily ensure that the CloudFormation Export still exists while you
     * remove the reference from the consuming stack. After that, you can remove
     * the resource and the manual export.
     *
     * See `exportValue` for an example of this process.
     */
    exportStringListValue(exportedValue: any, options?: ExportValueOptions): string[];
    /**
     * Returns the naming scheme used to allocate logical IDs. By default, uses
     * the `HashedAddressingScheme` but this method can be overridden to customize
     * this behavior.
     *
     * In order to make sure logical IDs are unique and stable, we hash the resource
     * construct tree path (i.e. toplevel/secondlevel/.../myresource) and add it as
     * a suffix to the path components joined without a separator (CloudFormation
     * IDs only allow alphanumeric characters).
     *
     * The result will be:
     *
     *   <path.join('')><md5(path.join('/')>
     *     "human"      "hash"
     *
     * If the "human" part of the ID exceeds 240 characters, we simply trim it so
     * the total ID doesn't exceed CloudFormation's 255 character limit.
     *
     * We only take 8 characters from the md5 hash (0.000005 chance of collision).
     *
     * Special cases:
     *
     * - If the path only contains a single component (i.e. it's a top-level
     *   resource), we won't add the hash to it. The hash is not needed for
     *   disambiguation and also, it allows for a more straightforward migration an
     *   existing CloudFormation template to a CDK stack without logical ID changes
     *   (or renames).
     * - For aesthetic reasons, if the last components of the path are the same
     *   (i.e. `L1/L2/Pipeline/Pipeline`), they will be de-duplicated to make the
     *   resulting human portion of the ID more pleasing: `L1L2Pipeline<HASH>`
     *   instead of `L1L2PipelinePipeline<HASH>`
     * - If a component is named "Default" it will be omitted from the path. This
     *   allows refactoring higher level abstractions around constructs without affecting
     *   the IDs of already deployed resources.
     * - If a component is named "Resource" it will be omitted from the user-visible
     *   path, but included in the hash. This reduces visual noise in the human readable
     *   part of the identifier.
     *
     * @param cfnElement The element for which the logical ID is allocated.
     */
    protected allocateLogicalId(cfnElement: CfnElement): string;
    /**
     * Validate stack name
     *
     * CloudFormation stack names can include dashes in addition to the regular identifier
     * character classes, and we don't allow one of the magic markers.
     *
     * @internal
     */
    protected _validateId(name: string): void;
    /**
     * Returns the CloudFormation template for this stack by traversing
     * the tree and invoking _toCloudFormation() on all Entity objects.
     *
     * @internal
     */
    protected _toCloudFormation(): any;
    /**
     * Deprecated.
     *
     * @see https://github.com/aws/aws-cdk/pull/7187
     * @returns reference itself without any change
     * @deprecated cross reference handling has been moved to `App.prepare()`.
     */
    protected prepareCrossReference(_sourceStack: Stack, reference: Reference): IResolvable;
    /**
     * Determine the various stack environment attributes.
     *
     */
    private parseEnvironment;
    /**
     * Maximum number of resources in the stack
     *
     * Set to 0 to mean "unlimited".
     */
    private get maxResources();
    /**
     * Check whether this stack has a (transitive) dependency on another stack
     *
     * Returns the list of reasons on the dependency path, or undefined
     * if there is no dependency.
     */
    private stackDependencyReasons;
    /**
     * Calculate the stack name based on the construct path
     *
     * The stack name is the name under which we'll deploy the stack,
     * and incorporates containing Stage names by default.
     *
     * Generally this looks a lot like how logical IDs are calculated.
     * The stack name is calculated based on the construct root path,
     * as follows:
     *
     * - Path is calculated with respect to containing App or Stage (if any)
     * - If the path is one component long just use that component, otherwise
     *   combine them with a hash.
     *
     * Since the hash is quite ugly and we'd like to avoid it if possible -- but
     * we can't anymore in the general case since it has been written into legacy
     * stacks. The introduction of Stages makes it possible to make this nicer however.
     * When a Stack is nested inside a Stage, we use the path components below the
     * Stage, and prefix the path components of the Stage before it.
     */
    private generateStackName;
    /**
     * The artifact ID for this stack
     *
     * Stack artifact ID is unique within the App's Cloud Assembly.
     */
    private generateStackArtifactId;
    /**
     * Generate an ID with respect to the given container construct.
     */
    private generateStackId;
    private resolveExportedValue;
    /**
     * Indicates whether the stack requires bundling or not
     */
    get bundlingRequired(): boolean;
}
/**
 * CloudFormation template options for a stack.
 */
export interface ITemplateOptions {
    /**
     * Gets or sets the description of this stack.
     * If provided, it will be included in the CloudFormation template's "Description" attribute.
     */
    description?: string;
    /**
     * Gets or sets the AWSTemplateFormatVersion field of the CloudFormation template.
     */
    templateFormatVersion?: string;
    /**
     * Gets or sets the top-level template transform for this stack (e.g. "AWS::Serverless-2016-10-31").
     *
     * @deprecated use `transforms` instead.
     */
    transform?: string;
    /**
     * Gets or sets the top-level template transform(s) for this stack (e.g. `["AWS::Serverless-2016-10-31"]`).
     */
    transforms?: string[];
    /**
     * Metadata associated with the CloudFormation template.
     */
    metadata?: {
        [key: string]: any;
    };
}
/**
 * Return the construct root path of the given construct relative to the given ancestor
 *
 * If no ancestor is given or the ancestor is not found, return the entire root path.
 */
export declare function rootPathTo(construct: IConstruct, ancestor?: IConstruct): IConstruct[];
interface StackDependencyReason {
    source?: Element;
    target?: Element;
    description?: string;
}
/**
 * Options for the `stack.exportValue()` method
 */
export interface ExportValueOptions {
    /**
     * The name of the export to create
     *
     * @default - A name is automatically chosen
     */
    readonly name?: string;
}
import { Element } from './deps';
import { Reference } from './reference';
import { IResolvable } from './resolvable';
import { IStackSynthesizer, ISynthesisSession } from './stack-synthesizers';
import { ITaggable, TagManager } from './tag-manager';
export {};
