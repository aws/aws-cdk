import { DocsSpec } from '@cdklabs/typewriter';

/**
 * Split the doc comment into summary and remarks
 *
 * Normally, we'd expect people to split into a summary line and detail lines using paragraph
 * markers. However, a LOT of people do not do this, and just paste a giant comment block into
 * the docstring. If we detect that situation, we will try and extract the first sentence (using
 * a period) as the summary.
 */
export function splitSummary(docBlock: string | undefined): [string | undefined, string | undefined] {
  if (!docBlock) {
    return [undefined, undefined];
  }
  const summary = summaryLine(docBlock);
  const remarks = uberTrim(docBlock.slice(summary.length));
  return [endWithPeriod(noNewlines(summary.trim())), remarks];
}

/**
 * Replace newlines with spaces for use in tables
 */
function noNewlines(s: string) {
  return s.replace(/\n/g, ' ');
}

function endWithPeriod(s: string) {
  return ENDS_WITH_PUNCTUATION_REGEX.test(s) ? s : `${s}.`;
}

/**
 * Trims a string and turns it into `undefined` if the result would have been an
 * empty string.
 */
function uberTrim(str: string): string | undefined {
  str = str.trim();
  return str === '' ? undefined : str;
}

const SUMMARY_MAX_WORDS = 20;

/**
 * Find the summary line for a doc comment
 *
 * In principle we'll take the first paragraph, but if there are no paragraphs
 * (because people don't put in paragraph breaks) or the first paragraph is too
 * long, we'll take the first sentence (terminated by a punctuation).
 */
function summaryLine(str: string) {
  const paras = str.split('\n\n');
  if (paras.length > 1 && paras[0].split(' ').length < SUMMARY_MAX_WORDS) {
    return paras[0];
  }

  const m = FIRST_SENTENCE_REGEX.exec(str);
  if (m) {
    return m[1];
  }

  return paras[0];
}

const PUNCTUATION = ['!', '?', '.', ';'].map((s) => `\\${s}`).join('');
const ENDS_WITH_PUNCTUATION_REGEX = new RegExp(`[${PUNCTUATION}]$`);
const FIRST_SENTENCE_REGEX = new RegExp(`^([^${PUNCTUATION}]+[${PUNCTUATION}][ \n\r])`); // Needs a whitespace after the punctuation.

/**
 * Split a documentation string into a structure that can be passed to typewriter
 */
export function splitDocumentation(x: string | undefined): Pick<DocsSpec, 'summary' | 'remarks'> {
  const [summary, remarks] = splitSummary(x);
  return { summary, remarks };
}
