import * as colors from 'colors/safe';

/**
 * Returns a set of strings when printed on the console produces a banner msg. The message is in the following format -
 * ********************
 * *** msg line x   ***
 * *** msg line xyz ***
 * ********************
 *
 * Spec:
 * - The width of every line is equal, dictated by the longest message string
 * - The first and last lines are '*'s for the full length of the line
 * - Each line in between is prepended with '*** ' and appended with ' ***'
 * - The text is indented left, i.e. whitespace is right-padded when the length is shorter than the longest.
 *
 * @param msgs array of strings containing the message lines to be printed in the banner. Returns empty string if array
 * is empty.
 * @returns array of strings containing the message formatted as a banner
 */
export function formatAsBanner(msgs: string[]): string[] {
  const printLen = (str: string) => colors.strip(str).length;

  if (msgs.length === 0) {
    return [];
  }

  const leftPad = '*** ';
  const rightPad = ' ***';
  const bannerWidth = printLen(leftPad) + printLen(rightPad) +
    msgs.reduce((acc, msg) => Math.max(acc, printLen(msg)), 0);

  const bannerLines: string[] = [];
  bannerLines.push('*'.repeat(bannerWidth));

  // Improvement: If any 'msg' is wider than the terminal width, wrap message across lines.
  msgs.forEach((msg) => {
    const padding = ' '.repeat(bannerWidth - (printLen(msg) + printLen(leftPad) + printLen(rightPad)));
    bannerLines.push(''.concat(leftPad, msg, padding, rightPad));
  });

  bannerLines.push('*'.repeat(bannerWidth));
  return bannerLines;
}
