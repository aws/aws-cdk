import type { Bitrate } from 'aws-cdk-lib';
import { Aws, Token, UnscopedValidationError } from 'aws-cdk-lib';
import type { ISecurityGroup, ISubnet } from 'aws-cdk-lib/aws-ec2';
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import type { IRole } from 'aws-cdk-lib/aws-iam';
import type { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Construct } from 'constructs';

/**
 * Encryption Algorithms used in AWS Elemental MediaConnect
 */
export class EncryptionAlgorithm {
  /**
   * Option for AES128
   */
  public static readonly AES128 = new EncryptionAlgorithm('aes128');
  /**
   * Option for AES192
   */
  public static readonly AES192 = new EncryptionAlgorithm('aes192');
  /**
   * Option for AES256
   */
  public static readonly AES256 = new EncryptionAlgorithm('aes256');

  /**
   * Use a custom encryption algorithm value
   * @param value The encryption algorithm string value
   */
  public static of(value: string): EncryptionAlgorithm {
    return new EncryptionAlgorithm(value);
  }

  /**
   * @param value The encryption algorithm string value
   */
  private constructor(public readonly value: string) {}

  /** Returns the string value */
  public toString(): string {
    return this.value;
  }
}

/**
 * Key types used across AWS Elemental MediaConnect
 */
export class KeyType {
  /**
   * Option for Static Key
   */
  public static readonly STATIC_KEY = new KeyType('static-key');
  /**
   * Option for SRT Password
   */
  public static readonly SRT_PASSWORD = new KeyType('srt-password');

  /**
   * Use a custom key type value
   * @param value The key type string value
   */
  public static of(value: string): KeyType {
    return new KeyType(value);
  }

  /**
   * @param value The key type string value
   */
  private constructor(public readonly value: string) {}

  /** Returns the string value */
  public toString(): string {
    return this.value;
  }
}

/**
 * State configuration used across AWS Elemental MediaConnect
 */
export enum State {
  /**
   * Option for Enabled
   */
  ENABLED='ENABLED',
  /**
   * Option for Disabled
   */
  DISABLED='DISABLED',
}

/**
 * Days of the week for scheduled maintenance windows.
 *
 * Used by both Flow and Router maintenance configurations.
 */
export enum MaintenanceDay {
  /** Monday */
  MONDAY='MONDAY',
  /** Tuesday */
  TUESDAY='TUESDAY',
  /** Wednesday */
  WEDNESDAY='WEDNESDAY',
  /** Thursday */
  THURSDAY='THURSDAY',
  /** Friday */
  FRIDAY='FRIDAY',
  /** Saturday */
  SATURDAY='SATURDAY',
  /** Sunday */
  SUNDAY='SUNDAY',
}

/**
 * Options for bridge network source and output protocols.
 */
export class BridgeProtocol {
  /**
   * Option for RTP-FEC
   */
  public static readonly RTP_FEC = new BridgeProtocol('rtp-fec');
  /**
   * Option for RTP
   */
  public static readonly RTP = new BridgeProtocol('rtp');
  /**
   * Option for UDP
   */
  public static readonly UDP = new BridgeProtocol('udp');

  /**
   * Use a custom bridge protocol value
   * @param value The bridge protocol string value
   */
  public static of(value: string): BridgeProtocol {
    return new BridgeProtocol(value);
  }

  /**
   * @param value The bridge protocol string value
   */
  private constructor(public readonly value: string) {}

  /** Returns the string value */
  public toString(): string {
    return this.value;
  }
}

/**
 * Properties for defining a Gateway network.
 */
export interface GatewayNetworkDefineProps {
  /**
   * The name of the network. Used to reference this network from bridge sources
   * and outputs, and must be unique among the networks on the gateway.
   *
   * Maximum 64 characters; alphanumeric, hyphens, and underscores only.
   */
  readonly name: string;
  /**
   * A unique IP address range to use for this network. Must be in CIDR notation
   * (for example, `10.0.0.0/16`).
   */
  readonly cidrBlock: string;
}

