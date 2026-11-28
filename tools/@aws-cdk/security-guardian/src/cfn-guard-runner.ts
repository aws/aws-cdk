import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { Document, DOMParser, Element, XMLSerializer } from '@xmldom/xmldom';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateVerdicts } from './condition-verdict';

function parseReport(xmlFile: string, xmlContent: string): Document {
  let cause: string | undefined;
  const parser = new DOMParser({
    // Keep line endings from template values as cfn-guard wrote them
    normalizeLineEndings: source => source,
    // Stop at the first error rather than edit a partly parsed report
    onError: (level, message) => {
      if (level !== 'warning') {
        cause = message;
        throw new Error(message);
      }
    },
  });
  try {
    return parser.parseFromString(xmlContent, 'text/xml');
  } catch (err) {
    throw new Error(`Could not parse the cfn-guard report ${xmlFile}: ${cause ?? (err as Error).message}`);
  }
}

function editReport(xmlFile: string, edit: (report: Document) => void): void {
  const xmlContent = fs.readFileSync(xmlFile, 'utf8');
  // The report is empty when cfn-guard did not write one
  if (xmlContent === '') {
    return;
  }

  const report = parseReport(xmlFile, xmlContent);
  edit(report);
  fs.writeFileSync(xmlFile, new XMLSerializer().serializeToString(report));
}

function reverseFilenames(report: Document, fileMapping: Map<string, string>): void {
  for (const testsuite of Array.from(report.getElementsByTagName('testsuite'))) {
    let currentName = testsuite.getAttribute('name') ?? '';
    let resolved = fileMapping.get(currentName);

    while (resolved && resolved !== currentName) {
      currentName = resolved;
      resolved = fileMapping.get(currentName);
    }

    const finalName = currentName;
    testsuite.setAttribute('name', finalName);
    testsuite.setAttribute('file', finalName);
  }
}

export function postProcessXml(outputFile: string, fileMapping: Map<string, string>, type: string): void {
  if (fs.existsSync(outputFile)) {
    editReport(outputFile, report => {
      reverseFilenames(report, fileMapping);

      for (const failure of Array.from(report.getElementsByTagName('failure'))) {
        failure.setAttribute('message', `[Type: ${type}] ${failure.getAttribute('message') ?? ''}`);
      }
    });
  }
}

