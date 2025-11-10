import * as path from 'node:path';
import { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';

export interface IWriter {
  write(module: Module, filePath: string): string;
}

export class TsFileWriter implements IWriter {
  public outputFiles = new Array<string>();

  constructor(
    private readonly rootDir: string,
    private readonly renderer: TypeScriptRenderer,
  ) {}

  public write(module: Module, filePath: string): string {
    const fullPath = path.join(this.rootDir, filePath);
    fs.outputFileSync(fullPath, this.renderer.render(module));
    this.outputFiles.push(fullPath);
    return fullPath;
  }
}
