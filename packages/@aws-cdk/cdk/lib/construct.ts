import cxapi = require('@aws-cdk/cx-api');
import { IAspect } from './aspect';
import { DependableTrait, IDependable } from './dependency';
import { createStackTrace } from './private/stack-trace';
import { IResolvable } from './resolvable';
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
    this.prepare(root);

    // do not allow adding children after this stage
    root._lock();

    try {
      // validate
      const validate = options.skipValidation === undefined ? true : !options.skipValidation;
      if (validate) {
        const errors = this.validate(root);
        if (errors.length > 0) {
          const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
          throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
        }
      }

      // synthesize (leaves first)
      for (const construct of root.findAll(ConstructOrder.PostOrder)) {
        (construct as any).synthesize({ assembly: builder }); // "as any" is needed because we want to keep "synthesize" protected
      }
    } finally {
      root._unlock();
    }

    // write session manifest and lock store
    return builder.build(options);
  }

  /**
   * Invokes "prepare" on all constructs (depth-first, post-order) in the tree under `node`.
   * @param node The root node
   */
  public static prepare(node: ConstructNode) {
    const constructs = node.findAll(ConstructOrder.PreOrder);

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
   * Invokes "validate" on all constructs in the tree (depth-first, pre-order) and returns
   * the list of all errors. An empty list indicates that there are no errors.
   *
   * @param node The root node
   */
  public static validate(node: ConstructNode) {
    let errors = new Array<ValidationError>();

    for (const child of node.children) {
      errors = errors.concat(this.validate(child.node));
    }

    const localErrors: string[] = (node.host as any).validate(); // "as any" is needed because we want to keep "validate" protected
    return errors.concat(localErrors.map(msg => ({ source: node.host, message: msg })));
  }

  /**
   * Returns the scope in which this construct is defined.
   *
   * The value is `undefined` at the root of the construct scope tree.
   */
  public readonly scope?: IConstruct;

  /**
   * The id of this construct within the current scope.
   *
   * This is a a scope-unique id. To obtain an app-unique id for this construct, use `uniqueId`.
   */
  public readonly id: string;

  private _locked = false; // if this is "true", addChild will fail
  private readonly _aspects: IAspect[] = [];
  private readonly _children: { [id: string]: IConstruct } = { };
  private readonly _context: { [key: string]: any } = { };
  private readonly _metadata = new Array<cxapi.MetadataEntry>();
  private readonly _references = new Set<Reference>();
  private readonly _dependencies = new Set<IDependable>();
  private readonly invokedAspects: IAspect[] = [];

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

    if (Token.isUnresolved(id)) {
      throw new Error(`Cannot use tokens in construct ID: ${id}`);
    }
  }

  /**
   * The full, absolute path of this construct in the tree.
   *
   * Components are separated by '/'.
   */
  public get path(): string {
    const components = this.scopes.slice(1).map(c => c.node.id);
    return components.join(ConstructNode.PATH_SEP);
  }

  /**
   * A tree-global unique alphanumeric identifier for this construct.
   * Includes all components of the tree.
   */
  public get uniqueId(): string {
    const components = this.scopes.slice(1).map(c => c.node.id);
    return components.length > 0 ? makeUniqueId(components) : '';
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
    this._context[key] = value;
  }

  /**
   * Retrieves a value from tree context.
   *
   * Context is usually initialized at the root, but can be overridden at any point in the tree.
   *
   * @param key The context key
   * @returns The context value or `undefined` if there is no context value for thie key.
   */
  public tryGetContext(key: string): any {
    const value = this._context[key];
    if (value !== undefined) { return value; }

    return this.scope && this.scope.node.tryGetContext(key);
  }

  /**
   * An immutable array of metadata objects associated with this construct.
   * This can be used, for example, to implement support for deprecation notices, source mapping, etc.
   */
  public get metadata() {
    return [ ...this._metadata ];
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

    const trace = this.tryGetContext(cxapi.DISABLE_METADATA_STACK_TRACE) ? undefined : createStackTrace(from || this.addMetadata);
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
   * Applies the aspect to this Constructs node
   */
  public applyAspect(aspect: IAspect): void {
    this._aspects.push(aspect);
    return;
  }

  /**
   * All parent scopes of this construct.
   *
   * @returns a list of parent scopes. The last element in the list will always
   * be the current construct and the first element will be the root of the
   * tree.
   */
  public get scopes(): IConstruct[] {
    const ret = new Array<IConstruct>();

    let curr: IConstruct | undefined = this.host;
    while (curr) {
      ret.unshift(curr);
      curr = curr.node && curr.node.scope;
    }

    return ret;
  }

  /**
   * @returns The root of the construct tree.
   */
  public get root() {
    return this.scopes[0];
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
   * Record a reference originating from this construct node
   */
  public addReference(...refs: IResolvable[]) {
    for (const ref of refs) {
      if (Reference.isReference(ref)) {
        this._references.add(ref);
      }
    }
  }

  /**
   * Return all references originating from this node or any of its children
   */
  public get references(): OutgoingReference[] {
    const ret = new Set<OutgoingReference>();

    function recurse(node: ConstructNode) {
      for (const reference of node._references) {
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
      this._dependencies.add(dependency);
    }
  }

  /**
   * Return all dependencies registered on this node or any of its children
   */
  public get dependencies(): Dependency[] {
    const found = new Map<IConstruct, Set<IConstruct>>(); // Deduplication map
    const ret = new Array<Dependency>();

    for (const source of this.findAll()) {
      for (const dependable of source.node._dependencies) {
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
   * Locks this construct from allowing more children to be added. After this
   * call, no more children can be added to this construct or to any children.
   * @internal
   */
  private _lock() {
    this._locked = true;
  }

  /**
   * Unlocks this costruct and allows mutations (adding children).
   * @internal
   */
  private _unlock() {
    this._locked = false;
  }

  /**
   * Adds a child construct to this node.
   *
   * @param child The child construct
   * @param childName The type name of the child construct.
   * @returns The resolved path part name of the child
   */
  private addChild(child: Construct, childName: string) {
    if (this.locked) {

      // special error if root is locked
      if (!this.path) {
        throw new Error('Cannot add children during synthesis');
      }

      throw new Error(`Cannot add children to "${this.path}" during synthesis`);
    }

    if (childName in this._children) {
      const name = this.id || '';
      const typeName = this.host.constructor.name;
      throw new Error(`There is already a Construct with name '${childName}' in ${typeName}${name.length > 0 ? ' [' + name + ']' : ''}`);
    }

    this._children[childName] = child;
  }

  /**
   * Triggers each aspect to invoke visit
   */
  private invokeAspects(): void {
    const descendants = this.findAll();
    for (const aspect of this._aspects) {
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
    return typeof x === 'object' && x !== null && CONSTRUCT_SYMBOL in x;
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
    return this.node.path || '<root>';
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
 * Represents a reference that originates from a specific construct.
 */
export interface OutgoingReference {
  /**
   * The originating construct.
   */
  readonly source: IConstruct;

  /**
   * The reference.
   */
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
