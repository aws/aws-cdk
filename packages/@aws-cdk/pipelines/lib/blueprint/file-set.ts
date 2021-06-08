import { Step } from './step';

export class FileSet {
  public readonly primaryOutput?: FileSet = this;
  private _producer?: Step;

  constructor(public readonly id: string, producer?: Step) {
    this._producer = producer;
  }

  public get producer() {
    if (!this._producer) {
      throw new Error(`FileSet '${this.id}' doesn\'t have a producer; call 'fileSet.producedBy()'`);
    }
    return this._producer;
  }

  public producedBy(producer?: Step) {
    if (this._producer) {
      throw new Error(`FileSet '${this.id}' already has a producer (${this._producer}) while setting producer: ${producer}`);
    }
    this._producer = producer;
  }

  public toString() {
    return `FileSet(${this.id})`;
  }
}

export interface IFileSet {
  readonly primaryOutput?: FileSet;
}