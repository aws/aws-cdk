import { Construct, IConstruct } from 'constructs';
import * as fc from 'fast-check';
import * as fs from 'fs-extra';
import { App, AppProps, AspectApplication, Aspects, IAspect } from '../lib';

//////////////////////////////////////////////////////////////////////
//  Tests

describe('every aspect gets invoked exactly once', () => {
  test('every aspect gets executed at most once on every construct', () =>
    fc.assert(
      fc.property(appWithAspects(), fc.boolean(), (app, stabilizeAspects) => {
        afterSynth((testApp) => {
          forEveryVisitPair(testApp.visitLog, (a, b) => {
            if (sameConstruct(a, b) && sameAspect(a, b)) {
              throw new Error(`Duplicate visit: ${a.index} and ${b.index}`);
            }
          });
        }, stabilizeAspects)(app);
      }),
    ),
  );

  test('all aspects that exist at the start of synthesis get invoked on all nodes in its scope at the start of synthesis', () =>
    fc.assert(
      fc.property(appWithAspects(), fc.boolean(), (app, stabilizeAspects) => {
        const originalConstructsOnApp = app.cdkApp.node.findAll();
        const originalAspectApplications = getAllAspectApplications(originalConstructsOnApp);
        afterSynth((testApp) => {
          const visitsMap = getVisitsMap(testApp.visitLog);

          for (const aspectApplication of originalAspectApplications) {
            // Check that each original AspectApplication also visited all child nodes of its original scope:
            for (const construct of originalConstructsOnApp) {
              if (isAncestorOf(aspectApplication.construct, construct)) {
                if (!visitsMap.get(construct)!.includes(aspectApplication.aspect)) {
                  throw new Error(`Aspect ${aspectApplication.aspect.constructor.name} applied on ${aspectApplication.construct.node.path} did not visit construct ${construct.node.path} in its original scope.`);
                }
              }
            }
          }
        }, stabilizeAspects)(app);
      }),
    ),
  );

  test('with stabilization, every aspect applied on the tree eventually executes on all of its nodes in scope', () =>
    fc.assert(
      fc.property(appWithAspects(), (app) => {
        afterSynth((testApp) => {

          const allConstructsOnApp = testApp.cdkApp.node.findAll();
          const allAspectApplications = getAllAspectApplications(allConstructsOnApp);
          const visitsMap = getVisitsMap(testApp.visitLog);

          for (const aspectApplication of allAspectApplications) {
            // Check that each AspectApplication also visited all child nodes of its scope:
            for (const construct of allConstructsOnApp) {
              if (isAncestorOf(aspectApplication.construct, construct)) {
                if (!visitsMap.get(construct)!.includes(aspectApplication.aspect)) {
                  throw new Error(`Aspect ${aspectApplication.aspect.constructor.name} applied on ${aspectApplication.construct.node.path} did not visit construct ${construct.node.path} in its scope.`);
                }
              }
            }
          }
        }, true)(app);
      }),
    ),
  );
});

test('inherited aspects get invoked before locally defined aspects, if both have the same priority', () =>
  fc.assert(
    fc.property(appWithAspects(), fc.boolean(), (app, stabilizeAspects) => {
      afterSynth((testApp) => {
        forEveryVisitPair(testApp.visitLog, (a, b) => {
          if (!sameConstruct(a, b)) return;

          const aPrio = lowestAspectPrioFor(a.aspect, a.construct);
          const bPrio = lowestAspectPrioFor(b.aspect, b.construct);

          if (!(aPrio == bPrio)) return;

          const aInherited = allAncestorAspects(a.construct).includes(a.aspect);
          const bInherited = allAncestorAspects(b.construct).includes(b.aspect);

          if (!(aInherited == true && bInherited == false)) return;

          if (!(a.index < b.index)) {
            throw new Error(
              `Aspect ${a.aspect}@${aPrio} at ${a.index} should have been before ${b.aspect}@${bPrio} at ${b.index}, but was after`,
            );
          }
        });
      }, stabilizeAspects)(app);
    }),
  ),
);

test('for every construct, lower priorities go before higher priorities', () =>
  fc.assert(
    fc.property(appWithAspects(), fc.boolean(), (app, stabilizeAspects) => {
      afterSynth((testApp) => {
        forEveryVisitPair(testApp.visitLog, (a, b) => {
          if (!sameConstruct(a, b)) return;

          const aPrio = lowestAspectPrioFor(a.aspect, a.construct);
          const bPrio = lowestAspectPrioFor(b.aspect, b.construct);

          // But only if the application of aspect A exists at least as long as the application of aspect B
          const aAppliedT = aspectAppliedT(testApp, a.aspect, a.construct);
          const bAppliedT = aspectAppliedT(testApp, b.aspect, b.construct);

          if (!implies(aPrio < bPrio && aAppliedT <= bAppliedT, a.index < b.index)) {
            throw new Error(
              `Aspect ${a.aspect}@${aPrio} at ${a.index} should have been before ${b.aspect}@${bPrio} at ${b.index}, but was after`,
            );
          }
        });
      }, stabilizeAspects)(app);
    }),
  ),
);