/**
 * A network on a MediaConnect Gateway.
 *
 * Use {@link GatewayNetwork.define} to create a network and reference it from
 * gateway, bridge source, and bridge output configurations.
 *
 * @example
 *
 *    const productionNetwork = GatewayNetwork.define({
 *      name: 'production',
 *      cidrBlock: '10.0.0.0/16',
 *    });
 */
export class GatewayNetwork {
  /**
   * Define a new gateway network.
   *
   * @param props network properties
   */
  public static define(props: GatewayNetworkDefineProps): GatewayNetwork {
    if (!Token.isUnresolved(props.name)) {
      if (props.name.length < 1 || props.name.length > 64) {
        throw new UnscopedValidationError(
          lit`GatewayNetworkNameLength`,
          `Gateway network name must be between 1 and 64 characters, got ${props.name.length}`,
        );
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(props.name)) {
        throw new UnscopedValidationError(
          lit`GatewayNetworkNameFormat`,
          `Gateway network name must contain only alphanumeric characters, hyphens, and underscores, got '${props.name}'`,
        );
      }
    }

    return new GatewayNetwork(props.name, props.cidrBlock);
  }

  /**
   * The name of the network.
   */
  public readonly name: string;

  /**
   * A unique IP address range to use for this network in CIDR notation.
   */
  public readonly cidrBlock: string;

  private constructor(name: string, cidrBlock: string) {
    this.name = name;
    this.cidrBlock = cidrBlock;
  }
}

/**
 * Bridge network source options
 */
export interface BridgeNetworkSource {
  /**
   * The network source multicast IP.
   *
   * Must be a valid Multicast IP address.
   */
  readonly multicastIp: string;
  /**
   * The setting related to the multicast source.
   *
   * The IP address of the source for source-specific multicast (SSM).
   *
   * @default - no multicast source IP
   */
  readonly multicastSourceIp?: string;
  /**
   * The gateway network this source listens on.
   *
   * Use {@link GatewayNetwork.define} to create the network and pass the same
   * instance to the gateway and to each source that uses it.
   */
  readonly network: GatewayNetwork;
  /**
   * The network source port.
   */
  readonly port: number;
  /**
   * The network source protocol.
   */
  readonly protocol: BridgeProtocol;
}

/**
 * Failover Mode
 */
export class FailoverMode {
  /**
   * MERGE combines the source streams into a single stream, allowing graceful
   * recovery from any single-source loss.
   */
  public static readonly MERGE = new FailoverMode('MERGE');
  /**
   * FAILOVER allows switching between different streams.
   */
  public static readonly FAILOVER = new FailoverMode('FAILOVER');

  /**
   * Use a custom failover mode value
   * @param value The failover mode string value
   */
  public static of(value: string): FailoverMode {
    return new FailoverMode(value);
  }

  /**
   * @param value The failover mode string value
   */
  private constructor(public readonly value: string) {}

  /** Returns the string value */
  public toString(): string {
    return this.value;
  }
}
/**
 * Render tags for CloudFormation resources.
 *
 * @internal
 */
export function renderTags(tags: { [key: string]: string }): Array<{ key: string; value: string }> {
  return Object.entries(tags).map(([key, value]) => ({
    key,
    value,
  }));
}

/**
 * Convert an uppercase enum value to title case (e.g. 'MONDAY' → 'Monday').
 * Used at CFN boundaries where the API expects title-cased day names.
 *
 * @internal
 */
export function toTitleCase(day: MaintenanceDay): string {
  return day.charAt(0) + day.slice(1).toLowerCase();
}

/**
 * Validate a maintenance start hour string is in HH:00 format (24-hour, minutes must be 00).
 * @param time The time string to validate
 * @throws UnscopedValidationError if the format is invalid
 *
 * @internal
 */
export function validateMaintenanceTime(time: string): void {
  if (!/^([01]\d|2[0-3]):00$/.test(time)) {
    throw new UnscopedValidationError(
      lit`MaintenanceTimeFormat`,
      `Maintenance time must be in HH:00 format (24-hour, minutes must be 00), got '${time}'`,
    );
  }
}

