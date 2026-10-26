import { DOMParser, Element } from '@xmldom/xmldom';
import * as fs from 'fs';

function readReport(junitFile: string) {
  const xml = fs.readFileSync(junitFile, 'utf8');
  if (xml.trim() === '') {
    throw new Error(`cfn-guard wrote no JUnit report to ${junitFile} (is cfn-guard on PATH?)`);
  }
  // Keep line endings as written, as the reader of the report in the workflow does
  return new DOMParser({ normalizeLineEndings: source => source }).parseFromString(xml, 'text/xml');
}

/**
 * Names of the rules that failed in a cfn-guard JUnit report.
 *
 * Needs a report written with enhanceXml disabled: only then is each failure
 * message the rule name (prefixed with "[Type: <type>] ").
 */
export function failedRules(junitFile: string): string[] {
  return failures(junitFile).map(failure => failure.message.replace(/^\[Type: [^\]]*\] /, ''));
}

/**
 * The message and text of each failure in a cfn-guard JUnit report.
 */
export function failures(junitFile: string): { message: string; text: string }[] {
  return Array.from(readReport(junitFile).getElementsByTagName('failure'))
    .map(failure => ({ message: failure.getAttribute('message') ?? '', text: failure.textContent ?? '' }));
}

/**
 * An element of a JUnit report, with its text as strings among its children.
 */
export interface ReportElement {
  readonly name: string;
  readonly attributes: Record<string, string>;
  readonly children: (ReportElement | string)[];
}

/**
 * The elements, attributes and text of a JUnit report, without the whitespace
 * that indents its elements.
 */
export function reportTree(junitFile: string): ReportElement {
  return elementTree(readReport(junitFile).documentElement!);
}

function elementTree(element: Element): ReportElement {
  const children: (ReportElement | string)[] = [];
  for (const child of Array.from(element.childNodes)) {
    if (child.nodeType === child.ELEMENT_NODE) {
      children.push(elementTree(child as Element));
    } else if (child.nodeType === child.TEXT_NODE && child.textContent!.trim() !== '') {
      children.push(child.textContent!);
    }
  }
  return {
    name: element.tagName,
    attributes: Object.fromEntries(Array.from(element.attributes).map(attribute => [attribute.name, attribute.value])),
    children,
  };
}
