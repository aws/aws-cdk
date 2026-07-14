import * as path from 'path';
import type { IConstruct } from 'constructs';
import type { IPolicyValidationPlugin, IPolicyValidationContext } from '../validation';
import { iterateDfsPreorder } from './construct-iteration';
import * as cxschema from '../../../cloud-assembly-schema';
import { Stack } from '../stack';
import type { NamedValidationPluginReport } from '../validation/private/report';
import type { PolicyValidationPluginReport, PolicyViolation, PolicyViolatingResource } from '../validation/report';

/**
 * Wraps the annotation collection logic as an IPolicyValidationPlugin
 * so it can be run through the same unified plugin loop.
 *
 * Because the released version of this logic had a version where this plugin
 * was called 'Construct Annotations', and the CLI looked for the report issued
 * by this plugin by name, we need to keep the name stable for backwards
 * compatibility.
 *
 * However, the display title and acknowledgement title of annotations issued
 * by this plugin is now `Annotation::<rule-name>`, *unless* the annotation ID already
 * has a prefix in which case the prefix is preserved.
 */
export class AnnotationPlugin implements IPolicyValidationPlugin {
  public static RULE_PREFIX = 'Annotation';
  public static NAME = 'Construct Annotations';
  public readonly name = AnnotationPlugin.NAME;

  constructor(private readonly report: NamedValidationPluginReport) {}

  public validate(_context: IPolicyValidationContext): PolicyValidationPluginReport {
    return this.report;
  }
}

/**
 * Collect annotation metadata (warnings and errors) from the construct tree
 * and convert them into a NamedValidationPluginReport that can be merged
 * into the same report pipeline as plugin violations.
 */
export function collectAnnotationReport(root: IConstruct, outdir: string): IPolicyValidationPlugin | undefined {
  const violationMap = new Map<string, PolicyViolation & { violatingResources: PolicyViolatingResource[] }>();

  for (const construct of iterateDfsPreorder(root)) {
    for (const entry of construct.node.metadata) {
      if (entry.type !== cxschema.ArtifactMetadataEntryType.WARN && entry.type !== cxschema.ArtifactMetadataEntryType.ERROR) {
        continue;
      }

      const severity = entry.type === cxschema.ArtifactMetadataEntryType.ERROR ? 'error' : 'warning';
      let { message, ruleName } = splitDescriptionAndId(String(entry.data));

      if (ruleName && !ruleName.includes('::')) {
        ruleName = `${AnnotationPlugin.RULE_PREFIX}::${ruleName}`;
      }

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
          ruleName: ruleName ?? `${AnnotationPlugin.RULE_PREFIX}::${severity}-annotation`,
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
  return new AnnotationPlugin({
    pluginName: AnnotationPlugin.NAME,
    success: !hasErrors,
    violations,
    metadata: {
      'cdk:annotations': 'true',
    },
  });
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
