import { CM2 } from './cm2';
import { Diagnostic } from './diagnostic';

export interface IGeneratable {
  generateFiles(): CM2[];
  diagnostics(): Diagnostic[];
}

export function fileFor(typeName: string) {
  return `lib/gen/${typeName.toLowerCase()}.generated.ts`;
}