test('for every construct, if a invokes before b that must mean it is of equal or lower priority', () =>
  fc.assert(
    fc.property(appWithAspects(), fc.boolean(), (app, stabilizeAspects) => {
      afterSynth((testApp) => {
        forEveryVisitPair(testApp.visitLog, (a, b) => {
          if (!sameConstruct(a, b)) return;

          const aPrio = lowestAspectPrioFor(a.aspect, a.construct);
          const bPrio = lowestAspectPrioFor(b.aspect, b.construct);

          if (!implies(a.index < b.index, aPrio <= bPrio)) {
            throw new Error(
              `Aspect ${a.aspect}@${aPrio} at ${a.index} should have been before ${b.aspect}@${bPrio} at ${b.index}, but was after`,
            );
          }
        });
      }, stabilizeAspects)(app);
    }),
  ),
);

test('visitLog is nonempty', () =>
  fc.assert(
    fc.property(appWithAspects(), fc.boolean(), (app, stabilizeAspects) => {
      afterSynth((testApp) => {
        expect(testApp.visitLog).not.toEqual([]);
      }, stabilizeAspects)(app);
    }),
  ),
);

//////////////////////////////////////////////////////////////////////
//  Test Helpers

function afterSynth(block: (x: PrettyApp) => void, stabilizeAspects: boolean) {
  return (app) => {
    let asm;
    try {
      asm = app.cdkApp.synth({ aspectStabilization: stabilizeAspects });
    } catch (error) {
      if (error.message.includes('Cannot invoke Aspect')) {
        return;
      }
      throw error;
    }
    try {
      block(app);
    } finally {
      fs.rmSync(asm.directory, { recursive: true, force: true });
    }
  };
}

/**
 * Implication operator, for readability
 */
function implies(a: boolean, b: boolean) {
  return !a || b;
}

interface AspectVisitWithIndex extends AspectVisit {
  index: number;
}

/**
 * Check a property for every pair of visits in the log
 *
 * This is humongously inefficient at large scale, so we might need more clever
 * algorithms to keep this tractable.
 */
function forEveryVisitPair(log: AspectVisitLog, block: (a: AspectVisitWithIndex, b: AspectVisitWithIndex) => void) {
  for (let i = 0; i < log.length; i++) {
    for (let j = 0; j < log.length; j++) {
      if (i === j) { continue; }

      block({ ...log[i], index: i }, { ...log[j], index: j });
    }
  }
}

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
}

function arraysEqualUnordered<T>(arr1: T[], arr2: T[]): boolean {
  return arr1.length === arr2.length && new Set(arr1).size === new Set(arr2).size;
}

/**
 * Given an AspectVisitLog, returns a map of Constructs with a list of all Aspects that
 * visited the construct.
 */
function getVisitsMap(log: AspectVisitLog): Map<IConstruct, IAspect[]> {
  const visitsMap = new Map<IConstruct, IAspect[]>();
  for (let i = 0; i < log.length; i++) {
    const visit = log[i];
    if (!visitsMap.has(visit.construct)) {
      visitsMap.set(visit.construct, []);
    }
    visitsMap.get(visit.construct)!.push(visit.aspect);
  }
  return visitsMap;
}

/**
 * Returns a list of all AspectApplications from a list of Constructs.
 */
function getAllAspectApplications(constructs: IConstruct[]): AspectApplication[] {
  const aspectApplications: AspectApplication[] = [];

  constructs.forEach((construct) => {
    aspectApplications.push(...Aspects.of(construct).applied);
  });

  return aspectApplications;
}

function sameConstruct(a: AspectVisit, b: AspectVisit) {
  return a.construct === b.construct;
}

function sameAspect(a: AspectVisit, b: AspectVisit) {
  return a.aspect === b.aspect;
}

/**
 * Returns whether `a` is an ancestor of `b` (or if they are the same construct)
 */
function isAncestorOf(a: Construct, b: Construct) {
  return b.node.path === a.node.path || b.node.path.startsWith(a.node.path + '/');
}

/**
 * Returns the ancestors of `a`, including `a` itself
 *
 * The first element is `a` itself, and the last element is its root.
 */
