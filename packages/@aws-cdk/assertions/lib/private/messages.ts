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

  const renderTrace = props.entry?.trace ? true : false;
  return [
    `Stack has ${result.analyzedCount} messages, but none match as expected.`,
    formatFailure(formatMessage(result.closestResult, renderTrace)),
  ].join('\n');
}

/**
 * We redact the stack trace by default because it is unnecessarily long and unintelligible.
 * The only time where we include the stack trace is when we are asserting against it.
 */
function formatMessage(match: MatchResult, renderTrace: boolean = false): MatchResult {
  if (!renderTrace) {
    match.target.entry.trace = 'redacted';
  }
  return match;
}
