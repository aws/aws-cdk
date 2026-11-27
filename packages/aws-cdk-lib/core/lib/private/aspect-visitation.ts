import type { IConstruct } from 'constructs';
import { STAGE_TYPE } from './core-construct-finders';

const ASPECT_VISITATION = Symbol.for('@aws-cdk/core.AspectVisitation');
type AspectRoot = IConstruct & { [ASPECT_VISITATION]?: Array<() => void> };

/** Work to run after aspects have visited this assembly, before dependencies are prepared. */
export function currentAspectVisitation(scope: IConstruct): Array<() => void> | undefined {
  for (const ancestor of scope.node.scopes.reverse() as AspectRoot[]) {
    if (ancestor[ASPECT_VISITATION]) return ancestor[ASPECT_VISITATION];
    if (STAGE_TYPE.isMarked(ancestor)) break;
  }
  return undefined;
}

export function visitAspects(root: AspectRoot, visit: () => void): void {
  const afterVisits: Array<() => void> = [];
  const previous = root[ASPECT_VISITATION];
  root[ASPECT_VISITATION] = afterVisits;
  try {
    visit();
    for (const finish of afterVisits) finish();
  } finally {
    if (previous) {
      root[ASPECT_VISITATION] = previous;
    } else {
      delete root[ASPECT_VISITATION];
    }
  }
}