/**
 * MediaLive pipeline options.
 */
export enum MediaLivePipeline {
  /** Pipeline 0 */
  PIPELINE_0 = 'PIPELINE_0',
  /** Pipeline 1 */
  PIPELINE_1 = 'PIPELINE_1',
}

/**
 * Network interface options
 */
export class NetworkInterface {
  /**
   * Option for ENA
   */
  public static readonly ENA = new NetworkInterface('ena');
  /**
   * Option for EFA.
   * For CDI ensure you use EFA.
   */
  public static readonly EFA = new NetworkInterface('efa');

  /**
   * Use a custom network interface value
   * @param value The network interface string value
   */
  public static of(value: string): NetworkInterface {
    return new NetworkInterface(value);
  }

  /**
   * @param value The network interface string value
   */
  private constructor(public readonly value: string) {}

  /** Returns the string value */
  public toString(): string {
    return this.value;
  }
}

/**
 * VPC Interface configuration
 */
export interface VpcInterfaceConfig {
  /**
   * Unique name for this VPC interface within the flow. Cannot be changed after creation.
   */
  readonly name: string;
  /**
   * IDs of the network interfaces. Set this when importing existing ENIs via
   * `VpcInterface.fromNetworkInterfaces()`; leave unset to have MediaConnect create them.
   *
   * @default - MediaConnect creates network interfaces automatically
   */
  readonly networkInterfaceIds?: string[];
  /**
   * The type of network interface. Use `EFA` for CDI workflows.
   *
   * @default NetworkInterface.ENA
   */
  readonly networkInterfaceType?: NetworkInterface;
  /**
   * IAM role that MediaConnect assumes to create ENIs in your account.
   */
  readonly role: IRole;
  /**
   * Security groups to apply to the ENI.
   */
  readonly securityGroups: ISecurityGroup[];
  /**
   * Subnet where the ENI is created. Must be in the same Availability Zone as the flow.
   */
  readonly subnet: ISubnet;
}

/**
 * Properties for defining a new VPC Interface configuration
 */
export interface VpcInterfaceDefineProps {
  /**
   * Unique name for this VPC interface within the flow. Cannot be changed after creation.
   */
  readonly vpcInterfaceName: string;
  /**
   * IAM role that MediaConnect assumes to create ENIs in your account.
   */
  readonly role: IRole;
  /**
   * Security groups to apply to the ENI.
   */
  readonly securityGroups: ISecurityGroup[];
  /**
   * Subnet where the ENI is created. Must be in the same Availability Zone as the flow.
   */
  readonly subnet: ISubnet;
  /**
   * The type of network interface. Use `EFA` for CDI workflows.
   *
   * @default NetworkInterface.ENA
   */
  readonly networkInterfaceType?: NetworkInterface;
}

/**
 * Properties for creating a VPC Interface from existing network interfaces
 */
export interface VpcInterfaceFromNetworkInterfacesProps {
  /**
   * Unique name for this VPC interface within the flow. Cannot be changed after creation.
   */
  readonly vpcInterfaceName: string;
  /**
   * IAM role that MediaConnect assumes to access the ENIs.
   */
  readonly role: IRole;
  /**
   * Security groups applied to the existing ENIs.
   */
  readonly securityGroups: ISecurityGroup[];
  /**
   * Subnet where the existing ENIs live. Must be in the same Availability Zone as the flow.
   */
  readonly subnet: ISubnet;
  /**
   * IDs of the pre-created network interfaces to reuse.
   */
  readonly networkInterfaceIds: string[];
}

/**
 * Factory class for creating VPC Interface configurations
 */
export class VpcInterface {
  /**
   * Define a new VPC Interface configuration. MediaConnect will create network interfaces automatically.
   *
   * @param props VPC Interface properties
   * @returns VpcInterfaceConfig configuration object
   */
  public static define(props: VpcInterfaceDefineProps): VpcInterfaceConfig {
    return {
      name: props.vpcInterfaceName,
      role: props.role,
      securityGroups: props.securityGroups,
      subnet: props.subnet,
      networkInterfaceType: props.networkInterfaceType,
    };
  }

