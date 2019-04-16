import { Construct } from './construct';

/**
 * Objects that implement this interface can serialize themselves through a
 * key/value store.
 */
export interface ISerializable {
  /**
   * Called by as specific serializer (e.g. `stack.exportObject`) in order to
   * serialize an object.
   * @param ctx The serialization context for this object.
   */
  serialize(ctx: ISerializationContext): void;
}

/**
 * The context for serialization. Serializable objects will use this to serialize themselves.
 */
export interface ISerializationContext {
  /**
   * Serialize a string value under the specified key.
   * @param key The key under which to store the value
   * @param value The string value to store
   * @param options Serialization options.
   */
  writeString(key: string, value: string, options?: SerializationOptions): void;

  /**
   * Serialize a string array under the specified key.
   * @param key
   * @param value The array to serialize.
   * @param options Serialization options.
   */
  writeStringList(key: string, value: string[], options?: SerializationOptions): void;

  /**
   * Serializes a serializable sub-object under the specified key.
   * @param key The key under which to store the object.
   * @param obj The object to store.
   * @param options Serialization options.
   */
  writeObject(key: string, obj: ISerializable, options?: SerializationOptions): void;
}

/**
 * Passed to `deserializeXxx` static methods in order to deserizlize an object.
 * This context is bound to a specific object.s
 */
export interface IDeserializationContext {
  /**
   * The scope in which new constructs should be defined.
   */
  scope: Construct;

  /**
   * The ID of any new construct.
   */
  id: string;

  /**
   * Deserializes a string value which was serizlized under the specified key.
   * @param key The key
   * @param options Deserialization options
   */
  readString(key: string): string;

  /**
   * Reads a string that may also be undefined.
   *
   * This requires that the value will be fully resolved and resolution done at synth-time
   * (versus deploy-time).
   *
   * @param key The key of the string to read
   */
  readOptionalString(key: string): string | undefined;

  /**
   * Deserializes a string array which was serizlied under the specified key.
   *
   * This requires that the value will be fully resolved and resolution done at synth-time
   * (versus deploy-time).
   *
   * @param key The key of the string list to read.
   */
  readStringList(key: string): string[];

  /**
   * Reads a string list, which can potentially be undefined.
   *
   * This requires that the value will be fully resolved and resolution done at synth-time
   * (versus deploy-time).
   *
   * @param key The key
   */
  readOptionalStringList(key: string): string[] | undefined;

  /**
   * Returns a deserialization context for a sub-object which was serizlized
   * under the specified key.
   *
   * You will normally pass this to a `SubObject.deserializeSubObject(dctx)`
   *
   * @param key The key
   */
  readObject(key: string): IDeserializationContext;

  /**
   * Returns a deserialization context bound to a sub-object.
   *
   * You will normally pass this to a `SubObject.deserializeSubObject(dctx)`
   *
   * @param key The key
   */
  readOptionalObject(key: string): IDeserializationContext | undefined;
}

/**
 * Options for serialization.
 */
export interface SerializationOptions {
  /**
   * Description of this serialization node.
   */
  readonly description?: string;
}
