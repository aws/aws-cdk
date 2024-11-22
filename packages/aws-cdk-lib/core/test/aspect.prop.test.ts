import { Construct, IConstruct } from 'constructs';
import * as fc from 'fast-check';
import * as fs from 'fs-extra';
import { App, AppProps, Aspects, IAspect } from '../lib';

//////////////////////////////////////////////////////////////////////
//  Tests

test('aspects only get invoked at most once on every construct', () => fc.assert(
  fc.property(appWithAspects(), afterSynth((app) => {
    for (let i = 0; i < app.visitLog.length; i++) {
      for (let j = 0; j < app.visitLog.length; j++) {
        if (i === j) { continue; }

        if (sameConstruct(app.visitLog[i], app.visitLog[j]) && sameAspect(app.visitLog[i], app.visitLog[j])) {
          throw new Error(`Duplicate visit: ${i} and ${j}`);
        }
      }
    }
  })),
));

//////////////////////////////////////////////////////////////////////
//  Test Helpers

function afterSynth(block: (x: PrettyApp) => void) {
  return (app) => {
    const asm = app.cdkApp.synth();
    try {
      block(app);
    } finally {
      fs.rmSync(asm.directory, { recursive: true, force: true });
    }
  };
}

function sameConstruct(a: AspectVisit, b: AspectVisit) {
  return a.construct === b.construct;
}

function sameAspect(a: AspectVisit, b: AspectVisit) {
  return a.aspect === b.aspect;
}

//////////////////////////////////////////////////////////////////////
//  Arbitraries

function appWithAspects() {
  return arbCdkApp().chain(arbAddAspects).map(([a, l]) => new PrettyApp(a, l));
}

/**
 * Generate an arbitrary CDK app
 *
 * First builds a tree of factories and then applies the factories
 *
 * Returns a wrapper class for `App` with a `toString()` method, so
 * that if we find a counterexample `fast-check` will pretty-print it nicely.
 */
function arbCdkApp(props?: AppProps): fc.Arbitrary<App> {
  return arbConstructTreeFactory().map((fac) => {
    const app = new App(props);
    fac({ scope: app, id: 'First' });
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
  constructor(public readonly cdkApp: App, public readonly visitLog: AspectVisitLog) { }

  public toString() {
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
      const aspects = Aspects.of(construct).list.map(a => `${a.aspect}@${a.priority}`);
      line([
        '+-',
        construct.node.path || '(root)',
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

interface AspectVisit {
  construct: IConstruct;
  aspect: IAspect;
}

type AspectVisitLog = AspectVisit[];

/**
 * Add arbitrary aspects to the given tree
 */
function arbAddAspects<T extends Construct>(tree: T): fc.Arbitrary<[T, AspectVisitLog]> {
  const constructs = tree.node.findAll();
  const log: AspectVisitLog = [];

  const applications = fc.array(arbAspectApplication(constructs, log), {
    size: 'small',
    maxLength: 5,
  });

  return applications.map((appls) => {
    for (const app of appls) {
      for (const ctr of app.constructs) {
        Aspects.of(ctr).add(app.aspect, { priority: app.priority });
      }
    }
    return [tree, log];
  });
}

function arbAspectApplication(constructs: Construct[], log: AspectVisitLog): fc.Arbitrary<AspectApplication> {
  return fc.record({
    constructs: fc.shuffledSubarray(constructs, { minLength: 1, maxLength: Math.min(3, constructs.length) }),
    aspect: arbAspect(constructs, log),
    priority: fc.nat({ max: 1000 }),
  });
}

function arbAspect(constructs: Construct[], log: AspectVisitLog): fc.Arbitrary<IAspect> {
  return (fc.oneof(
    {
      depthIdentifier: 'aspects',
    },
    fc.constant(() => fc.constant(new InspectingAspect(log))),
    fc.constant(() => fc.constant(new MutatingAspect(log))),
    fc.constant(() => fc.record({
      constructLoc: arbConstructLoc(constructs),
      newAspects: fc.array(arbAspectApplication(constructs, log), { size: '-1', maxLength: 2 }),
    }).map(({ constructLoc, newAspects }) => {
      return new NodeAddingAspect(log, constructLoc, newAspects);
    })),
  ) satisfies fc.Arbitrary<() => fc.Arbitrary<IAspect>>).chain((fact) => fact());
}

function arbConstructLoc(constructs: Construct[]): fc.Arbitrary<ConstructLoc> {
  return fc.record({
    scope: fc.constantFrom(...constructs),
    id: identifierString(),
  });
}

/**
 * A location for a construct (scope and id)
 */
interface ConstructLoc {
  scope: Construct;
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
type ConstructFactory = (loc: ConstructLoc) => Construct;

function identifierString() {
  return fc.string({ minLength: 1, maxLength: 3, unit: fc.constantFrom('Da', 'Fu', 'Glo', 'Ba', 'Ro', 'ni', 'za', 'go', 'moo', 'flub', 'bu', 'vin', 'e', 'be') });
}

/**
 * Create a construct factory
 */
function constructFactory(childGenerators: Record<string, ConstructFactory>): ConstructFactory {
  return ({ scope, id }) => {
    const construct = new ArbConstruct(scope, id);
    for (const [childId, generator] of Object.entries(childGenerators)) {
      generator({ scope: construct, id: childId });
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

  constructor(private readonly log: AspectVisitLog) {
    this.id = UUID++;
  }

  visit(node: IConstruct): void {
    this.log.push({
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
    return `Inspecting_${this.id}`;
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
    return `Mutating_${this.id}`;
  }
}

/**
 * Partial Aspect application
 *
 * Contains just the aspect and priority
 */
interface PartialAspectApplication {
  aspect: IAspect;
  priority?: number;
}

interface AspectApplication extends PartialAspectApplication {
  constructs: Construct[];
}

/**
 * An aspect that adds a new node, if one doesn't exist yet
 */
class NodeAddingAspect extends TracingAspect {
  constructor(log: AspectVisitLog, private readonly loc: ConstructLoc, private readonly newAspects: PartialAspectApplication[]) {
    super(log);
  }

  visit(node: IConstruct): void {
    super.visit(node);
    if (this.loc.scope.node.tryFindChild(this.loc.id)) {
      return;
    }

    const newConstruct = new ArbConstruct(this.loc.scope, this.loc.id);
    for (const { aspect, priority } of this.newAspects) {
      Aspects.of(newConstruct).add(aspect, { priority });
    }
  }

  public toString() {
    const childId = `${this.loc.scope.node.path}/${this.loc.id}`;
    const newAspects = this.newAspects.map((a) => `${a.aspect}@${a.priority}`);

    return `Adding_${this.id}(${childId}, [${newAspects.join('\n')}])`;
  }
}

class AspectAddingAspect extends TracingAspect {
  constructor(log: AspectVisitLog, private readonly newAspect: AspectApplication) {
    super(log);
  }

  visit(node: IConstruct): void {
    super.visit(node);

    for (const construct of this.newAspect.constructs) {
      Aspects.of(construct).add(this.newAspect.aspect, { priority: this.newAspect.priority });
    }
  }

  public toString() {
    return `AddAspect_${this.id}(${JSON.stringify(this.newAspect)})`;
  }
}