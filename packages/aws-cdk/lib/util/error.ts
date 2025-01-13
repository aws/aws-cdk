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
