import { Construct } from 'constructs';
import { CfnKeyPair } from './ec2.generated';
import { OperatingSystemType } from './machine-image';
import { StringParameter, IStringParameter } from '../../aws-ssm';
import { Resource, ResourceProps, Names, Lazy, IResource } from '../../core';

/**
 * The format of the Key Pair
 */
export enum KeyPairFormat {
  /**
   * A PPK file, typically used with PuTTY.
   */
  PPK = 'ppk',

  /**
   * A PEM file.
   */
  PEM = 'pem',
}

/**
 * The type of the key pair.
 */
export enum KeyPairType {
  /**
   * An RSA key.
   */
  RSA = 'rsa',

  /**
   * An ED25519 key.
   *
   * Note that ED25519 keys are not supported for Windows instances.
   */
  ED25519 = 'ed25519',
}

/**
 * The properties of a Key Pair
 */
export interface KeyPairProps extends ResourceProps {
  /**
   * A unique name for the key pair.
   *
   * @default A generated name
   */
  readonly keyPairName?: string;

  /**
   * The format of the key pair.
   *
   * @default PEM
   */
  readonly format?: KeyPairFormat;

  /**
   * The type of key pair.
   *
   * @default RSA (ignored if keyMaterial is provided)
   */
  readonly type?: KeyPairType;

  /**
   * The public key material.
   *
   * If this is provided the key is considered "imported". For imported
   * keys, it is assumed that you already have the private key material
   * so the private key material will not be returned or stored in
   * AWS Systems Manager Parameter Store.
   *
   * @default a public and private key will be generated
   */
  readonly publicKeyMaterial?: string;
}

/**
 * Attributes of a Key Pair.
 */
export interface KeyPairAttributes {
  /**
   * The unique name of the key pair.
   */
  readonly keyPairName: string;

  /**
   * The type of the key pair.
   *
   * @default no type specified
   */
  readonly type?: KeyPairType;
}

/**
 * An EC2 Key Pair.
 */
export interface IKeyPair extends IResource {
  /**
   * The name of the key pair.
   *
   * @attribute
   */
  readonly keyPairName: string;

  /**
   * The type of the key pair.
   */
  readonly type?: KeyPairType;

  /**
   * Used internally to determine whether the key pair is compatible with an OS type.
   *
   * @internal
   */
  _isOsCompatible(osType: OperatingSystemType): boolean;
}

/**
 * An EC2 Key Pair.
 *
 * @resource AWS::EC2::KeyPair
 */
export class KeyPair extends Resource implements IKeyPair {
  /**
   * Imports a key pair based on the name.
   */
  public static fromKeyPairName(scope: Construct, id: string, keyPairName: string): IKeyPair {
    return KeyPair.fromKeyPairAttributes(scope, id, { keyPairName });
  }

  /**
   * Imports a key pair with a name and optional type.
   */
  public static fromKeyPairAttributes(scope: Construct, id: string, attrs: KeyPairAttributes): IKeyPair {
    class Import extends Resource implements IKeyPair {
      public readonly keyPairName: string;
      public readonly type?: KeyPairType;

      constructor() {
        super(scope, id);
        this.keyPairName = attrs.keyPairName;
        this.type = attrs.type;
      }

      /**
       * Used internally to determine whether the key pair is compatible with an OS type.
       *
       * @internal
       */
      public _isOsCompatible(osType: OperatingSystemType): boolean {
        switch (this.type) {
          case KeyPairType.ED25519:
            return osType !== OperatingSystemType.WINDOWS;
          case KeyPairType.RSA:
            return true;
          default:
            return true;
        }
      }
    }
    return new Import();
  }

  /**
   * The unique name of the key pair.
   *
   * @attribute
   */
  public readonly keyPairName: string;

  /**
   * The fingerprint of the key pair.
   *
   * @attribute
   */
  public readonly keyPairFingerprint: string;

  /**
   * The unique ID of the key pair.
   *
   * @attribute
   */
  public readonly keyPairId: string;

  /**
   * The type of the key pair.
   */
  public readonly type?: KeyPairType;

  /**
   * The format of the key pair.
   */
  public readonly format: KeyPairFormat;

  private _privateKeySsm?: IStringParameter;
  private readonly _isImport: boolean;

  constructor(scope: Construct, id: string, props?: KeyPairProps) {
    super(scope, id, {
      ...props,
      physicalName: props?.keyPairName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 255 }),
      }),
    });

    if (props?.publicKeyMaterial && props?.type) {
      throw new Error('Cannot specify \'type\' for keys with imported material');
    }

    this._isImport = !!props?.publicKeyMaterial;

    const keyType = props?.type ?? KeyPairType.RSA;
    const keyFormat = props?.format ?? KeyPairFormat.PEM;

    const cfnResource = new CfnKeyPair(this, 'Resource', {
      keyName: this.physicalName,
      keyType: props?.type ?? KeyPairType.RSA,
      keyFormat: props?.format ?? KeyPairFormat.PEM,
      publicKeyMaterial: props?.publicKeyMaterial,
    });

    this.keyPairName = cfnResource.ref;
    this.keyPairFingerprint = cfnResource.attrKeyFingerprint;
    this.keyPairId = cfnResource.attrKeyPairId;
    this.type = keyType;
    this.format = keyFormat;
  }

  /**
   * Whether the key material was imported.
   *
   * Keys with imported material do not have their private key material stored
   * or returned automatically.
   */
  public get hasImportedMaterial(): boolean {
    return this._isImport;
  }

  /**
   * The Systems Manager Parameter Store parameter with the pair's private key material.
   */
  public get privateKey(): IStringParameter {
    if (this._isImport) {
      throw new Error('An SSM parameter with private key material is not created for imported keys');
    }
    if (!this._privateKeySsm) {
      // This parameter is created by the underlying CloudFormation resource with a defined
      // naming structure. The resource does not return a reference to it directly so it must
      // be imported.
      this._privateKeySsm = StringParameter.fromSecureStringParameterAttributes(this, 'PrivateKeyParameter', {
        parameterName: `/ec2/keypair/${this.keyPairId}`,
        simpleName: false,
      });
    }
    return this._privateKeySsm;
  }

  /**
   * Used internally to determine whether the key pair is compatible with an OS type.
   *
   * @internal
   */
  public _isOsCompatible(osType: OperatingSystemType): boolean {
    switch (this.type) {
      case KeyPairType.ED25519:
        return osType !== OperatingSystemType.WINDOWS;
      case KeyPairType.RSA:
        return true;
      default:
        return true;
    }
  }
}
