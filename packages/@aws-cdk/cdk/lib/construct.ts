import cxapi = require('@aws-cdk/cx-api');
import { IAspect } from './aspect';
import { CLOUDFORMATION_TOKEN_RESOLVER, CloudFormationLang } from './cloudformation-lang';
import { DependableTrait, IDependable } from './dependency';
import { resolve } from './resolve';
import { createStackTrace } from './stack-trace';
import { Token } from './token';
import { makeUniqueId } from './uniqueid';

const CONSTRUCT_SYMBOL = Symbol.for('@aws-cdk/cdk.Construct');

/**
 * Represents a construct.
 */
export interface IConstruct extends IDependable {
  /**
   * The construct node in the scope tree.
   */
  readonly node: ConstructNode;
}

/**
 * Represents the construct node in the scope tree.
 */
export class ConstructNode {
  /**
   * Separator used to delimit construct path components.
   */
  public static readonly PATH_SEP = '/';

  /**
   * Synthesizes a CloudAssembly from a construct tree.
   * @param root The root of the construct tree.
   * @param options Synthesis options.
   */
  public static synth(root: ConstructNode, options: SynthesisOptions = { }): cxapi.CloudAssembly {
    const builder = new cxapi.CloudAssemblyBuilder(options.outdir);

    // the three holy phases of synthesis: prepare, validate and synthesize

    // prepare
    root.prepareTree();

    // validate
    const validate = options.skipValidation === undefined ? true : !options.skipValidation;
    if (validate) {
      const errors = root.validateTree();
      if (errors.length > 0) {
        const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
        throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
      }
    }

    // synthesize (leaves first)
    for (const construct of root.findAll(ConstructOrder.PostOrder)) {
      (construct as any).synthesize({ assembly: builder }); // "as any" is needed because we want to keep "synthesize" protected
    }

    // write session manifest and lock store
    return builder.build(options);
  }

  /**
   * Returns the scope in which this construct is defined.
   */
  public readonly scope?: IConstruct;

  /**
   * The scoped construct ID
   * This ID is unique amongst all constructs defined in the same scope.
   * To obtain a global unique id for this construct, use `uniqueId`.
   */
  public readonly id: string;

  /**
   * An array of aspects applied to this node
   */
  private readonly aspects: IAspect[] = [];

  /**
   * List of children and their names
   */
  private readonly _children: { [name: string]: IConstruct } = { };
  private readonly context: { [key: string]: any } = { };
  private readonly _metadata = new Array<cxapi.MetadataEntry>();
  private readonly references = new Set<Reference>();
  private readonly dependencies = new Set<IDependable>();

  /** Will be used to cache the value of ``this.stack``. */
  private _stack?: import('./stack').Stack;

  /**
   * If this is set to 'true'. addChild() calls for this construct and any child
   * will fail. This is used to prevent tree mutations during synthesis.
   */
  private _locked = false;

  private invokedAspects: IAspect[] = [];

  constructor(private readonly host: Construct, scope: IConstruct, id: string) {
    id = id || ''; // if undefined, convert to empty string

    this.id = id;
    this.scope = scope;

    // We say that scope is required, but root scopes will bypass the type
    // checks and actually pass in 'undefined'.
    if (scope != null) {
      if (id === '') {
        throw new Error('Only root constructs may have an empty name');
      }

      // Has side effect so must be very last thing in constructor
      scope.node.addChild(host, this.id);
    } else {
      // This is a root construct.
      this.id = id;
    }

    // escape any path separators so they don't wreck havoc
    this.id = this._escapePathSeparator(this.id);

    if (Token.isToken(id)) {
      throw new Error(`Cannot use tokens in construct ID: ${id}`);
    }
  }

  /**
   * The stack the construct is a part of.
   */
  public get stack(): import('./stack').Stack {
    // Lazy import to break cyclic import
    const stack: typeof import('./stack') = require('./stack');
    return this._stack || (this._stack = _lookStackUp(this));

    function _lookStackUp(_this: ConstructNode): import('./stack').Stack  {
      if (stack.Stack.isStack(_this.host)) {
        return _this.host;
      }
      if (!_this.scope) {
        throw new Error(`No stack could be identified for the construct at path ${_this.path}`);
      }
      return _this.scope.node.stack;
    }
  }

