/**
 * Format validation results in a human-friendly way, with per-severity coloring and construct information.
 *
 * Same formatting is used for both the CLI and the CDK app.
 */
import path from 'path';
import type { PluginReportJson, PolicyViolationJson, ViolatingConstructJson } from '@aws-cdk/cloud-assembly-schema';
import { Colorize } from './color';
import { isSuppressibleViolation } from './report';
import { topUserFrame } from '../../private/stack-trace';

export function formatValidationReports(fileRoot: string, reports: PluginReportJson[]): string[] {
  const successfullyExecutedPlugins = reports.filter((r) => isPluginFailure(r) === undefined);
  const pluginFailures = reports.map(isPluginFailure).filter((e) => e !== undefined);

  const violations = flattenViolations(successfullyExecutedPlugins);

  violations.sort((a, b) => {
    const aOrder = SEVERITY_ORDER[a.severity.toLowerCase()] ?? 4;
    const bOrder = SEVERITY_ORDER[b.severity.toLowerCase()] ?? 4;
    return aOrder - bOrder;
  });

  return [
    ...pluginFailures.map(formatPluginFailure),
    ...violations.map((v) => formatViolationBlock(fileRoot, v)),
  ];
}

function flattenViolations(reports: PluginReportJson[]): FlattenedViolation[] {
  return reports.flatMap((report) => {
    const pluginName = report.pluginName;
    return report.violations.flatMap((violation) => {
      return violation.violatingConstructs.map((construct) => ({
        severity: normalizeSeverity(violation.severity),
        description: violation.description,
        ruleName: violation.ruleName,
        pluginName,
        construct,
        suggestedFix: violation.suggestedFix,
        ruleMetadata: violation.ruleMetadata,
      }));
    });
  });
}

function normalizeSeverity(severity: string | undefined): string {
  switch (severity?.toLowerCase()) {
    case 'fatal': return 'FATAL';
    case 'error': return 'ERROR';
    case 'warning': return 'WARNING';
    case 'info': return 'INFO';
  }
  if (!severity) return 'WARNING';
  return sanitize(severity);
}

function formatViolationBlock(fileRoot: string, v: FlattenedViolation): string {
  const lines: string[] = [];

  const location = sourceLocation(fileRoot, v.construct.stackTraces);
  if (location) {
    lines.push(Colorize.underline(sanitize(location)));
  }

  lines.push([
    Colorize.bold(getSeverityColor(v.severity)(sanitize(v.severity))),
    Colorize.bold(stripAckTag(sanitize(v.description))),
    Colorize.grey(`(${namespace(v)})`),
  ].join(' '));

  const constructInfo = formatConstructInfo(fileRoot, v.construct);
  lines.push(`   ${constructInfo}`);

  if (v.suggestedFix) {
    lines.push(`   Suggested fix: ${sanitize(v.suggestedFix).replace(/\n/g, '\n   ')}`);
  }

  if (isSuppressibleViolation(v)) {
    lines.push(`   ${Colorize.grey(`Acknowledge with '${ackId(v)}'`)}`);
  } else {
    // If not acknowledgeable, we should still show the rule name for reference.
    lines.push(`   ${Colorize.grey(`Rule ${sanitize(ackId(v))}`)}`);
  }

  return lines.join('\n');
}

function getSeverityColor(severity: string): (str: string) => string {
  switch (severity.toLowerCase()) {
    case 'fatal': return Colorize.red;
    case 'error': return Colorize.orange;
    case 'warning': return Colorize.yellow;
    default: return Colorize.blue;
  }
}

function formatConstructInfo(fileRoot: string, construct: ViolatingConstructJson): string {
  const parts: string[] = [];
  const logicalId = sanitize(construct.cloudFormationResource?.logicalId);

  if (construct.constructPath) {
    const cPath = sanitize(construct.constructPath);
    parts.push(logicalId ? `${Colorize.bold(cPath)} (${logicalId})` : Colorize.bold(cPath));
  } else {
    // No construct information, show template path and logical ID
    if (construct.cloudFormationResource?.templatePath) {
      parts.push(humanFriendlyFilename(fileRoot, sanitize(construct.cloudFormationResource.templatePath)));
    }
    if (logicalId) {
      parts.push(Colorize.bold(logicalId));
    }
  }

  if (construct.constructFqn) {
    parts.push(Colorize.grey(sanitize(construct.constructFqn)));
  }

  return parts.join(' ');
}

function stripAckTag(description: string): string {
  return description.replace(/\s*\[ack:\s*[^\]]+\]\s*/g, '').trim();
}

function sourceLocation(fileRoot: string, stackTraces: string[] | undefined): string | undefined {
  for (const trace of stackTraces ?? []) {
    const frame = topUserFrame(trace.split('\n'));
    if (frame && frame.fileName) {
      return `${humanFriendlyFilename(fileRoot, frame.fileName)}:${frame.sourceLocation}`;
    }
  }
  return undefined;
}

function formatPluginFailure(f: PluginError): string {
  return `${Colorize.orange('ERROR')} ${sanitize(f.error)}`;
}

// Matches C0 control chars (except \t and \n), DEL, and CSI (8-bit mode).
// Strips ANSI escape sequences, carriage returns, backspaces, BEL, and
// bidirectional overrides that could spoof terminal output.
const CONTROL_CHARS = /[\x00-\x08\x0B-\x1F\x7F\x9B]/g;
function sanitize(s: string | undefined): string {
  return (s ?? '').replace(CONTROL_CHARS, '�');
}

export type FlattenedViolation =
  & Pick<PluginReportJson, 'pluginName'>
  & Pick<PolicyViolationJson, 'description' | 'ruleName' | 'suggestedFix' | 'ruleMetadata'>
  & { severity: string; construct: ViolatingConstructJson };

const SEVERITY_ORDER: Record<string, number> = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
};

export function humanFriendlyFilename(root: string, filename: string): string {
  const absPath = filename;
  const relPath = path.relative(root, filename);
  return relPath.length < absPath.length ? relPath : absPath;
}

interface PluginError {
  readonly error: string;
}

function isPluginFailure(r: PluginReportJson): PluginError | undefined {
  if (r.conclusion === 'success' || r.violations.length > 0 || !r.metadata?.error) {
    return undefined;
  }
  return { error: r.metadata.error };
}

function namespace(v: FlattenedViolation): string {
  return v.ruleName.includes('::') ? sanitize(v.ruleName.split('::')[0]) : sanitize(v.pluginName);
}

function ackId(v: FlattenedViolation): string {
  return (v.ruleName.includes('::') ? sanitize(v.ruleName) : `${sanitize(v.pluginName)}::${sanitize(v.ruleName)}`).replace(/ /g, '-');
}
