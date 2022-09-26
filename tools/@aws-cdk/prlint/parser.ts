import * as parser from 'conventional-commits-parser';

export function breakingModules(title: string, body: string): string[] {
  const parsed = parser.sync(`${title}\n\n${body}`);
  const breakingNotes = parsed.notes && parsed.notes.filter(n => n.title === 'BREAKING CHANGE');
  if (!breakingNotes || breakingNotes.length === 0) {
    return [];
  }
  if (breakingNotes.length > 1) {
    throw new Error('Multiple "BREAKING CHANGE" clause is disallowed.');
  }
  const lines = breakingNotes[0].text.split(/[\n\r]+/).map(l => l.trim());
  const breakingModules: string[] = [];
  parsed.scope ? breakingModules.push(parsed.scope) : {};
  const re = /^\* \*\*([\w]+)\*\*/;
  for (const line of lines) {
    const match = re.exec(line);
    match && breakingModules.push(match[1]);
  }
  return breakingModules;
}