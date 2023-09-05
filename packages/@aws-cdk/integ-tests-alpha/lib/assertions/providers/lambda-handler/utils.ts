export function parseJsonPayload(payload: string | Buffer | Uint8Array | undefined | null): any {
  // sdk v3 returns payloads in Uint8Array, either it or a string or Buffer
  // can be cast into a buffer and then decoded.
  const text = new TextDecoder().decode(Buffer.from(payload ?? ''));
  if (!text) { return { }; }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`return values from user-handlers must be JSON objects. got: "${text}"`);
  }
}

export function decodeParameters(obj: Record<string, string>): any {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
    try {
      return [key, JSON.parse(value)];
    } catch {
      // if the value cannot be parsed, leave it unchanged
      // this will end up as a string
      return [key, value];
    }
  }));
}
