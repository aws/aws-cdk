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

      const message = entry.data as string;
      const severity = entry.type === cxschema.ArtifactMetadataEntryType.ERROR ? 'error' : 'warning';
      const ruleName = extractRuleName(message, severity);

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
          ruleName,
          description: message,
          severity,
          violatingResources: [violatingResource],
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
 * Extract a rule name from an annotation message.
 *
 * COUPLING NOTE: The `[ack: <id>]` format is produced by the `ackTag()` helper
 * in `annotations.ts`. If the tag format changes, this regex must be updated.
 */
function extractRuleName(message: string, severity: string): string {
  const ackMatch = message.match(/\[ack: ([^\]]+)\]/);
  if (ackMatch) {
    return ackMatch[1];
  }
  return `aws-cdk:${severity}`;
}
