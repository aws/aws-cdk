import * as fs from 'fs';

/**
 * Names of the rules that failed in a cfn-guard JUnit report.
 *
 * Needs a report written with enhanceXml disabled: only then is each failure
 * message the rule name (prefixed with "[Type: <type>] ").
 */
export function failedRules(junitFile: string): string[] {
  const xml = fs.readFileSync(junitFile, 'utf8');
  return [...xml.matchAll(/<failure message="(?:\[Type: [^\]]*\] )?([^"]*)"/g)].map(match => match[1]);
}
