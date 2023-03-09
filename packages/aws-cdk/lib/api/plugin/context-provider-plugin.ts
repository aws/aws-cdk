export interface ContextProviderPlugin {
  getValue(args: {[key: string]: any}): Promise<any>;
}

export function isContextProviderPlugin(x: unknown): x is ContextProviderPlugin {
  return typeof x === 'object' && !!x && !!(x as any).getValue;
}
