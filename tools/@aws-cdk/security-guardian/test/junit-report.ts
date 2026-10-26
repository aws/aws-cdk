import { DOMParser } from '@xmldom/xmldom';
import * as fs from 'fs';

function readReport(junitFile: string) {
  const xml = fs.readFileSync(junitFile, 'utf8');
  if (xml.trim() === '') {
    throw new Error(`cfn-guard wrote no JUnit report to ${junitFile} (is cfn-guard on PATH?)`);
  }
  return new DOMParser().parseFromString(xml, 'text/xml');
}

/**
 * Names of the rules that failed in a cfn-guard JUnit report.
 *
 * Needs a report written with enhanceXml disabled: only then is each failure
 * message the rule name (prefixed with "[Type: <type>] ").
 */
export function failedRules(junitFile: string): string[] {
  return Array.from(readReport(junitFile).getElementsByTagName('failure'))
    .map(failure => (failure.getAttribute('message') ?? '').replace(/^\[Type: [^\]]*\] /, ''));
}