  /**
   * Create a VPC Interface configuration using existing network interfaces.
   *
   * @param props VPC Interface properties with existing network interface IDs
   * @returns VpcInterfaceConfig configuration object
   */
  public static fromNetworkInterfaces(props: VpcInterfaceFromNetworkInterfacesProps): VpcInterfaceConfig {
    return {
      name: props.vpcInterfaceName,
      role: props.role,
      securityGroups: props.securityGroups,
      subnet: props.subnet,
      networkInterfaceIds: props.networkInterfaceIds,
    };
  }
}
/**
 * Static key encryption/decryption configuration for Zixi Push sources, Zixi Pull outputs,
 * and flow entitlements.
 *
 * If `role` is omitted, the consuming construct auto-creates a scoped IAM role with read
 * access to the provided {@link secret} (including `kms:Decrypt` if the secret uses a
 * customer-managed KMS key).
 */
export interface StaticKeyEncryption {
  /**
   * IAM role that MediaConnect assumes to access the Secrets Manager secret.
   *
   * @default - a scoped role is created automatically with read access to the provided secret
   */
  readonly role?: IRole;
  /**
   * Secrets Manager secret containing the static encryption key.
   */
  readonly secret: ISecret;
  /**
   * The encryption algorithm to use.
   */
  readonly algorithm: EncryptionAlgorithm;
}

/**
 * SRT password encryption/decryption configuration for SRT Listener and SRT Caller
 * sources and outputs on flows.
 *
 * If `role` is omitted, the consuming construct auto-creates a scoped IAM role with read
 * access to the provided {@link secret}.
 */
export interface SrtPasswordEncryption {
  /**
   * IAM role that MediaConnect assumes to access the Secrets Manager secret.
   *
   * @default - a scoped role is created automatically with read access to the provided secret
   */
  readonly role?: IRole;
  /**
   * Secrets Manager secret containing the SRT passphrase.
   */
  readonly secret: ISecret;
}

/**
 * Transit encryption configuration for router integration (flow-to-router or
 * router-to-flow). Uses AWS Secrets Manager for key management.
 *
 * If `role` is omitted, the consuming construct auto-creates a scoped IAM role with read
 * access to the provided {@link secret}.
 */
export interface TransitEncryption {
  /**
   * IAM role that MediaConnect assumes to access the Secrets Manager secret.
   *
   * @default - a scoped role is created automatically with read access to the provided secret
   */
  readonly role?: IRole;
  /**
   * Secrets Manager secret containing the transit encryption key.
   */
  readonly secret: ISecret;
}

/**
 * SRT encryption configuration for router outputs (SRT Listener and SRT Caller). Uses
 * AWS Secrets Manager for key management. Distinct from {@link SrtPasswordEncryption},
 * which is used for flow sources and outputs.
 *
 * If `role` is omitted, the consuming construct auto-creates a scoped IAM role with read
 * access to the provided {@link secret}.
 */
export interface RouterSrtEncryption {
  /**
   * IAM role that MediaConnect assumes to access the Secrets Manager secret.
   *
   * @default - a scoped role is created automatically with read access to the provided secret
   */
  readonly role?: IRole;
  /**
   * Secrets Manager secret containing the SRT passphrase.
   */
  readonly secret: ISecret;
}

/**
 * Encryption key type for transit encryption
 * @internal
 */
export enum EncryptionKeyType {
  SECRETS_MANAGER='SECRETS_MANAGER',
  AUTOMATIC='AUTOMATIC',
}

/**
 * Resolve an IAM role for MediaConnect to access a Secrets Manager secret. Returns the
 * user-provided role if supplied, otherwise auto-creates a scoped role with inline
 * `secretsmanager:GetSecretValue`/`DescribeSecret` and an `aws:SourceAccount` trust
 * condition, plus `kms:Decrypt` on the secret's encryption key if one is configured.
 *
 * @internal
 */
