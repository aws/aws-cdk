import { CM2 } from './cm2';
import { Diagnostic } from './diagnostic';

export interface IGeneratable {
  readonly schemaRefs?: string[];
  generateFiles(): CM2[];
  diagnostics(): Diagnostic[];
}

export function fileFor(typeName: string, visibility: 'public' | 'private') {
  return `lib/gen/${visibility === 'private' ? 'private/' : ''}${typeName.toLowerCase()}.generated.ts`;
}
