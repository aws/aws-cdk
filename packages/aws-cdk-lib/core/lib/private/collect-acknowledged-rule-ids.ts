import type { IConstruct } from 'constructs';
import { iterateDfsPreorder } from './construct-iteration';

export interface AcknowledgedRule {
  readonly reason: string;
  readonly constructPath: string;
  readonly stackTrace?: string;
}

/**
 * Collect all acknowledged rule IDs from construct metadata across the tree.
 * Returns a map from rule ID to all acknowledgement details (reason, construct path, and stack trace).
 */
export function collectAcknowledgedRuleIds(root: IConstruct): Map<string, AcknowledgedRule[]> {
  const rules = new Map<string, AcknowledgedRule[]>();
  for (const construct of iterateDfsPreorder(root)) {
    for (const entry of construct.node.metadata) {
      if (entry.type === 'aws:cdk:acknowledged-rules' && entry.data) {
        for (const [id, reason] of Object.entries(entry.data as Record<string, string>)) {
          const acknowledgements = rules.get(id) ?? [];
          acknowledgements.push({
            reason,
            constructPath: construct.node.path,
            stackTrace: entry.trace?.join('\n'),
          });
          rules.set(id, acknowledgements);
        }
      }
    }
  }
  return rules;
}
