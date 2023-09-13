export function decodeParameters(obj: Record<string, any>): any {
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

function decodeValue(value: any): any {
  if (value != null && !Array.isArray(value) && typeof value === 'object') {
    if (value.$type === 'ArrayBufferView') {
      return new TextEncoder().encode(value.string);
    }
  }

  return JSON.parse(value);
}

