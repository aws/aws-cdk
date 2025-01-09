function formatErrorMessage(error: any): string {
  if (error && Array.isArray(error.errors)) {
    const innerMessages = error.errors
      .map((innerError: { message: any; toString: () => any }) => (innerError?.message || innerError?.toString()))
      .join('\n');
    return `AggregateError: ${innerMessages}`;
  }

  // Fallback for regular Error or other types
  return error?.message || error?.toString() || 'Unknown error';
}