function ancestors(a: Construct): IConstruct[] {
  return a.node.scopes.reverse();
}

/**
 * Returns all aspects of the given construct's ancestors (excluding its own locally defined aspects)
 */
function allAncestorAspects(a: IConstruct): IAspect[] {
  const ancestorConstructs = ancestors(a);

  // Filter out the current node and get aspects of the ancestors
  return ancestorConstructs
    .slice(1) // Exclude the node itself
    .flatMap((ancestor) => Aspects.of(ancestor).applied.map((aspectApplication) => aspectApplication.aspect));
}

/**
 * Returns all aspect applications in scope for the given construct
 */
function allAspectApplicationsInScope(a: Construct): AspectApplication[] {
  return ancestors(a).flatMap((c) => Aspects.of(c).applied);
}

/**
 * Find the lowest timestamp that could lead to the execution of the given aspect on the given construct
 *
 * Take the minimum of all added applications that could lead to this execution.
 */
function aspectAppliedT(prettyApp: PrettyApp, a: IAspect, c: Construct): number {
  const potentialTimes = [...prettyApp.initialAspects, ...prettyApp.addedAspects].filter((appl) => {
    return appl.aspect === a && isAncestorOf(appl.construct, c);
  }).map((appl) => appl.t);

  return Math.min(...potentialTimes);
}

/**
 * Return the lowest priority of Aspect `a` inside the given list of applications
 */
function lowestPriority(a: IAspect, as: AspectApplication[]): number | undefined {
  const filtered = as.filter((x) => x.aspect === a);
  filtered.sort((x, y) => x.priority - y.priority);
  return filtered[0]?.priority;
}

function lowestAspectPrioFor(a: IAspect, c: IConstruct) {
  const ret = lowestPriority(a, allAspectApplicationsInScope(c));
  if (ret === undefined) {
    throw new Error(`Got an invocation of ${a} on ${c} with no priority`);
  }
  return ret;
}

//////////////////////////////////////////////////////////////////////
//  Arbitraries

function appWithAspects() {
  return arbCdkAppFactory().chain(arbAddAspects).map(([a, l]) => {
    return new PrettyApp(a, l);
  });
}

/**
 * Generate an arbitrary CDK app
 *
 * First builds a tree of factories and then applies the factories
 *
 * Returns a wrapper class for `App` with a `toString()` method, so
 * that if we find a counterexample `fast-check` will pretty-print it nicely.
 */
function arbCdkAppFactory(props?: AppProps): fc.Arbitrary<AppFactory> {
  return arbConstructTreeFactory().map((fac) => () => {
    const app = new App(props);
    fac(app, 'First');
    return app;
  });
}

/**
 * Produce an arbitrary construct tree
 */
