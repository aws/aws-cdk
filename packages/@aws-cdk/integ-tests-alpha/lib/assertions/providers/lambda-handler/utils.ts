/**
 * Recurse into the given object, trying to parse any string as JSON
 */
export function deepParseJson<A extends string>(x: A): unknown;
export function deepParseJson<A extends object>(x: A): A;
export function deepParseJson(x: unknown): unknown {
  if (typeof x === 'string') {
    return tryJsonParse(x);
  }
  if (Array.isArray(x)) {
    return x.map(deepParseJson);
  }
  if (x && typeof x === 'object') {
    for (const [key, value] of Object.entries(x)) {
      (x as any)[key] = deepParseJson(value);
    }

    return x;
  }

  return x;
}

function tryJsonParse(v: string): unknown {
  if (typeof(v) !== 'string') {
    return v;
  }

  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

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

