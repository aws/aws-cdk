import { Construct } from '../core/construct';

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
  scope: Construct;
  id: string;

  /**
   * Deserializes a string value which was serizlized under the specified key.
   * @param key The key
   * @param options Deserialization options
   */
  readString(key: string, options?: DeserializationOptions): string;

  /**
   * Deserializes a string array which was serizlied under the specified key.
   * @param key The key
   * @param options  Deserialization options
   */
  readStringList(key: string, options?: DeserializationOptions): string[];

  /**
   * Returns a deserialization context for a sub-object which was serizlized
   * under the specified key.
   *
   * You will normally pass this to a `SubObject.deserializeSubObject(dctx)`
   *
   * @param key The key
   */
  readObject(key: string): IDeserializationContext;
}

/**
 * Options for serialization.
 */
export interface SerializationOptions {
  /**
   * Description of this serialization node.
   */
  description?: string;
}

/**
 * Options for deserialization.
 */
export interface DeserializationOptions {
  /**
   * Allows this specific value to include unresolved tokens, such as
   * deploy-time imports. For `readString` this is `true` by default, but can be
   * set to `false` by users to force synth-time resolution. For
   * `readStringList` this cannot be `true`. String lists must always be
   * resolved during synthesis.
   */
  allowUnresolved?: boolean;
}