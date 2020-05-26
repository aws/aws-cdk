import { App } from '../app';
import { IConstruct } from '../construct-compat';
import { Stage } from '../stage';

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
 * Return the closests stack container
 *
 * A "stack container" is an App or Stage.
 */
export function closestStackContainer(construct: IConstruct): IConstruct | undefined {
  const stage =  Stage.of(construct);
  if (stage) { return stage; }

  // Would have used App.of() here, but that will throw if no App is found.
  const root = construct.node.root;
  if (App.isApp(root)) { return root; }

  // We have to leave this option open for unit tests that don't have Apps
  return undefined;
}