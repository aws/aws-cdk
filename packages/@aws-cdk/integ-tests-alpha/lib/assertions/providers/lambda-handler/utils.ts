export function parseJsonPayload(payload: any): any {
  // sdk v3 returns payloads in Uint8Array
  // If the payload is not convertible to a buffer or parsable as JSON, we don't touch it
  try {
    const buffer = Buffer.from(payload);
    return JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    return payload;
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