export function resolveEncryptionRole(scope: Construct, id: string, role: IRole | undefined, secret: ISecret): IRole {
  if (role) return role;

  const created = new Role(scope, id, {
    assumedBy: new ServicePrincipal('mediaconnect.amazonaws.com', {
      conditions: {
        StringEquals: { 'aws:SourceAccount': Aws.ACCOUNT_ID },
      },
    }),
    description: 'Auto-generated MediaConnect role for accessing the encryption secret',
    inlinePolicies: {
      SecretAccess: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
            resources: [secret.secretArn],
          }),
        ],
      }),
    },
  });

  secret.encryptionKey?.grantDecrypt(created);

  return created;
}

/**
 * Render the CFN-shape static-key encryption configuration. Auto-creates a scoped IAM
 * role if `encryption.role` is `undefined`.
 * @internal
 */
export function renderStaticKeyEncryption(scope: Construct, encryption: StaticKeyEncryption) {
  const role = resolveEncryptionRole(scope, 'EncryptionRole', encryption.role, encryption.secret);
  return {
    keyType: KeyType.STATIC_KEY.value,
    roleArn: role.roleArn,
    secretArn: encryption.secret.secretArn,
    algorithm: encryption.algorithm.value,
  };
}

/**
 * Render the CFN-shape SRT-password encryption configuration. Auto-creates a scoped IAM
 * role if `encryption.role` is `undefined`.
 * @internal
 */
export function renderSrtPasswordEncryption(scope: Construct, encryption: SrtPasswordEncryption) {
  const role = resolveEncryptionRole(scope, 'EncryptionRole', encryption.role, encryption.secret);
  return {
    keyType: KeyType.SRT_PASSWORD.value,
    roleArn: role.roleArn,
    secretArn: encryption.secret.secretArn,
  };
}

/**
 * Render the CFN-shape router SRT encryption configuration block (the inner
 * `encryptionKey` / `decryptionKey` object). Auto-creates a scoped IAM role if
 * `encryption.role` is `undefined`.
 * @internal
 */
export function renderRouterSrtEncryption(scope: Construct, id: string, encryption: RouterSrtEncryption) {
  const role = resolveEncryptionRole(scope, id, encryption.role, encryption.secret);
  return {
    encryptionKey: {
      roleArn: role.roleArn,
      secretArn: encryption.secret.secretArn,
    },
  };
}

/**
 * Render the CFN-shape transit encryption configuration (SECRETS_MANAGER) from an
 * optional {@link TransitEncryption}. Returns the AUTOMATIC service-managed default
 * when no encryption is supplied. Auto-creates a scoped IAM role if `encryption.role`
 * is `undefined`.
 * @internal
 */
export function renderTransitEncryption(scope: Construct, id: string, encryption?: TransitEncryption) {
  if (encryption) {
    const role = resolveEncryptionRole(scope, id, encryption.role, encryption.secret);
    return {
      encryptionKeyConfiguration: {
        secretsManager: {
          roleArn: role.roleArn,
          secretArn: encryption.secret.secretArn,
        },
      },
      encryptionKeyType: EncryptionKeyType.SECRETS_MANAGER,
    };
  }
  return {
    encryptionKeyType: EncryptionKeyType.AUTOMATIC,
    encryptionKeyConfiguration: {
      automatic: {},
    },
  };
}

/**
 * A video frame rate expressed as a rational number (numerator/denominator).
 *
 * Use the predefined constants for standard rates, or {@link Framerate.of} for a custom rate.
 */
export class Framerate {
  /** 24 fps (cinema) — `24/1`. */
  public static readonly FPS_24 = new Framerate(24, 1);
  /** 25 fps — `25/1`. */
  public static readonly FPS_25 = new Framerate(25, 1);
  /** 29.97 fps — `30000/1001`. */
  public static readonly FPS_29_97 = new Framerate(30000, 1001);
  /** 30 fps — `30/1`. */
  public static readonly FPS_30 = new Framerate(30, 1);
  /** 50 fps — `50/1`. */
  public static readonly FPS_50 = new Framerate(50, 1);
  /** 59.94 fps — `60000/1001`. */
  public static readonly FPS_59_94 = new Framerate(60000, 1001);
  /** 60 fps — `60/1`. */
  public static readonly FPS_60 = new Framerate(60, 1);

