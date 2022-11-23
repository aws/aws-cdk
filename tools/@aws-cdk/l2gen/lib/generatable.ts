import { CM2 } from './cm2';

export interface IGeneratable {

  generateFiles(): CM2[];
}

export function fileFor(typeName: string) {
  return `lib/gen/${typeName.toLowerCase()}.generated.ts`;
}
