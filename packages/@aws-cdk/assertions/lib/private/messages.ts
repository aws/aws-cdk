import { SynthesisMessage } from '@aws-cdk/cx-api';
import { Messages } from './message';
import { formatAllMatches, formatFailure, matchSection } from './section';

export function findMessage(messages: Messages, constructPath: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section: { [key: string]: SynthesisMessage } = messages;
  const result = matchSection(filterPath(section, constructPath), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasMessage(messages: Messages, constructPath: string, props: any): string | void {
  const section: { [key: string]: SynthesisMessage } = messages;
  const result = matchSection(filterPath(section, constructPath), props);

  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No messages found in the stack';
  }

  handleTrace(result.closestResult.target);
  return [
    `Stack has ${result.analyzedCount} messages, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}

export function hasNoMessage(messages: Messages, constructPath: string, props: any): string | void {
  const section: { [key: string]: SynthesisMessage } = messages;
  const result = matchSection(filterPath(section, constructPath), props);

  if (!result.match) {
    return;
  }

  return [
    `Expected no matches, but stack has ${Object.keys(result.matches).length} messages as follows:`,
    formatAllMatches(result.matches),
  ].join('\n');
}

// We redact the stack trace by default because it is unnecessarily long and unintelligible.
// If there is a use case for rendering the trace, we can add it later.
function handleTrace(match: any, redact: boolean = true): void {
  if (redact && match.entry?.trace !== undefined) {
    match.entry.trace = 'redacted';
  };
}

function filterPath(section: { [key: string]: SynthesisMessage }, path: string): { [key: string]: SynthesisMessage } {
  // default signal for all paths is '*'
  if (path === '*') return section;

  return Object.entries(section ?? {})
    .filter(([_, v]) => v.id === path)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}
