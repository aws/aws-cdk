export interface ContextProviderPlugin {
  getValue(args: {[key: string]: any}): Promise<any>;
}
