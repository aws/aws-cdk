import type { IConstruct } from 'constructs';
import { iterateDfsPreorder } from './construct-iteration';

/**
 * Collect all acknowledged rule IDs from construct metadata across the tree.
 */
export function collectAcknowledgedRuleIds(root: IConstruct): Set<string> {
  const ids = new Set<string>();
  for (const construct of iterateDfsPreorder(root)) {
    for (const entry of construct.node.metadata) {
      if (entry.type === 'aws:cdk:acknowledged-rules' && entry.data) {
        for (const id of Object.keys(entry.data as Record<string, string>)) {
          ids.add(id);
        }
      }
    }
  }
  return ids;
}
