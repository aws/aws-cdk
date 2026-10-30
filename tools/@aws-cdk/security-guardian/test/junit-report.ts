import { DOMParser } from '@xmldom/xmldom';
import * as fs from 'fs';

export interface GuardTestCase {
  /** The rule file cfn-guard evaluated, for example "iam-no-wildcard-actions.guard" */
  readonly ruleFile: string;
  /** "pass", "skip", or "fail" for a test case that carries a failure instead of a status */
  readonly status: string;
}

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

/** Every test case in a cfn-guard JUnit report, one per rule file and data file. */
export function testCases(junitFile: string): GuardTestCase[] {
  return Array.from(readReport(junitFile).getElementsByTagName('testcase')).map(testCase => ({
    ruleFile: testCase.getAttribute('name') ?? '',
    status: testCase.getAttribute('status') ?? 'fail',
  }));
}
