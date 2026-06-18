/**
 * Format validation results in a human-friendly way, with per-severity coloring and construct information.
 *
 * Same formatting is used for both the CLI and the CDK app.
 */
import type { PluginReportJson, ViolatingConstructJson } from '@aws-cdk/cloud-assembly-schema';
import { Colorize } from './color';
import { topUserFrame } from '../../private/stack-trace';

export function formatValidationReports(reports: PluginReportJson[]): string[] {
  const violations = flattenViolations(reports);

  violations.sort((a, b) => {
    const aOrder = SEVERITY_ORDER[a.severity.toLowerCase()] ?? 4;
    const bOrder = SEVERITY_ORDER[b.severity.toLowerCase()] ?? 4;
    return aOrder - bOrder;
  });

  return violations.map((v) => formatViolationBlock(v));
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
      }));
    });
  });
}

function normalizeSeverity(severity: string | undefined): string {
  if (!severity) return 'Warning';
  const lower = severity.toLowerCase();
  if (lower === 'fatal') return 'Fatal';
  if (lower === 'error') return 'Error';
  if (lower === 'warning') return 'Warning';
  if (lower === 'info') return 'Info';
  const safe = sanitize(severity);
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}

function formatViolationBlock(v: FlattenedViolation): string {
  const lines: string[] = [];

  const location = sourceLocation(v.construct.stackTraces);
  if (location) {
    lines.push(Colorize.underline(sanitize(location)));
  }

  lines.push([
    Colorize.bold(getSeverityColor(v.severity)(sanitize(v.severity))),
    Colorize.bold(stripAckTag(sanitize(v.description))),
    Colorize.grey(sanitize(v.pluginName)),
  ].join(' '));

  const constructInfo = formatConstructInfo(v.construct);
  lines.push(`   ${constructInfo}`);

  if (v.severity.toLowerCase() !== 'fatal') {
    const ackId = `${sanitize(v.pluginName)}::${sanitize(v.ruleName)}`.replace(/ /g, '-');
    lines.push(`   Acknowledge '${ackId}'`);
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

function formatConstructInfo(construct: ViolatingConstructJson): string {
  const parts: string[] = [];
  const logicalId = sanitize(construct.cloudFormationResource?.logicalId);

  if (construct.constructPath) {
    const cPath = sanitize(construct.constructPath);
    parts.push(logicalId ? `${Colorize.bold(cPath)} (${logicalId})` : Colorize.bold(cPath));
  } else if (logicalId) {
    parts.push(Colorize.bold(logicalId));
  }

  if (construct.constructFqn) {
    parts.push(Colorize.grey(sanitize(construct.constructFqn)));
  }

  return parts.join(' ');
}

function stripAckTag(description: string): string {
  return description.replace(/\s*\[ack:\s*[^\]]+\]\s*/g, '').trim();
}

function sourceLocation(stackTraces: string[] | undefined): string | undefined {
  for (const trace of stackTraces ?? []) {
    const frame = topUserFrame(trace.split('\n'));
    if (frame) {
      return `${frame.fileName}:${frame.sourceLocation}`;
    }
  }
  return undefined;
}

// Matches C0 control chars (except \t and \n), DEL, and CSI (8-bit mode).
// Strips ANSI escape sequences, carriage returns, backspaces, BEL, and
// bidirectional overrides that could spoof terminal output.
const CONTROL_CHARS = /[\x00-\x08\x0B-\x1F\x7F\x9B]/g;
function sanitize(s: string | undefined): string {
  return (s ?? '').replace(CONTROL_CHARS, '�');
}

interface FlattenedViolation {
  readonly severity: string;
  readonly description: string;
  readonly ruleName: string;
  readonly pluginName: string;
  readonly construct: ViolatingConstructJson;
}

const SEVERITY_ORDER: Record<string, number> = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
};