  /**
   * The full, absolute path of this construct in the tree.
   *
   * Components are separated by '/'.
   */
  public get path(): string {
    const components = this.ancestors().slice(1).map(c => c.node.id);
    return components.join(ConstructNode.PATH_SEP);
  }

  /**
   * A tree-global unique alphanumeric identifier for this construct.
   * Includes all components of the tree.
   */
  public get uniqueId(): string {
    const components = this.ancestors().slice(1).map(c => c.node.id);
    return components.length > 0 ? makeUniqueId(components) : '';
  }

  /**
   * Returns a string with a tree representation of this construct and it's children.
   */
  public toTreeString(depth = 0) {
    let out = '';
    for (let i = 0; i < depth; ++i) {
      out += '  ';
    }
    const name = this.id || '';
    out += `${this.typename}${name.length > 0 ? ' [' + name + ']' : ''}\n`;
    for (const child of this.children) {
      out += child.node.toTreeString(depth + 1);
    }
    return out;
  }

  /**
   * Return a descendant by path, or undefined
   *
   * Note that if the original ID of the construct you are looking for contained
   * a '/', then it would have been replaced by '--'.
   *
   * @param path Relative path of a direct or indirect child
   * @returns a child by path or undefined if not found.
   */
  public tryFindChild(path: string): IConstruct | undefined {
    if (path.startsWith(ConstructNode.PATH_SEP)) {
      throw new Error('Path must be relative');
    }
    const parts = path.split(ConstructNode.PATH_SEP);

    let curr: IConstruct | undefined = this.host;
    while (curr != null && parts.length > 0) {
      curr = curr.node._children[parts.shift()!];
    }
    return curr;
  }

  /**
   * Return a descendant by path
   *
   * Throws an exception if the descendant is not found.
   *
   * Note that if the original ID of the construct you are looking for contained
   * a '/', then it would have been replaced by '--'.
   *
   * @param path Relative path of a direct or indirect child
   * @returns Child with the given path.
   */
  public findChild(path: string): IConstruct {
    const ret = this.tryFindChild(path);
    if (!ret) {
      throw new Error(`No child with path: '${path}'`);
    }
    return ret;
  }

  /**
   * Returns the child construct that has the id "Default" or "Resource".
   * @throws if there is more than one child
   * @returns a construct or undefined if there is no default child
   */
  public get defaultChild(): IConstruct | undefined {
    const resourceChild = this.tryFindChild('Resource');
    const defaultChild = this.tryFindChild('Default');
    if (resourceChild && defaultChild) {
      throw new Error(`Cannot determine default child for ${this.path}. There is both a child with id "Resource" and id "Default"`);
    }

    return defaultChild || resourceChild;
  }

  /**
   * All direct children of this construct.
   */
  public get children() {
    return Object.values(this._children);
  }

  /**
   * Return this construct and all of its children in the given order
   */
  public findAll(order: ConstructOrder = ConstructOrder.PreOrder): IConstruct[] {
    const ret = new Array<IConstruct>();
    visit(this.host);
    return ret;

    function visit(node: IConstruct) {
      if (order === ConstructOrder.PreOrder) {
        ret.push(node);
      }

      for (const child of node.node.children) {
        visit(child);
      }

      if (order === ConstructOrder.PostOrder) {
        ret.push(node);
      }
    }
  }

  /**
   * This can be used to set contextual values.
   * Context must be set before any children are added, since children may consult context info during construction.
   * If the key already exists, it will be overridden.
   * @param key The context key
   * @param value The context value
   */
  public setContext(key: string, value: any) {
    if (this.children.length > 0) {
      const names = this.children.map(c => c.node.id);
      throw new Error('Cannot set context after children have been added: ' + names.join(','));
    }
    this.context[key] = value;
  }

  /**
   * Retrieves a value from tree context.
   *
   * Context is usually initialized at the root, but can be overridden at any point in the tree.
   *
   * @param key The context key
   * @returns The context value or undefined
   */
  public getContext(key: string): any {
    const value = this.context[key];
    if (value !== undefined) { return value; }

    return this.scope && this.scope.node.getContext(key);
  }

