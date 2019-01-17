import { Fn } from '../cloudformation/fn';
import { ImportOptions, ResolveType, Stack } from '../cloudformation/stack';
import { Construct } from '../core/construct';
import { unresolved } from '../core/tokens';
import { DeserializationOptions, IDeserializationContext, ISerializable, ISerializationContext, SerializationOptions } from './serialization';

const LIST_SEP = '||';

export class ExportSerializationContext implements ISerializationContext {
  constructor(
    private readonly stack: Stack,
    private readonly exportName: string,
    private readonly options: SerializationOptions = { }) {
  }

  public writeString(key: string, value: string, options: SerializationOptions = { }): void {
    let description = this.options.description;
    if (options.description) {
      if (!description) {
        description = options.description;
      } else {
        description += ' - ' + options.description;
      }
    }
    this.stack.exportString(this.exportNameForKey(key), value, { description });
  }

  public writeStringList(key: string, list: string[], options?: SerializationOptions): void {
    // we use Fn.join instead of Array.join in case "list" is a token.
    const value = Fn.join(LIST_SEP, list);
    this.writeString(key, value, options);
  }

  public writeObject(key: string, obj: ISerializable, options?: SerializationOptions): void {
    const ctx = new ExportSerializationContext(this.stack, this.exportNameForKey(key), options);
    obj.serialize(ctx);
  }

  private exportNameForKey(key: string) {
    return `${this.exportName}-${key}`;
  }
}

export class ImportDeserializationContext implements IDeserializationContext {
  private resolve: ResolveType;
  private weak: boolean;

  constructor(
      private readonly stack: Stack,
      private readonly exportName: string,
      private readonly importOptions: ImportOptions = { }) {

    this.resolve = importOptions.resolve === undefined ? ResolveType.Synthesis : importOptions.resolve;
    this.weak = importOptions.weak === undefined ? false : importOptions.weak;

    if (this.resolve === ResolveType.Deployment && this.weak) {
      throw new Error(`Deployment-time import resolution cannot be "weak"`);
    }
  }

  public get scope() {
    const exists = this.stack.node.tryFindChild('Imports') as Construct;
    if (exists) {
      return exists;
    }

    return new Construct(this.stack, 'Imports');
  }

  public get id() {
    return this.exportName;
  }

  public readString(key: string, options: DeserializationOptions = { }): string {
    const allowUnresolved = options.allowUnresolved === undefined ? true : false;
    const exportName = this.exportNameForKey(key);
    const value = this.stack.importString(exportName, this.importOptions);

    if (!allowUnresolved && unresolved(value)) {
      throw new Error(`Imported value for export "${exportName}" is an unresolved token and "allowUnresolved" is false`);
    }

    return value;
  }

  public readStringList(key: string, options: DeserializationOptions = { }): string[] {
    if (this.resolve === ResolveType.Deployment) {
      throw new Error(`Cannot deserialize a string list for export "${this.exportName}-${key}" using deploy-time resolution`);
    }

    // we are overriding "allowUnresolved" to "false" because we can't split an unresolved list.
    return this.readString(key, { ...options, allowUnresolved: false }).split(LIST_SEP);
  }

  public readObject(key: string): IDeserializationContext {
    return new ImportDeserializationContext(this.stack, this.exportNameForKey(key), this.importOptions);
  }

  private exportNameForKey(key: string) {
    return `${this.exportName}-${key}`;
  }
}