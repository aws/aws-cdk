import cxapi = require('@aws-cdk/cx-api');
import { makeUniqueId } from '../util/uniqueid';
export const PATH_SEP = '/';

export class Node {
  /**
   * Returns the scope in which this construct is defined.
   */
  public readonly scope?: Construct;

  /**
   * The scoped construct ID
   * This ID is unique amongst all constructs defined in the same scope.
   * To obtain a global unique id for this construct, use `uniqueId`.
   */
  public readonly scid: string;

  /**
   * The full path of this construct in the tree.
   * Components are separated by '/'.
   */
  public readonly path: string;

  /**
   * A tree-global unique alphanumeric identifier for this construct.
   * Includes all components of the tree.
   */
  public readonly uniqueId: string;

  /**
   * List of children and their names
   */
  private readonly _children: { [name: string]: Construct } = { };
  private readonly context: { [key: string]: any } = { };
  private readonly _metadata = new Array<MetadataEntry>();

  /**
   * If this is set to 'true'. addChild() calls for this construct and any child
   * will fail. This is used to prevent tree mutations during synthesis.
   */
  private _locked = false;

  constructor(private readonly host: Construct, scope: Construct, scid: string) {
    scid = scid || ''; // if undefined, convert to empty string

    this.scid = scid;
    this.scope = scope;

    // We say that scope is required, but root scopes will bypass the type
    // checks and actually pass in 'undefined'.
    if (scope != null) {
      if (scid === '') {
        throw new Error('Only root constructs may have an empty name');
      }

      // Has side effect so must be very last thing in constructor
      scope.node.addChild(host, this.scid);
    } else {
      // This is a root construct.
      this.scid = scid;
    }

    // escape any path separators so they don't wreck havoc
    this.scid = this._escapePathSeparator(this.scid);

    const components = this.rootPath().map(c => c.node.scid);
    this.path = components.join(PATH_SEP);
    this.uniqueId = components.length > 0 ? makeUniqueId(components) : '';
  }

  /**
   * Returns a string with a tree representation of this construct and it's children.
   */
  public toTreeString(depth = 0) {
    let out = '';
    for (let i = 0; i < depth; ++i) {
      out += '  ';
    }
    const name = this.scid || '';
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
  public tryFindChild(path: string): Construct | undefined {
    // tslint:disable-next-line:no-console
    if (path.startsWith(PATH_SEP)) {
      throw new Error('Path must be relative');
    }
    const parts = path.split(PATH_SEP);

    let curr: Construct|undefined = this.host;
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
  public findChild(path: string): Construct {
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
    return Object.keys(this._children).map(k => this._children[k]);
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
      const names = this.children.map(c => c.node.scid);
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
  public addMetadata(type: string, data: any, from?: any): Construct {
    if (data == null) {
      return this.host;
    }
    const trace = createStackTrace(from || this.addMetadata);
    this._metadata.push({ type, data, trace });
    return this.host;
  }

  /**
   * Adds a { "aws:cdk:info": <message> } metadata entry to this construct.
   * The toolkit will display the info message when apps are synthesized.
   * @param message The info message.
   */
  public addInfo(message: string): Construct {
    return this.addMetadata(cxapi.INFO_METADATA_KEY, message);
  }

  /**
   * Adds a { warning: <message> } metadata entry to this construct.
   * The toolkit will display the warning when an app is synthesized, or fail
   * if run in --strict mode.
   * @param message The warning message.
   */
  public addWarning(message: string): Construct {
    return this.addMetadata(cxapi.WARNING_METADATA_KEY, message);
  }

  /**
   * Adds an { error: <message> } metadata entry to this construct.
   * The toolkit will fail synthesis when errors are reported.
   * @param message The error message.
   */
  public addError(message: string): Construct {
    return this.addMetadata(cxapi.ERROR_METADATA_KEY, message);
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

    // we use "as any" in order to allow "validate" to be "protected"
    const localErrors: string[] = (this.host as any).validate();
    return errors.concat(localErrors.map(msg => new ValidationError(this.host, msg)));
  }

  /**
   * Return the ancestors (including self) of this Construct up until and excluding the indicated component
   *
   * @param to The construct to return the path components relative to, or
   * the entire list of ancestors (including root) if omitted.
   */
  public ancestors(upTo?: Construct): Construct[] {
    const ret = new Array<Construct>();

    let curr: Construct | undefined = this.host;
    while (curr && curr !== upTo) {
      ret.unshift(curr);
      curr = curr.node.scope;
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
    const ctor: any = this.constructor;
    return ctor.name || 'Construct';
  }

  /**
   * Adds a child construct to this node.
   *
   * @param child The child construct
   * @param name The type name of the child construct.
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
      throw new Error(`There is already a Construct with name '${childName}' in ${this.toString()}`);
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
   * Return the path of components up to but excluding the root
   */
  private rootPath(): Construct[] {
    const ancestors = this.ancestors();
    ancestors.shift();
    return ancestors;
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
export class Construct {
  /**
   * Construct node.
   */
  public readonly node: Node;

  /**
   * Creates a new construct node.
   *
   * @param scope The scope in which to define this construct
   * @param scid The scoped construct ID. Must be unique amongst siblings. If
   * the ID includes a path separator (`/`), then it will be replaced by double
   * dash `--`.
   */
  constructor(scope: Construct, scid: string) {
    this.node = new Node(this, scope, scid);
  }

  /**
   * Returns a string representation of this construct.
   */
  public toString() {
    const path = this.node.path;
    return this.node.typename + (path.length > 0 ? ` [${path}]` : '');
  }

  /**
   * This method can be implemented by derived constructs in order to perform
   * validation logic. It is called on all constructs before synthesis.
   *
   * @returns An array of validation error messages, or an empty array if there the construct is valid.
   */
  protected validate(): string[] {
    return [];
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
  constructor(public readonly source: Construct, public readonly message: string) {

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
