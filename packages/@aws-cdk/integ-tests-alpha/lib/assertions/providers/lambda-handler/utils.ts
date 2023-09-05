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
      return [key, decodeValue(value)];
    } catch {
      // if the value cannot be parsed, leave it unchanged
      // this will end up as a string
      return [key, value];
    }
  }));
}

function decodeValue(value: string): any {
  const parsed = JSON.parse(value);
  const entries = Object.entries(parsed);

  if (isByteArray(entries)) {
    const bytes = entries
      .map(([k, v]) => [parseInt(k), v])
      .sort(([k1, _v1], [k2, _v2]) => k1 - k2)
      .map(([_k, v]) => v);

    return Uint8Array.from([...bytes]);
  }
  return parsed;
}

function isByteArray(entries: [string, unknown][]): entries is [string, number][] {
  // Uint8Arrays are stringified as objects like this:
  // {"0":123,"1":34,"2":110,"3":97,"4":109}
  return entries.every(([k, v]) => !isNaN(parseInt(k)) && typeof v === 'number');
}