  /**
   * Retrieve a value from tree-global context
   *
   * It is an error if the context object is not available.
   */
  public requireContext(key: string): any {
    const value = this.getContext(key);

    if (value == null) {
      throw new Error(`You must supply a context value named '${key}'`);
    }

    return value;
  }

  /**
   * An array of metadata objects associated with this construct.
   * This can be used, for example, to implement support for deprecation notices, source mapping, etc.
   */
  public get metadata() {
    return this._metadata;
  }

  /**
   * Adds a metadata entry to this construct.
   * Entries are arbitrary values and will also include a stack trace to allow tracing back to
   * the code location for when the entry was added. It can be used, for example, to include source
   * mapping in CloudFormation templates to improve diagnostics.
   *
   * @param type a string denoting the type of metadata
   * @param data the value of the metadata (can be a Token). If null/undefined, metadata will not be added.
   * @param from a function under which to restrict the metadata entry's stack trace (defaults to this.addMetadata)
   */
  public addMetadata(type: string, data: any, from?: any): void {
    if (data == null) {
      return;
    }

    const trace = this.getContext(cxapi.DISABLE_METADATA_STACK_TRACE) ? undefined : createStackTrace(from || this.addMetadata);
    this._metadata.push({ type, data, trace });
  }

  /**
   * Adds a { "aws:cdk:info": <message> } metadata entry to this construct.
   * The toolkit will display the info message when apps are synthesized.
   * @param message The info message.
   */
  public addInfo(message: string): void {
    this.addMetadata(cxapi.INFO_METADATA_KEY, message);
  }

  /**
   * Adds a { warning: <message> } metadata entry to this construct.
   * The toolkit will display the warning when an app is synthesized, or fail
   * if run in --strict mode.
   * @param message The warning message.
   */
  public addWarning(message: string): void {
    this.addMetadata(cxapi.WARNING_METADATA_KEY, message);
  }

  /**
   * Adds an { error: <message> } metadata entry to this construct.
   * The toolkit will fail synthesis when errors are reported.
   * @param message The error message.
   */
  public addError(message: string) {
    this.addMetadata(cxapi.ERROR_METADATA_KEY, message);
  }

  /**
   * Invokes 'validate' on all child constructs and then on this construct (depth-first).
   * @returns A list of validation errors. If the list is empty, all constructs are valid.
   */
  public validateTree(): ValidationError[] {
    let errors = new Array<ValidationError>();

    for (const child of this.children) {
      errors = errors.concat(child.node.validateTree());
    }

    const localErrors: string[] = (this.host as any).validate(); // "as any" is needed because we want to keep "validate" protected
    return errors.concat(localErrors.map(msg => ({ source: this.host, message: msg })));
  }

  /**
   * Run 'prepare()' on all constructs in the tree
   */
  public prepareTree() {
    const constructs = this.host.node.findAll(ConstructOrder.PreOrder);
    // Aspects are applied root to leaf
    for (const construct of constructs) {
      construct.node.invokeAspects();
    }
    // Use .reverse() to achieve post-order traversal
    for (const construct of constructs.reverse()) {
      if (Construct.isConstruct(construct)) {
        (construct as any).prepare(); // "as any" is needed because we want to keep "prepare" protected
      }
    }
  }

  /**
   * Applies the aspect to this Constructs node
   */
  public apply(aspect: IAspect): void {
    this.aspects.push(aspect);
    return;
  }

  /**
   * Return the ancestors (including self) of this Construct up until and
   * excluding the indicated component
   *
   * @param upTo The construct to return the path components relative to, or the
   * entire list of ancestors (including root) if omitted. This construct will
   * not be included in the returned list.
   *
   * @returns a list of parent scopes. The last element in the list will always
   * be `this` and the first element is the oldest scope (if `upTo` is not set,
   * it will be the root of the construct tree).
   */
  public ancestors(upTo?: Construct): IConstruct[] {
    const ret = new Array<IConstruct>();

    let curr: IConstruct | undefined = this.host;
    while (curr && curr !== upTo) {
      ret.unshift(curr);
      curr = curr.node && curr.node.scope;
    }

    return ret;
  }

  /**
   * @returns The root of the construct tree.
   */
  public get root() {
    return this.ancestors()[0];
  }

