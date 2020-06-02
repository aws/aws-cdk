import { App } from '../app';
import { ConstructOrder, IConstruct } from '../construct-compat';
import { Stack } from '../stack';
import { Stage } from '../stage';

/**
 * An AssemblER is a Construct that produces an AssemblY
 */
export type AssemblerConstruct = App | Stage;

/**
 * Return the construct root path of the given construct relative to the given ancestor
 *
 * If no ancestor is given or the ancestor is not found, return the entire root path.
 */
export function rootPathTo(construct: IConstruct, ancestor?: IConstruct): IConstruct[] {
  const scopes = construct.node.scopes;
  for (let i = scopes.length - 2; i >= 0; i--) {
    if (scopes[i] === ancestor) {
      return scopes.slice(i + 1);
    }
  }
  return scopes;
}

/**
 * Return the closest containing construct that produces an assembly
 *
 * A construct that produces an assembly is either an App or Stage.
 */
export function containingAssembler(construct: IConstruct): AssemblerConstruct | undefined {
  const stage = Stage.of(construct);
  if (stage) { return stage; }

  // Would have used App.of() here, but that will throw if no App is found.
  const root = construct.node.root;
  if (App.isApp(root)) { return root; }

  // We have to leave this option open for unit tests that don't have Apps
  return undefined;
}

/**
 * Return a string representation of the given assembler, for use in error messages
 */
export function describeAssembler(assembler: AssemblerConstruct | undefined): string {
  if (assembler === undefined) { return 'an unrooted construct tree'; }
  if (Stage.isStage(assembler)) { return `Stage '${assembler.stageName}'`; }
  return 'the App';
}

/**
 * Find all constructs in the given assembler scope which are not in a subassembler
 */
export function allConstructsInAssembler(scope: AssemblerConstruct, order: ConstructOrder): IConstruct[] {
  return scope.node.findAll(order).filter(c => containingAssembler(c) === scope);
}

/**
 * @returns the list of stacks that lead from the top-level stack (non-nested) all the way to a nested stack.
 */
export function pathToTopLevelStack(s: Stack): Stack[] {
  if (s.nestedStackParent) {
    return [ ...pathToTopLevelStack(s.nestedStackParent), s ];
  } else {
    return [ s ];
  }
}

/**
 * Given two arrays, returns the last common element or `undefined` if there
 * isn't (arrays are foriegn).
 */
export function findLastCommonElement<T>(path1: T[], path2: T[]): T | undefined {
  let i = 0;
  while (i < path1.length && i < path2.length) {
    if (path1[i] !== path2[i]) {
      break;
    }

    i++;
  }

  return path1[i - 1];
}