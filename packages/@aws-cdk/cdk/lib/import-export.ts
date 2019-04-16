import { Fn } from './fn';
import { IDeserializationContext, ISerializable, ISerializationContext, SerializationOptions } from './serialization';
import { ImportOptions, Stack } from './stack';

const LIST_SEP = '||';

/**
 * An `ISerializationContext` which uses CloudFormation outputs with exports.
 *
 * @internal
 */
export class ExportSerializationContext implements ISerializationContext {
  constructor(
    private readonly stack: Stack,
    private readonly baseExportName: string,
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

    this.stack.exportString(exportNameForKey(this.baseExportName, key), value, { description });
  }

  public writeStringList(key: string, list: string[], options?: SerializationOptions): void {
    // we use Fn.join instead of Array.join in case "list" is a token.
    const value = Fn.join(LIST_SEP, list);
    this.writeString(key, value, options);
  }

  public writeObject(key: string, obj: ISerializable, options?: SerializationOptions): void {
    this.stack.exportObject(key, obj, options);
  }
}

/**
 * A deserialization context that imports values from CloudFormation outputs
 * with exports.
 *
 * Supports both synthesis-time resolution through environental context and
 * deploy-time resolution through `Fn::ImportValue`.
 */
export class ImportDeserializationContext implements IDeserializationContext {
  constructor(
      private readonly stack: Stack,
      private readonly baseExportName: string,
      private readonly importOptions: ImportOptions = { }) {
  }

  public get scope() {
    return this.stack.node.getCreateScope('Imports01C26370FC03');
  }

  public get id() {
    return this.baseExportName;
  }

  public readString(key: string): string {
    const v = this.readOptionalString(key);
    if (!v) {
      throw new Error(`Unable to import value ${key}`);
    }

    return v;
  }

  public readOptionalString(key: string): string | undefined {
    return this.stack.importString(exportNameForKey(this.baseExportName, key), this.importOptions);
  }

  public readStringList(key: string): string[] {
    const v = this.readOptionalStringList(key);
    if (!v) {
      throw new Error(`Unable to read optional string list from ${key}`);
    }
    return v;
  }

  public readOptionalStringList(key: string): string[] | undefined {
    const v = this.readOptionalString(key);
    if (!v) {
      return undefined;
    }

    return v.split(LIST_SEP);
  }

  public readObject(key: string): IDeserializationContext {
    const v = this.stack.importObject(key, this.importOptions);
    if (!v) {
      throw new Error(`Unable to read an object from ${key}`);
    }
    return v;
  }

  public readOptionalObject(key: string): IDeserializationContext | undefined {
    return this.stack.importObject(key, this.importOptions);
  }
}

function exportNameForKey(base: string, key: string) {
  return `${base}-${key}`;
}
