import * as path from 'path';
import { CM2 } from './cm2';

export interface ISourceModule {
  readonly identifier: string;
  importName(code: CM2): string;
  equals(rhs: ISourceModule): boolean;
}

export class SourceFile implements ISourceModule {
  public readonly identifier: string;

  constructor(public readonly fileName: string) {
    this.identifier = fileName;
  }

  public importName(code: CM2): string {
    const relativePath = path.posix.relative(path.dirname(code.currentModule.fileName), this.fileName).replace(/\.ts$/, '');
    return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
  }

  public equals(rhs: ISourceModule): boolean {
    return rhs instanceof SourceFile && this.fileName === rhs.fileName;
  }
}

export class InstalledModule implements ISourceModule {
  public readonly identifier: string;

  constructor(public readonly moduleName: string) {
    this.identifier = moduleName;
  }

  public importName(): string {
    return this.moduleName;
  }

  public equals(rhs: ISourceModule): boolean {
    return rhs instanceof InstalledModule && this.moduleName === rhs.moduleName;
  }
}