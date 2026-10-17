/**
 * Arbitraries, for use with 'fast-check' to do property tests on CDK apps
 */
import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import * as fc from 'fast-check';
import { App } from '../../lib/app';
import type { AppProps } from '../../lib/app';

/**
 * Some startup configuration that we can customize in a single place
 */
export function initializeFastCheck() {
  // Control number of runs from an env var for a burn-in test
  if (process.env.FAST_CHECK_NUM_RUNS) {
    fc.configureGlobal({
      ...fc.readConfigureGlobal(),
      numRuns: Number(process.env.FAST_CHECK_NUM_RUNS),
    });
  }
}

/**
 * A location for a construct (scope and id)
 */
export interface ConstructLoc {
  readonly scope: string;
  readonly id: string;
}

/**
 * fast-check is fully value-based, but Constructs must be added to their parent at construction time
 *
 * Instead of fast-check returning constructs, we will have it return construct FACTORIES,
 * which are functions that are given a parent and add the construct to it.
 *
 * We also have the parent control the `id`, so that we can avoid accidentally generating constructs
 * with conflicting names.
 */
export type ConstructFactory = (scope: Construct, id: string) => Construct;

export type AppFactory = () => App;

/**
 * Generate an arbitrary CDK app
 *
 * First builds a tree of factories and then applies the factories
 *
 * Returns a wrapper class for `App` with a `toString()` method, so
 * that if we find a counterexample `fast-check` will pretty-print it nicely.
 */
export function arbCdkAppFactory(props?: AppProps): fc.Arbitrary<AppFactory> {
  return arbConstructTreeFactory().map((fac) => () => {
    const app = new App(props);
    fac(app, 'First');
    return app;
  });
}

/**
 * Build a construct tree given an appfactory and some initial state
 */
export function buildConstructTree(appFac: AppFactory): ConstructTree<never>;
export function buildConstructTree<S>(appFac: AppFactory, state: S): ConstructTree<S>;
export function buildConstructTree(appFac: AppFactory, state?: any): ConstructTree<any> {
  // A fresh tree copy for every tree with aspects. `fast-check` may re-use old values
  // when generating variants, so if we mutate the tree in place different runs will
  // interfere with each other. Also a different aspect invocation log for every tree.
  const tree = appFac();
  return new ConstructTree(tree, state);
}

/**
 * Produce an arbitrary construct tree
 */
export function arbConstructTreeFactory(): fc.Arbitrary<ConstructFactory> {
  const { tree } = fc.letrec((rec) => {
    return {
      tree: fc.oneof({ depthSize: 'small', withCrossShrink: true }, rec('leaf'), rec('node')) as fc.Arbitrary<ConstructFactory>,
      leaf: fc.constant(constructFactory({})),
      node: fc.tuple(
        fc.array(fc.tuple(identifierString(), rec('tree') as fc.Arbitrary<ConstructFactory>), { maxLength: 5 }),
      ).map(([children]) => {
        const c = Object.fromEntries(children);
        return constructFactory(c);
      }),
    };
  });
  return tree;
}

function identifierString() {
  return fc.string({ minLength: 1, maxLength: 3, unit: fc.constantFrom('Da', 'Fu', 'Glo', 'Ba', 'Ro', 'ni', 'za', 'go', 'moo', 'flub', 'bu', 'vin', 'e', 'be') });
}

/**
 * Create a construct factory
 */
function constructFactory(childGenerators: Record<string, ConstructFactory>): ConstructFactory {
  return (scope, id) => {
    const construct = new ArbConstruct(scope, id);
    for (const [childId, generator] of Object.entries(childGenerators)) {
      generator(construct, childId);
    }
    return construct;
  };
}

export function arbConstructLoc(constructs: Construct[]): fc.Arbitrary<ConstructLoc> {
  return fc.record({
    scope: fc.constantFrom(...constructs.map(c => c.node.path)),
    id: identifierString(),
  });
}

/**
 * A construct class specifically for this test to distinguish it from other constructs
 */
export class ArbConstruct extends Construct {
  /**
   * The state of a construct.
   *
   * This is an arbitrary number that can be modified by aspects.
   */
  public state: number = 0;

  public toString() {
    return this.node.path;
  }
}

/**
 * A class to pretty print a CDK app if a property test fails, so it becomes readable.
 *
 * Also holds some state that can be mutated in the tests, to be rendered afterwards (for logging actions).
 */
export class ConstructTree<S> {
  /**
   * Return the state associated with the given construct node
   *
   * You should know what the type of the state is, that information is lost at runtime.
   */
  public static stateOf(node: IConstruct): any {
    const app = node.node.root;
    const state = ConstructTree.states.get(app);
    if (!state) {
      throw new Error(`Construct tree has no PropTest state associated with it: ${node.node.path}`);
    }
    return state;
  }

  private static states = new WeakMap<IConstruct, any>();

  private readonly initialPaths: Set<string>;

  constructor(public readonly constructTree: App, public readonly state: S) {
    const constructs = constructTree.node.findAll();
    this.initialPaths = new Set(constructs.map(c => c.node.path));
    ConstructTree.states.set(constructTree, state);
  }

  protected annotateConstruct(construct: Construct): string[] {
    void construct;
    return [];
  }

  protected renderTree(tree: TreeRenderer) {
    const self = this;

    recurse(this.constructTree);

    function recurse(construct: Construct) {
      const added = self.initialPaths.has(construct.node.path);
      tree.line([
        '+-',
        ... added ? ['(added)'] : [],
        construct.node.id || '(root)',
        ...self.annotateConstruct(construct),
      ].join(' '));

      tree.pushPrefix('     ');
      construct.node.children.forEach((child) => {
        recurse(child);
      });

      tree.popPrefix();
    }
  }

  public toString() {
    const tree = new TreeRenderer();

    // Add some empty lines to render better in the fast-check error message
    tree.emptyLine(2);
    this.renderTree(tree);
    tree.emptyLine(2);

    return tree.toString();
  }
}

export class TreeRenderer {
  private readonly lines: string[] = [];
  private readonly prefixes: string[] = [];

  public toString() {
    return this.lines.join('\n');
  }

  public emptyLine(n = 1) {
    for (let i = 0; i < n; i++) {
      this.lines.push('');
    }
  }

  public line(x: string) {
    this.lines.push(`${this.prefixes.join('')}${x}`);
  }

  public pushPrefix(prefix: string) {
    this.prefixes.push(prefix);
  }

  public popPrefix() {
    this.prefixes.pop();
  }
}
