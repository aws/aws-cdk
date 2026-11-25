import type { IConstruct } from 'constructs';
import { iterateDfsPreorder } from './construct-iteration';

export interface Acknowledgement {
  readonly reason: string;
  readonly acknowledgedAt: string;
  readonly acknowledgedId: string;
  readonly acknowledgedStackTrace?: string;
}

/**
 * Id -> construct path -> AcknowledgedRule
 */
export type Acknowledgements = Record<string, Record<string, Acknowledgement>>;

/**
 * Collect all acknowledged rule IDs from construct metadata across the tree.
 *
 * Returns a map from construct path to list of acknowledgement details (reason, construct path, and stack trace).
 */
export function collectAcknowledgedRules(root: IConstruct): Acknowledgements {
  const rules: Acknowledgements = {};

  for (const construct of iterateDfsPreorder(root)) {
    for (const entry of construct.node.metadata) {
      if (entry.type === 'aws:cdk:acknowledged-rules' && entry.data) {
        for (const [id, reason] of Object.entries(entry.data as Record<string, string>)) {
          const rule: Acknowledgement = { reason, acknowledgedId: id, acknowledgedAt: construct.node.path, acknowledgedStackTrace: entry.trace?.join('\n') };

          const pathMap = rules[id] ??= {};
          pathMap[rule.acknowledgedAt] = rule;
        }
      }
    }
  }
  return rules;
}
