import * as parser from 'conventional-commits-parser';

export function breakingModules(title: string, body: string): string[] {
  const parsed = parser.sync(`${title}\n\n${body}`);
  const lines = parsed.footer && parsed.footer.split(/[\n\r]+/).map(l => l.trim());
  if (!lines || !lines.shift()?.startsWith('BREAKING CHANGE: ')) {
    return [];
  }
  const breakingModules: string[] = []
  if (!parsed.scope) {
    throw new Error('Commits with breaking change must specify a "scope" in the title. See https://www.conventionalcommits.org');
  }
  parsed.scope && breakingModules.push(parsed.scope);
  for (const line of lines) {
    const re = /^\* \*\*([\w]+)\*\*/
    const match = re.exec(line);
    match && breakingModules.push(match[1]);
  }
  return breakingModules;
}