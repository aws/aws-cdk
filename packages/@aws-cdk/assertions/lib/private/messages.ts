import { Messages } from './message';
import { formatFailure, matchSection } from './section';

export function findMessage(messages: Messages, props: any = {}): { [key: string]: { [key: string]: any } } {
  const result = matchSection(messages, props);

  if (!result.match) {
    return {};
  }

  return result.matches as Messages;
}

export function hasMessage(messages: Messages, props: any): string | void {
  const result = matchSection(messages, props);
  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return 'No parameters found in the template';
  }

  return [
    `Template has ${result.analyzedCount} parameters, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}
