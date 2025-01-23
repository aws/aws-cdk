/**
 * Pad 's' on the left with 'char' until it is n characters wide
 */
export function leftPad(s: string, n: number, char: string) {
  const padding = Math.max(0, n - s.length);
  return char.repeat(padding) + s;
}

/**
 * Formats time in milliseconds (which we get from 'Date.getTime()')
 * to a human-readable time; returns time in seconds rounded to 2
 * decimal places.
 */
export function formatTime(num: number): number {
  return roundPercentage(millisecondsToSeconds(num));
}

/**
 * Rounds a decimal number to two decimal points.
 * The function is useful for fractions that need to be outputted as percentages.
 */
function roundPercentage(num: number): number {
  return Math.round(100 * num) / 100;
}

/**
 * Given a time in milliseconds, return an equivalent amount in seconds.
 */
function millisecondsToSeconds(num: number): number {
  return num / 1000;
}

/**
 * Takes in an error and returns a correctly formatted string of its error message.
 * If it is an AggregateError, it will return a string with all the inner errors
 * formatted and separated by a newline.
 *
 * @param error The error to format
 * @returns A string with the error message(s) of the error
 */
export function formatErrorMessage(error: any): string {
  if (error && Array.isArray(error.errors)) {
    const innerMessages = error.errors
      .map((innerError: { message: any; toString: () => any }) => (innerError?.message || innerError?.toString()))
      .join('\n');
    return `AggregateError: ${innerMessages}`;
  }

  // Fallback for regular Error or other types
  return error?.message || error?.toString() || 'Unknown error';
}
