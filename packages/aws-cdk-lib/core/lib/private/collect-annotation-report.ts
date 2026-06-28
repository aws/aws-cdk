import * as path from 'path';
import type { IConstruct } from 'constructs';
import { iterateDfsPreorder } from './construct-iteration';
import * as cxschema from '../../../cloud-assembly-schema';
import { Stack } from '../stack';
import type { NamedValidationPluginReport } from '../validation/private/report';
import type { PolicyViolation, PolicyViolatingResource } from '../validation/report';

const ANNOTATION_PLUGIN_NAME = 'Construct Annotations';

/**
 * Collect annotation metadata (warnings and errors) from the construct tree
 * and convert them into a NamedValidationPluginReport that can be merged
 * into the same report pipeline as plugin violations.
 */
export function collectAnnotationReport(root: IConstruct, outdir: string): NamedValidationPluginReport | undefined {
  const violationMap = new Map<string, PolicyViolation & { violatingResources: PolicyViolatingResource[] }>();

  for (const construct of iterateDfsPreorder(root)) {
    for (const entry of construct.node.metadata) {
      if (entry.type !== cxschema.ArtifactMetadataEntryType.WARN && entry.type !== cxschema.ArtifactMetadataEntryType.ERROR) {
        continue;
      }

      const severity = entry.type === cxschema.ArtifactMetadataEntryType.ERROR ? 'error' : 'warning';
      const { message, ruleName } = splitDescriptionAndId(String(entry.data));

      let templatePath: string | undefined;
      try {
        templatePath = path.join(outdir, Stack.of(construct).templateFile);
      } catch {
        // Construct is not inside a Stack
      }

      const violatingResource: PolicyViolatingResource = {
        constructPath: construct.node.path,
        templatePath,
        locations: [],
      };

      const key = `${ruleName}|${severity}|${message}`;
      const existing = violationMap.get(key);
      if (existing) {
        existing.violatingResources.push(violatingResource);
      } else {
        violationMap.set(key, {
          ruleName: ruleName ?? `${severity}-annotation`,
          description: message,
          severity,
          violatingResources: [violatingResource],
          ruleMetadata: {
            'cdk:annotation': 'true',
          },
        });
      }
    }
  }

  const violations = Array.from(violationMap.values());
  if (violations.length === 0) {
    return undefined;
  }

  const hasErrors = violations.some(v => v.severity === 'error');
  return {
    pluginName: ANNOTATION_PLUGIN_NAME,
    success: !hasErrors,
    violations,
  };
}

/**
 * Annotations have IDs in two places:
 *
 * - Warnings have `[ack:<id>]` in the message.
 * - Errors have `(<namespace>::<id>)` in the message.
 *
 * Separate the rule name from the rest of the description.
 */
function splitDescriptionAndId(message: string): { message: string; ruleName?: string } {
  const ackMatch = message.match(/\[ack: ([^\]]+)\]/);
  if (ackMatch) {
    return { message: message.replace(ackMatch[0], '').trim(), ruleName: ackMatch[1] };
  }

  const idMatch = message.match(/\(([^()]+::[^()]+)\)$/);
  if (idMatch) {
    return { message: message.replace(idMatch[0], '').trim(), ruleName: idMatch[1] };
  }

  return { message };
}