  /**
   * Define a custom frame rate.
   *
   * @param numerator Numerator of the rate.
   * @param denominator Denominator of the rate.
   */
  public static of(numerator: number, denominator: number): Framerate {
    if (!Number.isInteger(numerator) || numerator <= 0) {
      throw new UnscopedValidationError(lit`FramerateNumerator`, `Frame rate numerator must be a positive integer, got ${numerator}`);
    }
    if (!Number.isInteger(denominator) || denominator <= 0) {
      throw new UnscopedValidationError(lit`FramerateDenominator`, `Frame rate denominator must be a positive integer, got ${denominator}`);
    }
    return new Framerate(numerator, denominator);
  }

  /** @internal */
  private readonly _numeratorValue: number;
  /** @internal */
  private readonly _denominatorValue: number;

  private constructor(numerator: number, denominator: number) {
    this._numeratorValue = numerator;
    this._denominatorValue = denominator;
  }

  /** Returns the string value. */
  public toString(): string {
    return `${this._numeratorValue}/${this._denominatorValue}`;
  }

  /**
   * Returns the number value.
   * @internal
   */
  public _numerator(): number {
    return this._numeratorValue;
  }

  /**
   * Returns the number value.
   * @internal
   */
  public _denominator(): number {
    return this._denominatorValue;
  }
}

/**
 * The pixel aspect ratio (PAR) of the video.
 *
 * Use the predefined constants for standard ratios, or {@link PixelAspectRatio.of} for
 * a custom ratio.
 */
export class PixelAspectRatio {
  /** Square pixels (`1:1`). */
  public static readonly SQUARE = new PixelAspectRatio('1:1');

  /**
   * Define a pixel aspect ratio.
   *
   * @param horizontal Horizontal component of the ratio.
   * @param vertical Vertical component of the ratio.
   */
  public static of(horizontal: number, vertical: number): PixelAspectRatio {
    if (!Number.isInteger(horizontal) || horizontal <= 0) {
      throw new UnscopedValidationError(lit`PixelAspectRatioHorizontal`, `Pixel aspect ratio horizontal component must be a positive integer, got ${horizontal}`);
    }
    if (!Number.isInteger(vertical) || vertical <= 0) {
      throw new UnscopedValidationError(lit`PixelAspectRatioVertical`, `Pixel aspect ratio vertical component must be a positive integer, got ${vertical}`);
    }
    return new PixelAspectRatio(`${horizontal}:${vertical}`);
  }

  /** @param value The PAR string value in `horizontal:vertical` form. */
  private constructor(public readonly value: string) {}

  /** Returns the string value. */
  public toString(): string {
    return this.value;
  }
}

/**
 * Returns `true` when the given bitrate exceeds the specified tier's Mbps limit.
 * Used by router input/output constructs to validate bitrate fits within the chosen tier.
 *
 * @param tierMbps The tier's bitrate limit in Mbps, or `undefined` for custom tiers.
 * @param maximumBitrate The configured maximum bitrate.
 * @returns `true` if the bitrate exceeds the tier limit; `false` otherwise (including custom tiers).
 * @internal
 */
export function exceedsRouterTierBitrate(tierMbps: number | undefined, maximumBitrate: Bitrate): boolean {
  if (tierMbps === undefined) return false;
  return maximumBitrate.toBps() > tierMbps * 1_000_000;
}

/**
 * Returns `true` when the given CIDR literal is the fully-open range
 * (`0.0.0.0/0` or a `/0` prefix that is equivalent). Token-encoded values and
 * IPv6 are treated as non-open so we don't warn on values we can't inspect.
 *
 * @internal
 */
export function isOpenCidr(cidr: string): boolean {
  if (cidr === undefined) return false;
  const trimmed = cidr.trim();
  return trimmed === '0.0.0.0/0' || /\/0$/.test(trimmed);
}