  /**
   * Throws if the `props` bag doesn't include the property `name`.
   * In the future we can add some type-checking here, maybe even auto-generate during compilation.
   * @param props The props bag.
   * @param name The name of the required property.
   *
   * @deprecated use ``requireProperty`` from ``@aws-cdk/runtime`` instead.
   */
  public required(props: any, name: string): any {
    if (!(name in props)) {
      throw new Error(`Construct of type ${this.typename} is missing required property: ${name}`);
    }

    const value = props[name];
    return value;
  }

  /**
   * @returns The type name of this node.
   */
  public get typename(): string {
    const ctor: any = this.host.constructor;
    return ctor.name || 'Construct';
  }

  /**
   * Adds a child construct to this node.
   *
   * @param child The child construct
   * @param childName The type name of the child construct.
   * @returns The resolved path part name of the child
   */
  public addChild(child: Construct, childName: string) {
    if (this.locked) {

      // special error if root is locked
      if (!this.path) {
        throw new Error('Cannot add children during synthesis');
      }

      throw new Error(`Cannot add children to "${this.path}" during synthesis`);
    }

    if (childName in this._children) {
      const name = this.id || '';
      throw new Error(`There is already a Construct with name '${childName}' in ${this.typename}${name.length > 0 ? ' [' + name + ']' : ''}`);
    }

    this._children[childName] = child;
  }

  /**
   * Locks this construct from allowing more children to be added. After this
   * call, no more children can be added to this construct or to any children.
   */
  public lock() {
    this._locked = true;
  }

  /**
   * Unlocks this costruct and allows mutations (adding children).
   */
  public unlock() {
    this._locked = false;
  }

  /**
   * Returns true if this construct or the scopes in which it is defined are
   * locked.
   */
  public get locked() {
    if (this._locked) {
      return true;
    }

    if (this.scope && this.scope.node.locked) {
      return true;
    }

    return false;
  }

  /**
   * Resolve a tokenized value in the context of the current Construct
   */
  public resolve(obj: any): any {
    return resolve(obj, {
      scope: this.host,
      prefix: [],
      resolver: CLOUDFORMATION_TOKEN_RESOLVER,
    });
  }

  /**
   * Convert an object, potentially containing tokens, to a JSON string
   */
  public stringifyJson(obj: any): string {
    return CloudFormationLang.toJSON(obj).toString();
  }

  /**
   * Record a reference originating from this construct node
   */
  public recordReference(...refs: Token[]) {
    for (const ref of refs) {
      if (Reference.isReference(ref)) {
        this.references.add(ref);
      }
    }
  }

  /**
   * Return all references of the given type originating from this node or any of its children
   */
  public findReferences(): OutgoingReference[] {
    const ret = new Set<OutgoingReference>();

    function recurse(node: ConstructNode) {
      for (const reference of node.references) {
        ret.add({ source: node.host, reference });
      }

      for (const child of node.children) {
        recurse(child.node);
      }
    }

    recurse(this);

    return Array.from(ret);
  }

  /**
   * Add an ordering dependency on another Construct.
   *
   * All constructs in the dependency's scope will be deployed before any
   * construct in this construct's scope.
   */
  public addDependency(...dependencies: IDependable[]) {
    for (const dependency of dependencies) {
      this.dependencies.add(dependency);
    }
  }

  /**
   * Return all dependencies registered on this node or any of its children
   */
  public findDependencies(): Dependency[] {
    const found = new Map<IConstruct, Set<IConstruct>>(); // Deduplication map
    const ret = new Array<Dependency>();

    for (const source of this.findAll()) {
      for (const dependable of source.node.dependencies) {
        for (const target of DependableTrait.get(dependable).dependencyRoots) {
          let foundTargets = found.get(source);
          if (!foundTargets) { found.set(source, foundTargets = new Set()); }

          if (!foundTargets.has(target)) {
            ret.push({ source, target });
            foundTargets.add(target);
          }
        }
      }
    }

    return ret;
  }

  /**
   * Triggers each aspect to invoke visit
   */
  private invokeAspects(): void {
    const descendants = this.findAll();
    for (const aspect of this.aspects) {
      if (this.invokedAspects.includes(aspect)) {
        continue;
      }
      descendants.forEach( member => aspect.visit(member));
      this.invokedAspects.push(aspect);
    }
  }

