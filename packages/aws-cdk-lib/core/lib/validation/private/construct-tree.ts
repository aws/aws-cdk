import { Construct, IConstruct } from 'constructs';
import { App } from '../../app';
import { CfnResource } from '../../cfn-resource';
import { constructInfoFromConstruct } from '../../helpers-internal';
import { iterateDfsPreorder } from '../../private/construct-iteration';
import { Stack } from '../../stack';

/**
 * A construct centric view of a stack trace
 */
export interface ConstructTrace {
  /**
   * The construct node id
   */
  readonly id: string;

  /**
   * The construct path
   */
  readonly path: string;
  /**
   * The construct trace for the next construct
   * in the trace tree
   *
   * @default - undefined if this is the last construct in the tree
   */
  readonly child?: ConstructTrace;

  /**
   * The name of the construct
   *
   * This will be equal to the fqn so will also include
   * library information
   *
   * @default - undefined if this is a locally defined construct
   */
  readonly construct?: string;

  /**
   * The version of the library the construct comes from
   *
   * @default - undefined if this is a locally defined construct
   */
  readonly libraryVersion?: string;

  /**
   * If `CDK_DEBUG` is set to true, then this will show
   * the line from the stack trace that contains the location
   * in the source file where the construct is defined.
   *
   * If `CDK_DEBUG` is not set then this will instruct the user
   * to run with `--debug` if they would like the location
   *
   * @default - undefined if the construct comes from a library
   * and the location would point to node_modules
   */
  readonly location?: string;
}

/**
 * Utility class to help accessing information on constructs in the
 * construct tree. This can be created once and shared between
 * all the validation plugin executions.
 */
export class ConstructTree {
  /**
   * A cache of the ConstructTrace by node.path. Each construct
   */
  private readonly _constructByPath = new Map<string, Construct>();
  private readonly _constructByTemplatePathAndLogicalId = new Map<string, Map<string, Construct>>();
  private readonly root: IConstruct;

  constructor(
    root: IConstruct,
  ) {
    this.root = App.of(root) ?? root;

    this._constructByPath.set(this.root.node.path, root);
    // do this once at the start so we don't have to traverse
    // the entire tree everytime we want to find a nested node
    for (const child of iterateDfsPreorder(this.root)) {
      this._constructByPath.set(child.node.path, child);
      const defaultChild = child.node.defaultChild;
      if (defaultChild && CfnResource.isCfnResource(defaultChild)) {
        const stack = Stack.of(defaultChild);
        const logicalId = stack.resolve(defaultChild.logicalId);
        this.setLogicalId(stack, logicalId, child);
      }
    }

    // Another pass to include all the L1s that haven't been added yet
    for (const child of iterateDfsPreorder(this.root)) {
      if (CfnResource.isCfnResource(child)) {
        const stack = Stack.of(child);
        const logicalId = Stack.of(child).resolve(child.logicalId);
        this.setLogicalId(stack, logicalId, child);
      }
    }
  }

  private setLogicalId(stack: Stack, logicalId: string, child: Construct) {
    if (!this._constructByTemplatePathAndLogicalId.has(stack.templateFile)) {
      this._constructByTemplatePathAndLogicalId.set(stack.templateFile, new Map([[logicalId, child]]));
    } else {
      this._constructByTemplatePathAndLogicalId.get(stack.templateFile)?.set(logicalId, child);
    }
  }

  /**
   * Turn a construct path into a trace
   *
   * The trace contains all constructs from the root to the construct indicated
   * by the given path. It does not include the root itself.
   */
  public traceFromPath(constructPath: string): ConstructTrace {
    // Deal with a path starting with `/`.
    const components = constructPath.replace(/^\//, '').split('/');

    const rootPath: Array<ReturnType<ConstructTree['constructTraceLevelFromTreeNode']>> = [];
    const stackTraces: Array<string[] | undefined> = [];
    let node: IConstruct | undefined = this.root;
    while (node) {
      rootPath.push(this.constructTraceLevelFromTreeNode(node));
      stackTraces.push(this.stackTrace(node));

      const component = components.shift()!;
      node = component !== undefined ? node.node.tryFindChild(component) : undefined;
    }
    // Remove the root from the levels
    rootPath.shift();
    stackTraces.shift();

    // Now turn the rootpath into a proper ConstructTrace tree by making every next element in the
    // array the 'child' of the previous one, and adding stack traces.
    let ret: ConstructTrace = {
      ...rootPath[rootPath.length - 1],
      location: stackLocationAt(rootPath.length - 1),
    };
    for (let i = rootPath.length - 2; i >= 0; i--) {
      ret = {
        ...rootPath[i],
        child: ret,
        location: stackLocationAt(i),
      };
    }
    return ret;

    /**
     * Get the stack location for construct `i` in the list
     *
     * If there is a stack trace for the given construct, then use it and get the
     * first frame from it. Otherwise, find the first stack trace below this
     * construct and use the N'th frame from it, where N is the distance from this
     * construct to the construct with stack trace.
     *
     * This assumes all constructs are created without additional functions
     * calls in the middle.
     */
    function stackLocationAt(i: number) {
      let j = i;
      while (j < rootPath.length && !stackTraces[j]) {
        j++;
      }
      if (j === rootPath.length) {
        return STACK_TRACE_HINT;
      }
      // Stack traces are closest frame first
      return stackTraces[j]?.[0 + j - i] ?? STACK_TRACE_HINT;
    }
  }

  /**
   * Convert a Tree Metadata Node into a ConstructTrace object, except its child and stack trace info
   *
   * FIXME: This could probably use the construct tree directly.
   */
  public constructTraceLevelFromTreeNode(node: IConstruct): Omit<ConstructTrace, 'child' | 'location'> {
    const constructInfo = constructInfoFromConstruct(node);

    return {
      id: node.node.id,
      path: node.node.path,
      construct: constructInfo?.fqn,
      libraryVersion: constructInfo?.version,
    };
  }

  /**
   * Return the stack trace for a given construct path
   *
   * Returns a stack trace if stack trace information is found, or `undefined` if not.
   */
  private stackTrace(construct: IConstruct): string[] | undefined {
    return construct?.node.metadata.find(meta => !!meta.trace)?.trace;
  }

  /**
   * Get a specific Construct by the node.addr
   *
   * @param path the node.addr of the construct
   * @returns the Construct
   */
  public getConstructByPath(path: string): Construct | undefined {
    return this._constructByPath.get(path);
  }

  /**
   * Get a specific Construct by the CfnResource logical ID. This will
   * be the construct.node.defaultChild with the given ID
   *
   * @param logicalId the ID of the CfnResource
   * @returns the Construct
   */
  public getConstructByLogicalId(templateFile: string, logicalId: string): Construct | undefined {
    return this._constructByTemplatePathAndLogicalId.get(templateFile)?.get(logicalId);
  }
}

const STACK_TRACE_HINT = 'Run with \'--debug\' to include location info';
