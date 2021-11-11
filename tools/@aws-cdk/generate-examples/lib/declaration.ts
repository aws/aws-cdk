import * as reflect from 'jsii-reflect';

import { module } from './module-utils';

export abstract class Declaration {
  constructor(public readonly sortKey: Array<number | string>) {}

  public abstract equals(rhs: Declaration): boolean;
  public abstract render(): string;
}

/**
 * An Import statement that will get rendered at the top of the code snippet.
 */
export class Import extends Declaration {
  public readonly importName: string;
  public readonly moduleName: string;
  public readonly type: reflect.Type;

  public constructor(type: reflect.Type) {
    const { importName, moduleName } = module(type);

    super([0, moduleName]);

    this.importName = importName;
    this.moduleName = moduleName;
    this.type = type;
  }

  public equals(rhs: Declaration): boolean {
    return this.render() === rhs.render();
  }

  public render(): string {
    return `import * as ${this.importName} from '${this.moduleName}';`;
  }
}

/**
 * A declared constant that will be rendered at the top of the code snippet after the imports.
 */
export class Assumption extends Declaration {
  public constructor(private readonly type: reflect.Type, private readonly name: string) {
    super([1, name]);
  }

  public equals(rhs: Declaration): boolean {
    return this.render() === rhs.render();
  }

  public render(): string {
    return `declare const ${this.name}: ${module(this.type).importName}.${this.type.name};`;
  }
}

/**
 * An assumption for an 'any' time. This will be treated the same as 'Assumption' but with a
 * different render result.
 */
export class AnyAssumption extends Declaration {
  public constructor(private readonly name: string) {
    super([1, name]);
  }

  public equals(rhs: Declaration): boolean {
    return this.render() === rhs.render();
  }

  public render(): string {
    return `declare const ${this.name}: any;`;
  }
}