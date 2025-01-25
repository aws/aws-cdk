import { Settings } from './settings';
import { ToolkitError } from '../toolkit/error';

export { TRANSIENT_CONTEXT_KEY } from './settings';
export const PROJECT_CONTEXT = 'cdk.context.json';

interface ContextBag {
  /**
   * The file name of the context. Will be used to potentially
   * save new context back to the original file.
   */
  fileName?: string;

  /**
   * The context values.
   */
  bag: Settings;
}

/**
 * Class that supports overlaying property bags
 *
 * Reads come from the first property bag that can has the given key,
 * writes go to the first property bag that is not readonly. A write
 * will remove the value from all property bags after the first
 * writable one.
 */
export class Context {
  private readonly bags: Settings[];
  private readonly fileNames: (string | undefined)[];

  constructor(...bags: ContextBag[]) {
    this.bags = bags.length > 0 ? bags.map((b) => b.bag) : [new Settings()];
    this.fileNames =
      bags.length > 0 ? bags.map((b) => b.fileName) : ['default'];
  }

  public get keys(): string[] {
    return Object.keys(this.all);
  }

  public has(key: string) {
    return this.keys.indexOf(key) > -1;
  }

  public get all(): { [key: string]: any } {
    let ret = new Settings();

    // In reverse order so keys to the left overwrite keys to the right of them
    for (const bag of [...this.bags].reverse()) {
      ret = ret.merge(bag);
    }

    return ret.all;
  }

  public get(key: string): any {
    for (const bag of this.bags) {
      const v = bag.get([key]);
      if (v !== undefined) {
        return v;
      }
    }
    return undefined;
  }

  public set(key: string, value: any) {
    for (const bag of this.bags) {
      if (bag.readOnly) {
        continue;
      }

      // All bags past the first one have the value erased
      bag.set([key], value);
      value = undefined;
    }
  }

  public unset(key: string) {
    this.set(key, undefined);
  }

  public clear() {
    for (const key of this.keys) {
      this.unset(key);
    }
  }

  /**
   * Save a specific context file
   */
  public async save(fileName: string): Promise<this> {
    const index = this.fileNames.indexOf(fileName);

    // File not found, don't do anything in this scenario
    if (index === -1) {
      return this;
    }

    const bag = this.bags[index];
    if (bag.readOnly) {
      throw new ToolkitError(`Context file ${fileName} is read only!`);
    }

    await bag.save(fileName);
    return this;
  }
}
