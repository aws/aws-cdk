import { Construct, IConstruct, IDeserializationContext, ISerializable, ISerializationContext } from '../lib';

interface UnicornProps {
  readonly name: string;
  readonly colors?: string[];
  readonly friend?: IUnicorn;
}

interface IUnicorn extends ISerializable, IConstruct {
  readonly name: string;
  readonly colors?: string[];
  readonly friend?: IUnicorn;
}

abstract class UnicornBase extends Construct implements IUnicorn {
  public abstract readonly name: string;
  public abstract readonly colors?: string[];
  public abstract readonly friend?: IUnicorn;

  public serialize(ctx: ISerializationContext) {
    ctx.writeString('name', this.name);

    if (this.colors) {
      ctx.writeStringList('colors', this.colors);
    }

    if (this.friend) {
      ctx.writeObject('friend', this.friend);
    }
  }
}

/**
 * Example of a serializable construct pattern.
 */
export class Unicorn extends UnicornBase {
  public static deserialize(ctx: IDeserializationContext): IUnicorn {
    class DeserUnicorn extends UnicornBase {
      get name() { return ctx.readString('name'); }
      get colors() { return ctx.readStringList('colors'); }
      get friend() { return Unicorn.deserialize(ctx.readObject('friend')); }
    }

    return new DeserUnicorn(ctx.scope, ctx.id);
  }

  public readonly name: string;
  public readonly colors?: string[];
  public readonly friend?: IUnicorn;

  constructor(scope: Construct, id: string, props: UnicornProps) {
    super(scope, id);

    this.name = props.name;
    this.colors = props.colors;
    this.friend = props.friend;
  }
}