export function enhanceXmlWithFormattedFailures(xmlFilePath: string): void {
  if (!fs.existsSync(xmlFilePath)) {
    core.warning(`XML file not found: ${xmlFilePath}`);
    return;
  }
  
  editReport(xmlFilePath, report => {
    // Split failure content into new lines based on "Check was not compliant as property"
    for (const failure of Array.from(report.getElementsByTagName('failure'))) {
      const content = failure.textContent ?? '';
      // Extract custom error message from the failure body (one per failure element)
      const customMsgMatch = content.match(/##ERROR:([\s\S]*?)##/);
      if (customMsgMatch) {
        failure.setAttribute('message', customMsgMatch[1]);
      }
      let splitContent = content.replace(/##ERROR:([\s\S]*?)##/g, '');
      splitContent = splitContent.replace(/Check was not compliant as property/g, '\nCheck was not compliant as property');
      failure.textContent = splitContent;
    }
  });
  core.info(`Enhanced XML file with split failure content: ${xmlFilePath}`);
}

/** The rules whose failures the Condition verdicts can turn into passes */
const WORLD_ACCESS_RULES = new Set([
  'S3_NO_WORLD_READABLE',
  'S3_NO_WORLD_WRITABLE',
  'SNS_NO_WORLD_ACCESSIBLE',
  'SNS_NO_WORLD_ACCESSIBLE_INLINE',
  'SQS_NO_WORLD_ACCESSIBLE',
  'SQS_NO_WORLD_ACCESSIBLE_INLINE',
]);

/** The exit status of cfn-guard 3 when a rule is not compliant */
const NOT_COMPLIANT_EXIT_STATUS = 19;

/**
 * The location of a statement's Principal, Principal.AWS or one element of Principal.AWS, the places
 * the world access rules check: the logical ID, and the statement index when Statement is a list
 */
const STATEMENT_PRINCIPAL = /^\/Resources\/([A-Za-z0-9]+)\/Properties\/PolicyDocument\/Statement(?:\/(0|[1-9][0-9]*))?\/Principal(?:\/AWS(?:\/(?:0|[1-9][0-9]*))?)?$/;

/**
 * Where cfn-guard 3.2.1 gives the template location of a failed check in its structured JSON output.
 * A key marked with ! must be the only key of its object. A Binary check's `to` side is the compared
 * value, not a location.
 */
const CHECK_LOCATIONS = [
  ['Clause!', 'Binary!', 'check', 'Resolved!', 'from', 'path'],
  ['Clause!', 'Binary!', 'check', 'UnResolved!', 'value', 'traversed_to', 'path'],
  ['Clause!', 'Unary!', 'check', 'Resolved!', 'value', 'path'],
  ['Block!', 'unresolved', 'traversed_to', 'path'],
];

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkLocation(check: unknown): string | undefined {
  for (const form of CHECK_LOCATIONS) {
    let value: unknown = check;
    for (const step of form) {
      const key = step.replace(/!$/, '');
      const soleKey = step.endsWith('!');
      value = isObject(value) && (!soleKey || Object.keys(value).length === 1) ? value[key] : undefined;
    }
    if (typeof value === 'string') {
      return value;
    }
  }
  return undefined;
}

function isOnLimitedStatement(location: string | undefined, verdicts: TemplateVerdicts): boolean {
  const match = location === undefined ? null : STATEMENT_PRINCIPAL.exec(location);
  const verdict = match ? verdicts.get(match[1]) : undefined;
  if (!match || !verdict) {
    return false;
  }
  const index = match[2] === undefined ? undefined : Number(match[2]);
  if (verdict.statementIsList) {
    return index !== undefined && verdict.limitedStatements.has(index);
  }
  // The resolved copy wraps a Statement that is one object in a list
  return (index === undefined || index === 0) && verdict.limitedStatements.has(0);
}

/**
 * The failed checks of each rule for each data file, from cfn-guard's structured JSON output.
 * A data file whose result cannot be read in full, or that appears twice, maps to undefined.
 */
function failedChecks(output: string): Map<string, Map<string, unknown[]> | undefined> {
  const results: unknown = JSON.parse(output);
  if (!Array.isArray(results)) {
    throw new Error('the cfn-guard JSON output is not a list of results');
  }
  const byFile = new Map<string, Map<string, unknown[]> | undefined>();
  for (const result of results) {
    if (!isObject(result) || typeof result.name !== 'string') {
      throw new Error('a cfn-guard JSON result names no data file');
    }
    const notCompliant = result.not_compliant ?? [];
    let rules: Map<string, unknown[]> | undefined = new Map();
    for (const entry of Array.isArray(notCompliant) ? notCompliant : [undefined]) {
      const rule = isObject(entry) ? entry.Rule : undefined;
      if (!isObject(rule) || typeof rule.name !== 'string' || !Array.isArray(rule.checks)) {
        rules = undefined;
        break;
      }
      rules.set(rule.name, [...(rules.get(rule.name) ?? []), ...rule.checks]);
    }
    byFile.set(result.name, byFile.has(result.name) ? undefined : rules);
  }
  return byFile;
}

function lowerFailureCount(element: Element): void {
  const failures = element.getAttribute('failures') ?? '';
  if (!/^[1-9][0-9]*$/.test(failures)) {
    throw new Error(`<${element.tagName}> has failures="${failures}"`);
  }
  element.setAttribute('failures', String(Number(failures) - 1));
}

function childElements(element: Element): Element[] {
  return Array.from(element.childNodes).filter(child => child.nodeType === child.ELEMENT_NODE) as Element[];
}

/**
 * Turns each test case of a world access rule whose failed checks are all on limited statements
 * into a passing test case. Returns whether the scan passes: at least one test case was turned into
 * a pass, no failure and no error remain, and every rule the JSON output reports as not compliant is
 * one whose test case was turned into a pass.
 *
 * Locations come from a second cfn-guard run with structured JSON output, never from the failure
 * text, which can quote template values. Anything that cannot be matched stays as cfn-guard wrote it,
 * including every test case of a data file for which the two outputs name different failed rules:
 * cfn-guard reports a rule file with several rules as one test case named after one of them.
 */
async function passLimitedStatements(dataDir: string, ruleSetPath: string, outputFile: string, verdicts: ReadonlyMap<string, TemplateVerdicts>): Promise<boolean> {
  const { exitCode, stdout } = await exec.getExecOutput('cfn-guard', [
    'validate', '--data', dataDir, '--rules', ruleSetPath, '--output-format', 'json', '--structured', '--show-summary', 'none',
  ], { ignoreReturnCode: true, silent: true });
  if (exitCode !== NOT_COMPLIANT_EXIT_STATUS) {
    throw new Error(`the cfn-guard run for JSON output exited with status ${exitCode}`);
  }
  const checksByFile = failedChecks(stdout);
  // cfn-guard names each data file by its canonical path
  const verdictsByFile = new Map([...verdicts].map(([file, fileVerdicts]) => [canonicalPath(file), fileVerdicts]));

  let passed = false;
  editReport(outputFile, report => {
    const root = report.documentElement;
    if (!root || root.tagName !== 'testsuites') {
      throw new Error('the report has no <testsuites> element');
    }
    const passedRules = new Map<string, Set<string>>();
    for (const testsuite of Array.from(report.getElementsByTagName('testsuite'))) {
      const file = testsuite.getAttribute('name') ?? '';
      const fileVerdicts = verdictsByFile.get(file);
      const fileChecks = checksByFile.get(file);
      const testCases = Array.from(testsuite.getElementsByTagName('testcase'));
      const reportedRules = new Set(testCases.flatMap(testCase => childElements(testCase)
        .filter(child => child.tagName === 'failure')
        .map(failure => failure.getAttribute('message') ?? '')));
      if (!fileVerdicts || !fileChecks || reportedRules.size !== fileChecks.size || ![...reportedRules].every(rule => fileChecks.has(rule))) {
        continue;
      }
      for (const testCase of testCases) {
        const children = childElements(testCase);
        const rule = children.length === 1 && children[0].tagName === 'failure' ? children[0].getAttribute('message') ?? '' : '';
        const checks = fileChecks.get(rule) ?? [];
        if (!WORLD_ACCESS_RULES.has(rule) || checks.length === 0 || !checks.every(check => isOnLimitedStatement(checkLocation(check), fileVerdicts))) {
          continue;
        }
        while (testCase.firstChild) {
          testCase.removeChild(testCase.firstChild);
        }
        testCase.setAttribute('status', 'pass');
        lowerFailureCount(testsuite);
        lowerFailureCount(root);
        passedRules.set(file, (passedRules.get(file) ?? new Set()).add(rule));
        core.info(`Reported ${rule} as passed for ${file}: each failed check is on a statement whose Condition limits it to fixed values`);
      }
    }
    // A not-compliant exit passes only through a failure turned into a pass, never because neither output names one
    passed = passedRules.size > 0
      && report.getElementsByTagName('failure').length === 0
      && report.getElementsByTagName('error').length === 0
      && [...checksByFile].every(([file, rules]) => rules !== undefined && [...rules.keys()].every(rule => passedRules.get(file)?.has(rule)));
  });
  return passed;
}

function canonicalPath(file: string): string {
  try {
    return fs.realpathSync(file);
  } catch {
    return path.resolve(file);
  }
}

/**
 * Runs cfn-guard on `dataDir` with `ruleSetPath`, writes its JUnit report to `outputFile` and
 * returns whether the scan passed.
 *
 * With `verdicts`, the Condition verdicts of each data file by its path, a failure of a world access
 * rule whose every failed check is on a limited statement is reported as a pass.
 */
export async function runCfnGuardValidation(
  dataDir: string,
  ruleSetPath: string,
  outputFile: string,
  type: string,
  fileMapping: Map<string, string>,
  enhanceXml: boolean = true,
  verdicts?: ReadonlyMap<string, TemplateVerdicts>,
): Promise<boolean> {
  // Only the cfn-guard run counts as a finding; an error while editing its report fails the scan
  let passed = true;
  let exitStatus: number | undefined;
  try {
    // With verdicts, the exit status decides whether the report can be matched to them
    exitStatus = await exec.exec('sh', [
      '-c',
      `cfn-guard validate --data "${dataDir}" --rules "${ruleSetPath}" --output-format junit --structured --show-summary none > "${outputFile}"`
    ], verdicts ? { ignoreReturnCode: true } : undefined);
  } catch (err) {
    passed = false;
    core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
    core.debug((err as Error).message);
  }
  if (exitStatus !== undefined && exitStatus !== 0) {
    passed = false;
    core.debug(`cfn-guard exited with status ${exitStatus}`);
    if (verdicts && exitStatus === NOT_COMPLIANT_EXIT_STATUS) {
      try {
        passed = await passLimitedStatements(dataDir, ruleSetPath, outputFile, verdicts);
      } catch (err) {
        core.warning(`Kept the CFN-Guard (${type}) report as cfn-guard wrote it: ${(err as Error).message}`);
      }
    }
    if (!passed) {
      core.warning(`⚠️ CFN-Guard (${type}) validation found issues`);
    }
  }

  if (enhanceXml) {
    enhanceXmlWithFormattedFailures(outputFile);
  }
  postProcessXml(outputFile, fileMapping, type);

  if (passed) {
    core.info(`✅ CFN-Guard (${type}) validation passed`);
  }
  return passed;
}