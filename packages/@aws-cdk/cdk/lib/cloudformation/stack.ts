import cxapi = require('@aws-cdk/cx-api');
import { App } from '../app';
import { Construct, IConstruct } from '../core/construct';
import { Environment } from '../environment';
import { CloudFormationImportContextProvider } from '../serialization/import-context-provider';
import { ExportSerializationContext, ImportDeserializationContext } from '../serialization/import-export';
import { IDeserializationContext, ISerializable, SerializationOptions } from '../serialization/serialization';
import { ArnComponents, arnFromComponents, parseArn } from './arn';
import { CfnReference } from './cfn-tokens';
import { Fn } from './fn';
import { HashedAddressingScheme, IAddressingScheme, LogicalIDs } from './logical-id';

export interface StackProps {
  /**
   * The AWS environment (account/region) where this stack will be deployed.
   *
   * If not supplied, the `default-account` and `default-region` context parameters will be
   * used. If they are undefined, it will not be possible to deploy the stack.
   */
  env?: Environment;

  /**
   * Strategy for logical ID generation
   *
   * Optional. If not supplied, the HashedNamingScheme will be used.
   */
  namingScheme?: IAddressingScheme;
}

/**
 * A root construct which represents a single CloudFormation stack.
 */
export class Stack extends Construct {
  /**
   * Traverses the tree and looks up for the Stack root.
   * @param scope A construct in the tree
   * @returns The Stack object (throws if the node is not part of a Stack-rooted tree)
   */
  public static find(scope: IConstruct): Stack {
    const curr = Stack.tryFind(scope);
    if (curr == null) {
      throw new Error(`Cannot find a Stack parent for '${scope.toString()}'`);
    }
    return curr;
  }

  /**
   * Traverses the tree and looks up for the Stack root.
   *
   * @param scope A construct in the tree
   * @returns The Stack object, or undefined if no stack was found.
   */
  public static tryFind(scope: IConstruct): Stack | undefined {
    let curr: IConstruct | undefined = scope;
    while (curr != null && !Stack.isStack(curr)) {
      curr = curr.node.scope;
    }
    return curr;
  }

  /**
   * Adds a metadata annotation "aws:cdk:physical-name" to the construct if physicalName
   * is non-null. This can be used later by tools and aspects to determine if resources
   * have been created with physical names.
   */
  public static annotatePhysicalName(construct: Construct, physicalName?: string) {
    if (physicalName == null) {
      return;
    }

    construct.node.addMetadata('aws:cdk:physical-name', physicalName);
  }

  /**
   * Return whether the given object is a Stack.
   *
   * We do attribute detection since we can't reliably use 'instanceof'.
   */
  public static isStack(construct: IConstruct): construct is Stack {
    return (construct as any)._isStack;
  }

  private static readonly VALID_STACK_NAME_REGEX = /^[A-Za-z][A-Za-z0-9-]*$/;

  /**
   * Lists all missing contextual information.
   * This is returned when the stack is synthesized under the 'missing' attribute
   * and allows tooling to obtain the context and re-synthesize.
   */
  public readonly missingContext: { [key: string]: cxapi.MissingContext } = { };

  /**
   * The environment in which this stack is deployed.
   */
  public readonly env: Environment;

  /**
   * Logical ID generation strategy
   */
  public readonly logicalIds: LogicalIDs;

  /**
   * Options for CloudFormation template (like version, transform, description).
   */
  public readonly templateOptions: TemplateOptions = {};

  /**
   * The CloudFormation stack name.
   */
  public readonly name: string;

  /*
   * Used to determine if this construct is a stack.
   */
  protected readonly _isStack = true;

  /**
   * Other stacks this stack depends on
   */
  private readonly stackDependencies = new Set<Stack>();