function arbConstructTreeFactory(): fc.Arbitrary<ConstructFactory> {
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

/**
 * A class to pretty print a CDK app if a property test fails, so it becomes readable.
 *
 * Also holds the aspect visit log because why not.
 */
class PrettyApp {
  private readonly initialTree: Set<string>;
  private readonly _initialAspects: Map<string, Set<string>>;
  public readonly initialAspects: RecordedAspectApplication[];

  constructor(public readonly cdkApp: App, public readonly executionState: ExecutionState) {
    const constructs = cdkApp.node.findAll();
    this.initialTree = new Set(constructs.map(c => c.node.path));
    this._initialAspects = new Map(constructs.map(c => [c.node.path, new Set(renderAspects(c))]));

    this.initialAspects = constructs.flatMap(c => Aspects.of(c).applied.map(a => ({
      aspect: a.aspect,
      construct: a.construct,
      priority: a.priority,
      t: 0,
    } as RecordedAspectApplication)));
  }

  /**
   * Return the log of all aspect visits
   */
  public get visitLog() {
    return this.executionState.visitLog;
  }

  /**
   * Return a list of all constructs added by aspects
   */
  public get addedConstructs() {
    return this.executionState.addedConstructs;
  }

  /**
   * Return a list of all aspects added by other aspects
   */
  public get addedAspects() {
    return this.executionState.addedAspects;
  }

  public toString() {
    const self = this;

    const lines: string[] = [];
    const prefixes: string[] = [];

    // Add some empty lines to render better in the fast-check error message
    lines.push('', '');

    prefixes.push('  ');
    lines.push('TREE');
    recurse(this.cdkApp);
    lines.push('VISITS');
    this.visitLog.forEach((visit, i) => {
      lines.push(`  ${i}. ${visit.construct} <-- ${visit.aspect}`);
    });

    lines.push('', '');

    return lines.join('\n');

    function line(x: string) {
      lines.push(`${prefixes.join('')}${x}`);
    }

    function recurse(construct: Construct) {
      const aspects = renderAspects(construct);

      for (let i = 0; i < aspects.length; i++) {
        if (!(self._initialAspects.get(construct.node.path) ?? new Set()).has(aspects[i])) {
          aspects[i] += ' (added)';
        }
      }

      line([
        '+-',
        ...self.initialTree.has(construct.node.path) ? [] : ['(added)'],
        construct.node.id || '(root)',
        ...aspects.length > 0 ? [` <-- ${aspects.join(', ')}`] : [],
      ].join(' '));

      prefixes.push('     ');
      construct.node.children.forEach((child, i) => {
        recurse(child);
      });
      prefixes.pop();
    }
  }
}

function renderAspects(c: Construct) {
  return unique(Aspects.of(c).applied.map(a => `${a.aspect}@${a.priority}`));
}

function unique(xs: string[]): string[] {
  const seen = new Set<string>();
  const ret: string[] = [];
  for (const x of xs) {
    if (seen.has(x)) { continue; }
    ret.push(x);
    seen.add(x);
  }
  return ret;
}

interface AspectVisit {
  construct: IConstruct;
  aspect: TracingAspect;
}

type AspectVisitLog = AspectVisit[];

/**
 * Add arbitrary aspects to the given tree
 */
function arbAddAspects(appFac: AppFactory): fc.Arbitrary<[App, ExecutionState]> {
  // Synthesize the tree, but just to get the construct paths to apply aspects to.
  // We won't hold on to the instances, because we will clone the tree later (or
  // regenerate it, which is easier), and attach the aspects in the clone.
  const baseTree = appFac();
  const constructs = baseTree.node.findAll();

  const applications = fc.array(arbAspectApplication(constructs), {
    size: 'small',
    minLength: 1,
    maxLength: 5,
  });

  return applications.map((appls) => {
    // A fresh tree copy for every tree with aspects. `fast-check` may re-use old values
    // when generating variants, so if we mutate the tree in place different runs will
    // interfere with each other. Also a different aspect invocation log for every tree.
    const tree = appFac();
    const state: ExecutionState = {
      visitLog: [],
      addedConstructs: [],
      addedAspects: [],
    };
    tree[EXECUTIONSTATE_SYM] = state; // Stick this somewhere the aspects can find it

    for (const app of appls) {
      const ctrs = app.constructPaths.map((p) => findConstructDeep(tree, p));
      for (const ctr of ctrs) {
        Aspects.of(ctr).add(app.aspect, { priority: app.priority });
      }
    }

    return [tree, state];
  });
}

function arbAspectApplication(constructs: Construct[]): fc.Arbitrary<TestAspectApplication> {
  return fc.record({
    constructPaths: fc.shuffledSubarray(constructs, { minLength: 1, maxLength: Math.min(3, constructs.length) })
      .map((cs) => cs.map((c) => c.node.path)),
    aspect: arbAspect(constructs),
    priority: fc.nat({ max: 1000 }),
  });
}

function arbAspect(constructs: Construct[]): fc.Arbitrary<IAspect> {
  return (fc.oneof(
    {
      depthIdentifier: 'aspects',
    },
    // Simple: inspecting aspect
    fc.constant(() => fc.constant(new InspectingAspect())),
    // Simple: mutating aspect
    fc.constant(() => fc.constant(new MutatingAspect())),
    // More complex: adds a new construct, optionally immediately adds an aspect to it
    fc.constant(() => fc.record({
      constructLoc: arbConstructLoc(constructs),
      newAspects: fc.array(arbAspectApplication(constructs), { size: '-1', maxLength: 2 }),
    }).map(({ constructLoc, newAspects }) => {
      return new NodeAddingAspect(constructLoc, newAspects);
    })),
    // More complex: adds a new aspect to an existing construct.
    // NOTE: this will never add an aspect to a construct that didn't exist in the initial tree.
    fc.constant(() => arbAspectApplication(constructs).map(((aspectApp) =>
      new AspectAddingAspect(aspectApp)
    ))),
  ) satisfies fc.Arbitrary<() => fc.Arbitrary<IAspect>>).chain((fact) => fact());
}

function arbConstructLoc(constructs: Construct[]): fc.Arbitrary<ConstructLoc> {
  return fc.record({
    scope: fc.constantFrom(...constructs.map(c => c.node.path)),
    id: identifierString(),
  });
}

/**
 * A location for a construct (scope and id)
 */
interface ConstructLoc {
  scope: string;
  id: string;
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
type ConstructFactory = (scope: Construct, id: string) => Construct;

type AppFactory = () => App;

interface ExecutionState {
  /**
   * Visit log of all aspects
   */
  visitLog: AspectVisitLog;

  /**
   * Constructs that were added by aspects
   */
  addedConstructs: Construct[];

  /**
   * Record where we added an aspect
   */
  addedAspects: RecordedAspectApplication[];
}

/**
 * A unique symbol for the root construct to hold dynamic information
 */
const EXECUTIONSTATE_SYM = Symbol();

function findConstructDeep(root: IConstruct, path: string) {
  if (path === '') {
    return root;
  }
  const parts = path.split('/');
  let ctr: IConstruct = root;
  for (const part of parts) {
    ctr = ctr.node.findChild(part);
  }
  return ctr;
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

/**
 * A construct class specifically for this test to distinguish it from other constructs
 */
class ArbConstruct extends Construct {
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

//////////////////////////////////////////////////////////////////////
//  Aspects

let UUID = 1000;

/**
 * Implementor of Aspect that logs its actions
 *
 * All subclasses should call `super.visit()`.
 */
abstract class TracingAspect implements IAspect {
  public readonly id: number;

  constructor() {
    this.id = UUID++;
  }

  protected executionState(node: IConstruct): ExecutionState {
    return node.node.root[EXECUTIONSTATE_SYM];
  }

  visit(node: IConstruct): void {
    this.executionState(node).visitLog.push({
      aspect: this,
      construct: node,
    });
  }
}

/**
 * An inspecting aspect doesn't really do anything
 */
class InspectingAspect extends TracingAspect {
  public toString() {
    return `Inspect_${this.id}`;
  }
}

/**
 * An aspect that increases the 'state' number of a construct
 */
class MutatingAspect extends TracingAspect {
  visit(node: IConstruct): void {
    super.visit(node);
    if (node instanceof ArbConstruct) {
      node.state++;
    }
  }

  public toString() {
    return `Mutate_${this.id}`;
  }
}

/**
 * Partial Aspect application
 *
 * Contains just the aspect and priority
 */
interface PartialTestAspectApplication {
  aspect: IAspect;
  priority?: number;
}

interface TestAspectApplication extends PartialTestAspectApplication {
  /**
   * Need to go by path because the constructs themselves are mutable and these paths remain valid in multiple trees
   */
  constructPaths: string[];
}

/**
 * An aspect application added by another aspect, during execution
 */
interface RecordedAspectApplication extends PartialTestAspectApplication {
  t: number;
  construct: Construct;
}

/**
 * An aspect that adds a new node, if one doesn't exist yet
 */
class NodeAddingAspect extends TracingAspect {
  constructor(private readonly loc: ConstructLoc, private readonly newAspects: PartialTestAspectApplication[]) {
    super();
  }

  visit(node: IConstruct): void {
    super.visit(node);
    const scope = findConstructDeep(node.node.root, this.loc.scope);

    if (scope.node.tryFindChild(this.loc.id)) {
      return;
    }

    const newConstruct = new ArbConstruct(scope, this.loc.id);
    for (const { aspect, priority } of this.newAspects) {
      Aspects.of(newConstruct).add(aspect, { priority });
      const executionState = this.executionState(node);
      executionState.addedAspects.push({
        t: executionState.visitLog.length,
        construct: newConstruct,
        aspect,
        priority,
      });
    }
    // Log that we added this construct
    this.executionState(node).addedConstructs.push(newConstruct);
  }

  public toString() {
    const childId = `${this.loc.scope}/${this.loc.id}`;
    const newAspects = this.newAspects.map((a) => `${a.aspect}@${a.priority}`);

    return `AddConstruct_${this.id}(${childId}, [${newAspects.join('\n')}])`;
  }
}

class AspectAddingAspect extends TracingAspect {
  constructor(private readonly newAspect: TestAspectApplication) {
    super();
  }

  visit(node: IConstruct): void {
    super.visit(node);

    const constructs = this.newAspect.constructPaths.map((p) => findConstructDeep(node.node.root, p));
    for (const construct of constructs) {
      Aspects.of(construct).add(this.newAspect.aspect, { priority: this.newAspect.priority });
      const executionState = this.executionState(node);
      executionState.addedAspects.push({
        t: executionState.visitLog.length,
        construct,
        aspect: this.newAspect.aspect,
        priority: this.newAspect.priority,
      });
    }
  }

  public toString() {
    return `AddAspect_${this.id}([${this.newAspect.constructPaths.join(',')}], ${this.newAspect.aspect}@${this.newAspect.priority})`;
  }
}
