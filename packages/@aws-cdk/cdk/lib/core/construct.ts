import cxapi = require('@aws-cdk/cx-api');
import { IAspect } from '../aspect';
import { CloudFormationJSON } from '../cloudformation/cloudformation-json';
import { makeUniqueId } from '../uniqueid';
import { IDependable } from './dependency';
import { Token, unresolved } from './tokens';
import { resolve } from './tokens/resolve';

export const PATH_SEP = '/';

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
  public readonly aspects: IAspect[] = [];

  /**
   * List of children and their names
   */
  private readonly _children: { [name: string]: IConstruct } = { };
  private readonly context: { [key: string]: any } = { };
  private readonly _metadata = new Array<MetadataEntry>();
  private readonly references = new Set<Token>();
  private readonly dependencies = new Set<IDependable>();

  /** Will be used to cache the value of ``this.stack``. */
  private _stack?: Stack;

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

    if (unresolved(id)) {
      throw new Error(`Cannot use tokens in construct ID: ${id}`);
    }
  }

  /**
   * The stack the construct is a part of.
   */
  public get stack(): Stack {
    return this._stack || (this._stack = _lookStackUp(this));

    function _lookStackUp(_this: ConstructNode) {
      if (Stack.isStack(_this.host)) {
        return _this.host;
      }
      if (!_this.scope) {
        throw new Error(`No stack could be identified for the construct at path ${_this.path}`);
      }
      return _this.scope.node.stack;
    }
  }

  /**
   * The full path of this construct in the tree.
   * Components are separated by '/'.
   */
  public get path(): string {
    const components = this.rootPath().map(c => c.node.id);
    return components.join(PATH_SEP);
  }

  /**
   * A tree-global unique alphanumeric identifier for this construct.
   * Includes all components of the tree.
   */
  public get uniqueId(): string {
    const components = this.rootPath().map(c => c.node.id);
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
   * @param name Relative name of a direct or indirect child
   * @returns a child by path or undefined if not found.
   */
  public tryFindChild(path: string): IConstruct | undefined {
    if (path.startsWith(PATH_SEP)) {
      throw new Error('Path must be relative');
    }
    const parts = path.split(PATH_SEP);

    let curr: IConstruct|undefined = this.host;
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
   * @param name Relative name of a direct or indirect child
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
    const trace = createStackTrace(from || this.addMetadata);
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

    const localErrors: string[] = (this.host as any).validate();
    return errors.concat(localErrors.map(msg => new ValidationError(this.host, msg)));
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
        (construct as any).prepare();
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
   * Return the ancestors (including self) of this Construct up until and excluding the indicated component
   *
   * @param to The construct to return the path components relative to, or
   * the entire list of ancestors (including root) if omitted.
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
   * @param name The type name of the child construct.
   * @returns The resolved path part name of the child
   */
  public addChild(child: IConstruct, childName: string) {
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
      prefix: []
    });
  }

  /**
   * Convert an object, potentially containing tokens, to a JSON string
   */
  public stringifyJson(obj: any): string {
    return CloudFormationJSON.stringify(obj, this.host).toString();
  }

  /**
   * Record a reference originating from this construct node
   */
  public recordReference(...refs: Token[]) {
    for (const ref of refs) {
      if (ref.isReference) {
        this.references.add(ref);
      }
    }
  }

  /**
   * Return all references of the given type originating from this node or any of its children
   */
  public findReferences(): Token[] {
    const ret = new Set<Token>();

    function recurse(node: ConstructNode) {
      for (const ref of node.references) {
        ret.add(ref);
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
        for (const target of dependable.dependencyRoots) {
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
   * Return the path of components up to but excluding the root
   */
  private rootPath(): IConstruct[] {
    const ancestors = this.ancestors();
    ancestors.shift();
    return ancestors;
  }

  /**
   * If the construct ID contains a path separator, it is replaced by double dash (`--`).
   */
  private _escapePathSeparator(id: string) {
    if (!id) { return id; }
    return id.split(PATH_SEP).join('--');
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
  public static isConstruct(x: IConstruct): x is Construct {
    return (x as any).prepare !== undefined && (x as any).validate !== undefined;
  }

  /**
   * Construct node.
   */
  public readonly node: ConstructNode;

  /**
   * The set of constructs that form the root of this dependable
   *
   * All resources under all returned constructs are included in the ordering
   * dependency.
   */
  public readonly dependencyRoots: IConstruct[] = [this];

  /**
   * Creates a new construct node.
   *
   * @param scope The scope in which to define this construct
   * @param id The scoped construct ID. Must be unique amongst siblings. If
   * the ID includes a path separator (`/`), then it will be replaced by double
   * dash `--`.
   */
  constructor(scope: Construct, id: string) {
    this.node = new ConstructNode(this, scope, id);
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
}

/**
 * Represents the root of a construct tree.
 * No scope and no name.
 */
export class Root extends Construct {
  constructor() {
    // Bypass type checks
    super(undefined as any, '');
  }
}

/**
 * An metadata entry in the construct.
 */
export interface MetadataEntry {
  /**
   * The type of the metadata entry.
   */
  type: string;

  /**
   * The data.
   */
  data?: any;

  /**
   * A stack trace for when the entry was created.
   */
  trace: string[];
}

export class ValidationError {
  constructor(public readonly source: IConstruct, public readonly message: string) {

  }
}

// tslint:disable-next-line:ban-types
function createStackTrace(below: Function): string[] {
  const object = { stack: '' };
  const previousLimit = Error.stackTraceLimit;
  try {
    Error.stackTraceLimit = Number.MAX_SAFE_INTEGER;
    Error.captureStackTrace(object, below);
  } finally {
    Error.stackTraceLimit = previousLimit;
  }
  if (!object.stack) {
    return [];
  }
  return object.stack.split('\n').slice(1).map(s => s.replace(/^\s*at\s+/, ''));
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
  source: IConstruct;

  /**
   * Target of the dependency
   */
  target: IConstruct;
}

/**
 * A single dependency
 */
export interface Dependency {
  /**
   * Source the dependency
   */
  source: IConstruct;

  /**
   * Target of the dependency
   */
  target: IConstruct;
}

// Import this _after_ everything else to help node work the classes out in the correct order...
import { Stack } from '../cloudformation/stack';