  /**
   * Creates a new stack.
   *
   * @param scope Parent of this stack, usually a Program instance.
   * @param name The name of the CloudFormation stack. Defaults to "Stack".
   * @param props Stack properties.
   */
  public constructor(scope?: App, name?: string, private readonly props?: StackProps) {
    // For unit test convenience parents are optional, so bypass the type check when calling the parent.
    super(scope!, name!);

    if (name && !Stack.VALID_STACK_NAME_REGEX.test(name)) {
      throw new Error(`Stack name must match the regular expression: ${Stack.VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
    }

    this.env = this.parseEnvironment(props);

    this.logicalIds = new LogicalIDs(props && props.namingScheme ? props.namingScheme : new HashedAddressingScheme());
    this.name = this.node.id;
  }

  /**
   * Looks up a resource by path.
   *
   * @returns The Resource or undefined if not found
   */
  public findResource(path: string): Resource | undefined {
    const r = this.node.findChild(path);
    if (!r) { return undefined; }

    // found an element, check if it's a resource (duck-type)
    if (!('resourceType' in r)) {
      throw new Error(`Found a stack element for ${path} but it is not a resource: ${r.toString()}`);
    }

    return r as Resource;
  }

  /**
   * Returns the CloudFormation template for this stack by traversing
   * the tree and invoking toCloudFormation() on all Entity objects.
   */
  public toCloudFormation() {
    // before we begin synthesis, we shall lock this stack, so children cannot be added
    this.node.lock();

    try {
      const template: any = {
        Description: this.templateOptions.description,
        Transform: this.templateOptions.transform,
        AWSTemplateFormatVersion: this.templateOptions.templateFormatVersion,
        Metadata: this.templateOptions.metadata
      };

      const elements = stackElements(this);
      const fragments = elements.map(e => this.node.resolve(e.toCloudFormation()));

      // merge in all CloudFormation fragments collected from the tree
      for (const fragment of fragments) {
        merge(template, fragment);
      }

      // resolve all tokens and remove all empties
      const ret = this.node.resolve(template) || {};

      this.logicalIds.assertAllRenamesApplied();

      return ret;
    } finally {
      // allow mutations after synthesis is finished.
      this.node.unlock();
    }
  }

  /**
   * @param why more information about why region is required.
   * @returns The region in which this stack is deployed. Throws if region is not defined.
   */
  public requireRegion(why?: string) {
    if (!this.env.region) {
      throw new Error(`${why ? why + '. ' : ''}Stack requires region information. It can be either supplied via the "env" property, ` +
          `via the "${cxapi.DEFAULT_REGION_CONTEXT_KEY}" context parameters or using "aws configure"`);
    }

    return this.env.region;
  }

  /**
   * Returns the AWS account ID of this Stack,
   * or throws an exception if the account ID is not set in the environment.
   *
   * @param why more information about why is the account ID required
   * @returns the AWS account ID of this Stack
   */
  public requireAccountId(why?: string): string {
    if (!this.env.account) {
      throw new Error(`${why ? why + '. ' : ''}Stack requires account information. ` +
        'It can be supplied either via the "env" property when creating the Stack, or by using "aws configure"');
    }

    return this.env.account;
  }

  public parentApp(): App | undefined {
    const parent = this.node.scope;
    return parent instanceof App
      ? parent
      : undefined;
  }

  /**
   * Indicate that a context key was expected
   *
   * Contains instructions on how the key should be supplied.
   * @param key Key that uniquely identifies this missing context.
   * @param details The set of parameters needed to obtain the context (specific to context provider).
   */
  public reportMissingContext(key: string, details: cxapi.MissingContext) {
    this.missingContext[key] = details;
  }

  /**
   * Rename a generated logical identities
   */
  public renameLogical(oldId: string, newId: string) {
    if (this.node.children.length > 0) {
      throw new Error("All renames must be set up before adding elements to the stack");
    }

    this.logicalIds.renameLogical(oldId, newId);
  }

  /**
   * Add a dependency between this stack and another stack
   */
  public addDependency(stack: Stack) {
    if (stack.dependsOnStack(this)) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Stack '${this.name}' already depends on stack '${stack.name}'. Adding this dependency would create a cyclic reference.`);
    }
    this.stackDependencies.add(stack);
  }

  /**
   * Return the stacks this stack depends on
   */
  public dependencies(): Stack[] {
    return Array.from(this.stackDependencies.values());
  }

  /**
   * Returns a deserialization context for importing an object which was exported under the
   * specified export name.
   *
   * @param exportName The export name specified when the object was exported.
   * @param options Import options
   */
  public importObject(exportName: string, options?: ImportOptions): IDeserializationContext {
    return new ImportDeserializationContext(this, exportName, options);
  }

  /**
   * Produces CloudFormation outputs for a serializable object under the specified
   * export name.
   *
   * @param exportName The export name prefix for all the outputs.
   * @param obj The object to serialize
   */
  public exportObject(exportName: string, obj: ISerializable): void {
    const ctx = new ExportSerializationContext(this, exportName);
    obj.serialize(ctx);
  }

  /**
   * Imports a string from another stack in the same account/region which was
   * exported under the specified export name.
   * @param exportName The export name under which the string was exported
   * @param options Import options
   */
  public importString(exportName: string, options: ImportOptions = { }): string {
    const stack = this;
    const resolve = options.resolve === undefined ? ResolveType.Synthesis : options.resolve;
    const weak = options.weak === undefined ? false : options.weak;

    if (resolve === ResolveType.Deployment && weak) {
      throw new Error(`Deployment-time import resolution cannot be "weak"`);
    }

    switch (resolve) {
      case ResolveType.Deployment:
        return Fn.importValue(exportName);
      case ResolveType.Synthesis:
        const value = new CloudFormationImportContextProvider(stack, { exportName }).parameterValue();
        if (!weak) {
          stack.addStrongReference(exportName);
        }

        return value;
    }
  }