  /**
   * If the construct ID contains a path separator, it is replaced by double dash (`--`).
   */
  private _escapePathSeparator(id: string) {
    if (!id) { return id; }
    return id.split(ConstructNode.PATH_SEP).join('--');
  }
}

/**
 * Represents the building block of the construct graph.
 *
 * All constructs besides the root construct must be created within the scope of
 * another construct.
 */
export class Construct implements IConstruct {
  /**
   * Return whether the given object is a Construct
   */
  public static isConstruct(x: any): x is Construct {
    return CONSTRUCT_SYMBOL in x;
  }

  /**
   * Construct tree node which offers APIs for interacting with the construct tree.
   */
  public readonly node: ConstructNode;

  /**
   * Creates a new construct node.
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings. If
   * the ID includes a path separator (`/`), then it will be replaced by double
   * dash `--`.
   */
  constructor(scope: Construct, id: string) {
    Object.defineProperty(this, CONSTRUCT_SYMBOL, { value: true });

    this.node = new ConstructNode(this, scope, id);

    // implement IDependable privately
    DependableTrait.implement(this, {
      dependencyRoots: [ this ]
    });
  }

  /**
   * Returns a string representation of this construct.
   */
  public toString() {
    const path = this.node.path;
    return this.node.typename + (path.length > 0 ? ` [${path}]` : '');
  }

  /**
   * Validate the current construct.
   *
   * This method can be implemented by derived constructs in order to perform
   * validation logic. It is called on all constructs before synthesis.
   *
   * @returns An array of validation error messages, or an empty array if there the construct is valid.
   */
  protected validate(): string[] {
    return [];
  }

  /**
   * Perform final modifications before synthesis
   *
   * This method can be implemented by derived constructs in order to perform
   * final changes before synthesis. prepare() will be called after child
   * constructs have been prepared.
   *
   * This is an advanced framework feature. Only use this if you
   * understand the implications.
   */
  protected prepare(): void {
    return;
  }

  /**
   * Allows this construct to emit artifacts into the cloud assembly during synthesis.
   *
   * This method is usually implemented by framework-level constructs such as `Stack` and `Asset`
   * as they participate in synthesizing the cloud assembly.
   *
   * @param session The synthesis session.
   */
  protected synthesize(session: ISynthesisSession): void {
    ignore(session);
  }
}

/**
 * An error returned during the validation phase.
 */
export interface ValidationError {
  /**
   * The construct which emitted the error.
   */
  readonly source: Construct;

  /**
   * The error message.
   */
  readonly message: string;
}

/**
 * In what order to return constructs
 */
export enum ConstructOrder {
  /**
   * Depth-first, pre-order
   */
  PreOrder,

  /**
   * Depth-first, post-order (leaf nodes first)
   */
  PostOrder
}

/**
 * A single dependency
 */
export interface Dependency {
  /**
   * Source the dependency
   */
  readonly source: IConstruct;

  /**
   * Target of the dependency
   */
  readonly target: IConstruct;
}

/**
 * A single dependency
 */
export interface Dependency {
  /**
   * Source the dependency
   */
  readonly source: IConstruct;

  /**
   * Target of the dependency
   */
  readonly target: IConstruct;
}

export interface OutgoingReference {
  readonly source: IConstruct;
  readonly reference: Reference;
}

/**
 * Represents a single session of synthesis. Passed into `Construct.synthesize()` methods.
 */
export interface ISynthesisSession {
  /**
   * The cloud assembly being synthesized.
   */
  assembly: cxapi.CloudAssemblyBuilder;
}

/**
 * Options for synthesis.
 */
export interface SynthesisOptions extends cxapi.AssemblyBuildOptions {
  /**
   * The output directory into which to synthesize the cloud assembly.
   * @default - creates a temporary directory
   */
  readonly outdir?: string;

  /**
   * Whether synthesis should skip the validation phase.
   * @default false
   */
  readonly skipValidation?: boolean;
}

function ignore(_x: any) {
  return;
}

// Import this _after_ everything else to help node work the classes out in the correct order...

import { Reference } from './reference';
