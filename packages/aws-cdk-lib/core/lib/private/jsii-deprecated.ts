export function quiet(): string | undefined {
  const deprecated = process.env.JSII_DEPRECATED;
  process.env.JSII_DEPRECATED = 'quiet';
  return deprecated;
}

export function reset(deprecated: string | undefined) {
  if (deprecated === undefined) {
    delete process.env.JSII_DEPRECATED;
  } else {
    process.env.JSII_DEPRECATED = deprecated;
  }
}