  /**
   * Exports a string value under an export name.
   * @param exportName The export name under which to export the string. Export
   * names must be unique within the account/region.
   * @param value The value to export.
   * @param options Export options, such as description.
   */
  public exportString(exportName: string, value: string, options: ExportOptions = { }): Output {
    let output = this.node.tryFindChild(exportName) as Output;
    if (!output) {
      output =  new Output(this.exportsScope, exportName, {
        description: options.description,
        export: exportName,
        value
      });
    } else {
      if (output.value !== value) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Trying to export ${exportName}=${value} but there is already an export with a similar name and a different value (${output.value})`);
      }
    }
    return output;
  }

  /**
   * Adds a strong reference from this stack to a specific export name.
   *
   * Technically, if the stack has strong references, a WaitCondition resource
   * will be synthesized, and a metadata entry with Fn::ImportValue will be
   * added for each export name.
   *
   * @param exportName The name of the CloudFormation export to reference
   */
  public addStrongReference(exportName: string) {
    const id = 'StrongReferences8A180F';
    let strongRef = this.node.tryFindChild(id) as Resource;
    if (!strongRef) {
      strongRef = new Resource(this, id, { type: 'AWS::CloudFormation::WaitCondition' });
    }

    strongRef.options.metadata = strongRef.options.metadata || { };
    strongRef.options.metadata[exportName] = Fn.importValue(exportName);
  }

  private get exportsScope() {
    const exists = this.node.tryFindChild('Exports') as Construct;
    if (exists) {
      return exists;
    }
    return new Construct(this, 'Exports');
  }

  /**
   * The account in which this stack is defined
   *
   * Either returns the literal account for this stack if it was specified
   * literally upon Stack construction, or a symbolic value that will evaluate
   * to the correct account at deployment time.
   */
  public get accountId(): string {
    if (this.props && this.props.env && this.props.env.account) {
      return this.props.env.account;
    }
    return new Aws(this).accountId;
  }

  /**
   * The region in which this stack is defined
   *
   * Either returns the literal region for this stack if it was specified
   * literally upon Stack construction, or a symbolic value that will evaluate
   * to the correct region at deployment time.
   */
  public get region(): string {
    if (this.props && this.props.env && this.props.env.region) {
      return this.props.env.region;
    }
    return new Aws(this).region;
  }

  /**
   * The partition in which this stack is defined
   */
  public get partition(): string {
    return new Aws(this).partition;
  }

  /**
   * The Amazon domain suffix for the region in which this stack is defined
   */
  public get urlSuffix(): string {
    return new Aws(this).urlSuffix;
  }

  /**
   * The ID of the stack
   *
   * @example After resolving, looks like arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123
   */
  public get stackId(): string {
    return new Aws(this).stackId;
  }

  /**
   * The name of the stack currently being deployed
   *
   * Only available at deployment time.
   */
  public get stackName(): string {
    return new Aws(this).stackName;
  }

  /**
   * Returns the list of notification Amazon Resource Names (ARNs) for the current stack.
   */
  public get notificationArns(): string[] {
    return new Aws(this).notificationArns;
  }

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
   *   arn:{partition}:{service}:{region}:{account}:{resource}{sep}}{resource-name}
   *
   * The required ARN pieces that are omitted will be taken from the stack that
   * the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
   * can be 'undefined'.
   */
  public formatArn(components: ArnComponents): string {
    return arnFromComponents(components, this);
  }

  /**
   * Given an ARN, parses it and returns components.
   *
   * If the ARN is a concrete string, it will be parsed and validated. The
   * separator (`sep`) will be set to '/' if the 6th component includes a '/',
   * in which case, `resource` will be set to the value before the '/' and
   * `resourceName` will be the rest. In case there is no '/', `resource` will
   * be set to the 6th components and `resourceName` will be set to the rest
   * of the string.
   *
   * If the ARN includes tokens (or is a token), the ARN cannot be validated,
   * since we don't have the actual value yet at the time of this function
   * call. You will have to know the separator and the type of ARN. The
   * resulting `ArnComponents` object will contain tokens for the
   * subexpressions of the ARN, not string literals. In this case this
   * function cannot properly parse the complete final resourceName (path) out
   * of ARNs that use '/' to both separate the 'resource' from the
   * 'resourceName' AND to subdivide the resourceName further. For example, in
   * S3 ARNs:
   *
   *    arn:aws:s3:::my_corporate_bucket/path/to/exampleobject.png
   *
   * After parsing the resourceName will not contain
   * 'path/to/exampleobject.png' but simply 'path'. This is a limitation
   * because there is no slicing functionality in CloudFormation templates.
   *
   * @param sep The separator used to separate resource from resourceName
   * @param hasName Whether there is a name component in the ARN at all. For
   * example, SNS Topics ARNs have the 'resource' component contain the topic
   * name, and no 'resourceName' component.
   *
   * @returns an ArnComponents object which allows access to the various
   * components of the ARN.
   *
   * @returns an ArnComponents object which allows access to the various
   *      components of the ARN.
   */
  public parseArn(arn: string, sepIfToken: string = '/', hasName: boolean = true): ArnComponents {
    return parseArn(arn, sepIfToken, hasName);
  }

  /**
   * Validate stack name
   *
   * CloudFormation stack names can include dashes in addition to the regular identifier
   * character classes, and we don't allow one of the magic markers.
   */
  protected _validateId(name: string) {
    if (name && !Stack.VALID_STACK_NAME_REGEX.test(name)) {
      throw new Error(`Stack name must match the regular expression: ${Stack.VALID_STACK_NAME_REGEX.toString()}, got '${name}'`);
    }
  }

  /**
   * Prepare stack
   *
   * Find all CloudFormation references and tell them we're consuming them.
   *
   * Find all dependencies as well and add the appropriate DependsOn fields.
   */
  protected prepare() {
    // References
    for (const ref of this.node.findReferences()) {
      if (CfnReference.isInstance(ref)) {
        ref.consumeFromStack(this);
      }
    }

    // Resource dependencies
    for (const dependency of this.node.findDependencies()) {
      const theirStack = Stack.tryFind(dependency.target);
      if (theirStack !== undefined && theirStack !== this) {
        this.addDependency(theirStack);
      } else {
        for (const target of findResources([dependency.target])) {
          for (const source of findResources([dependency.source])) {
            source.addDependsOn(target);
          }
        }
      }
    }
  }

  /**
   * Applied defaults to environment attributes.
   */
  private parseEnvironment(props?: StackProps) {
    // start with `env`.
    const env: Environment = (props && props.env) || { };

    // if account is not specified, attempt to read from context.
    if (!env.account) {
      env.account = this.node.getContext(cxapi.DEFAULT_ACCOUNT_CONTEXT_KEY);
    }

    // if region is not specified, attempt to read from context.
    if (!env.region) {
      env.region = this.node.getContext(cxapi.DEFAULT_REGION_CONTEXT_KEY);
    }

    return env;
  }

  /**
   * Check whether this stack has a (transitive) dependency on another stack
   */
  private dependsOnStack(other: Stack) {
    if (this === other) { return true; }
    for (const dep of this.stackDependencies) {
      if (dep.dependsOnStack(other)) { return true; }
    }
    return false;
  }
}

function merge(template: any, part: any) {
  for (const section of Object.keys(part)) {
    const src = part[section];

    // create top-level section if it doesn't exist
    let dest = template[section];
    if (!dest) {
      template[section] = dest = src;
    } else {
      // add all entities from source section to destination section
      for (const id of Object.keys(src)) {
        if (id in dest) {
          throw new Error(`section '${section}' already contains '${id}'`);
        }
        dest[id] = src[id];
      }
    }
  }
}

/**
 * CloudFormation template options for a stack.
 */
export interface TemplateOptions {
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
   */
  transform?: string;

  /**
   * Metadata associated with the CloudFormation template.
   */
   metadata?: { [key: string]: any };
}

/**
 * Collect all StackElements from a construct
 *
 * @param node Root node to collect all StackElements from
 * @param into Array to append StackElements to
 * @returns The same array as is being collected into
 */
function stackElements(node: IConstruct, into: StackElement[] = []): StackElement[] {
  if (StackElement.isStackElement(node)) {
    into.push(node);
  }

  for (const child of node.node.children) {
    stackElements(child, into);
  }

  return into;
}

export interface ExportOptions {
  description?: string;
}

export interface ImportOptions {
  resolve?: ResolveType;
  weak?: boolean;
}

export enum ResolveType {
  Synthesis,
  Deployment

/**
 * Find all resources in a set of constructs
 */
function findResources(roots: Iterable<IConstruct>): Resource[] {
  const ret = new Array<Resource>();
  for (const root of roots) {
    ret.push(...root.node.findAll().filter(Resource.isResource));
  }
  return ret;
}

// These imports have to be at the end to prevent circular imports
import { ArnComponents, arnFromComponents, parseArn } from './arn';
import { Aws } from './pseudo';
import { Resource } from './resource';
import { StackElement } from './stack-element';
