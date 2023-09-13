async function coerceValue(v: any) {

  if (v && typeof(v) === 'object' && typeof((v as any).transformToString) === 'function') {
    // in sdk v3 some return types are now adapters that we need to explicitly
    // convert to strings. see example: https://github.com/aws/aws-sdk-js-v3/blob/main/UPGRADING.md?plain=1#L573-L576
    // note we don't use 'instanceof Unit8Array' because observations show this won't always return true, even though
    // the `transformToString` function will be available. (for example S3::GetObject)
    const text = await (v as any).transformToString();
    return tryJsonParse(text);
  }
  return tryJsonParse(v);

}

function tryJsonParse(v: any) {
  if (typeof(v) !== 'string') {
    return v;
  }
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

export async function coerceResponse(response: any) {

  if (response == null) {
    return;
  }

  for (const key of Object.keys(response)) {
    response[key] = await coerceValue(response[key]);
    if (typeof response[key] === 'object') {
      await coerceResponse(response[key]);
    }
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

