import type { Module, TypeScriptRenderer } from '@cdklabs/typewriter';
import * as fs from 'fs-extra';
import * as log from './log';

export interface IWriter {
  write(module: Module, filePath: string): string;
}

export class TsFileWriter implements IWriter {
  public outputFiles = new Array<string>();

  constructor(private readonly renderer: TypeScriptRenderer) {}

  public write(module: Module, fullPath: string): string {
    log.debug(module.name, fullPath, 'render');
    fs.outputFileSync(fullPath, this.renderer.render(module));
    this.outputFiles.push(fullPath);
    return fullPath;
  }
}
