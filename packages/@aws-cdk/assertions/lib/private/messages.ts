import { MatchResult } from '../matcher';
import { Messages } from './message';
import { filterLogicalId, formatFailure, matchSection } from './section';

export function findMessage(messages: Messages, logicalId: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section: { [key: string]: {} } = messages;
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasMessage(messages: Messages, logicalId: string, props: any): string | void {
  const section: { [key: string]: {} } = messages;
  const result = matchSection(filterLogicalId(section, logicalId), props);

  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No messages found in the stack';
  }

  return [
    `Stack has ${result.analyzedCount} messages, but none match as expected.`,
    formatFailure(formatMessage(result.closestResult)),
  ].join('\n');
}

// We redact the stack trace by default because it is unnecessarily long and unintelligible.
// If there is a use case for rendering the trace, we can add it later.
function formatMessage(match: MatchResult, renderTrace: boolean = false): MatchResult {
  if (!renderTrace) {
    match.target.entry.trace = 'redacted';
  }
  return match;
}
