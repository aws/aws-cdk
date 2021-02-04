import * as fs from 'fs';
import { IResource, Names, Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnPublicKey } from './cloudfront.generated';

/**
 * Represents a Public Key
 */
export interface IPublicKey extends IResource {
  /**
   * The ID of the key group.
   * @attribute
   */
  readonly publicKeyId: string;
}

/**
 * Properties for creating a Public Key
 */
export interface PublicKeyProps {
  /**
   * A name to identify the public key.
   * @default - generated from the `id`
   */
  readonly publicKeyName?: string;

  /**
   * A comment to describe the public key.
   * @default - no comment
   */
  readonly comment?: string;

  /**
   * The public key that you can use with signed URLs and signed cookies, or with field-level encryption.
   * The `encodedKey` parameter can be either an inline key or from filesystem. If it's inline it must include
   * `-----BEGIN PUBLIC KEY-----` and `-----END PUBLIC KEY-----` lines.
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/field-level-encryption.html
   */
  readonly encodedKey: Key;
}

/**
 * A Public Key Configuration
 *
 * @resource AWS::CloudFront::PublicKey
 */
export class PublicKey extends Resource implements IPublicKey {

  /** Imports a Public Key from its id. */
  public static fromPublicKeyId(scope: Construct, id: string, publicKeyId: string): IPublicKey {
    return new class extends Resource implements IPublicKey {
      public readonly publicKeyId = publicKeyId;
    }(scope, id);
  }

  public readonly publicKeyId: string;

  constructor(scope: Construct, id: string, props: PublicKeyProps) {
    super(scope, id);

    const encodedKey = props.encodedKey.bind(this);

    const resource = new CfnPublicKey(this, 'Resource', {
      publicKeyConfig: {
        name: props.publicKeyName ?? this.generateName(),
        callerReference: this.node.addr,
        encodedKey: encodedKey.value,
        comment: props.comment,
      },
    });

    this.publicKeyId = resource.ref;
  }

  private generateName(): string {
    const name = Names.uniqueId(this);
    if (name.length > 80) {
      return name.substring(0, 40) + name.substring(name.length - 40);
    }
    return name;
  }
}

/**
 * Represents the Public Key handler.
 */
export abstract class Key {
  /**
   * Inline value for Public Key
   * @returns contents of an inline public key.
   * @param key Inline public key
   */
  public static fromInline(key: string): InlineKey {
    return new InlineKey(key);
  }

  /**
   * Loads the public key from a local disk path.
   * @returns contents of a .pem key.
   * @param path Path to a .pem file
   */
  public static fromFile(path: string/*, options: {}*/): FileKey {
    return new FileKey(path/*,options*/);
  }

  /**
   * Called when the public key is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   * assume it's initialized. You may just use it as a construct scope.
   */
  public abstract bind(scope: Construct): KeyConfig;
}

/**
 * Result of binding `Key` into a `PublicKey`.
 */
export interface KeyConfig {
  /**
   * Public Key value.
   * @default - contents of a public key
   */
  readonly value: string;
}

/**
 * Public Key from an inline string.
 */
export class InlineKey extends Key {
  constructor(private key: string) {
    super();

    if (key.length === 0) {
      throw new Error('Encoded key inline value cannot be empty');
    }

    if (key.length > 4096) {
      throw new Error('Encoded key inline value is too large, must be <= 4096 but is ' + key.length);
    }

    if (!Token.isUnresolved(key) && !/^-----BEGIN PUBLIC KEY-----/.test(key)) {
      throw new Error(`Public key must be in PEM format (with the BEGIN/END PUBLIC KEY lines); got ${key}`);
    }
  }

  public bind(_scope: Construct): KeyConfig {
    return {
      value: this.key,
    };
  }

  /**
   * Content of a public key.
   */
  public content(): string {
    return this.key;
  }
}

/**
 * Public key from a local directory.
 */
export class FileKey extends Key {
  private readonly key: string;
  /**
   * @param path The path to the asset file or directory.
   */
  constructor(public readonly path: string) {
    super();

    const encodedKey = fs.readFileSync(path).toString();
    if (!encodedKey) {
      throw new Error('Something went wrong with loading the public key.');
    }
    this.key = new InlineKey(encodedKey).content();
  }

  public bind(_scope: Construct): KeyConfig {
    return {
      value: this.key,
    };
  }
}
