import type { Bitrate, Duration } from 'aws-cdk-lib';
import { Annotations, Token, UnscopedValidationError } from 'aws-cdk-lib';
import type { CfnFlow } from 'aws-cdk-lib/aws-mediaconnect';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Construct } from 'constructs';
import type { IBridge } from './bridge';
import type { MediaStream } from './flow';
import type { IFlowEntitlement } from './flow-entitlement';
import type { IRouterOutput } from './router-output';
import type { SrtPasswordEncryption, StaticKeyEncryption, TransitEncryption, VpcInterfaceConfig } from './shared';
import { NetworkInterface, State, isOpenCidr, renderSrtPasswordEncryption, renderStaticKeyEncryption, renderTransitEncryption } from './shared';

/**
 * Encoding options
 */
export class Encoding {
  /**
   * Option for JXSV
   */
  public static readonly JXSV = new Encoding('jxsv');
  /**
   * Option for raw
   */
  public static readonly RAW = new Encoding('raw');
  /**
   * Option for SMPTE-291
   */
  public static readonly SMPTE291 = new Encoding('smpte291');
  /**
   * Option for PCM
   */
  public static readonly PCM = new Encoding('pcm');

  /**
   * Use a custom encoding value
   * @param value The encoding string value
   */
  public static of(value: string): Encoding {
    return new Encoding(value);
  }

  /**
   * @param value The encoding string value
   */
  private constructor(public readonly value: string) {}

  /** Returns the string value */
  public toString(): string {
    return this.value;
  }
}

/**
 * Defines network configuration for a source — either a public network with a CIDR allowlist, or a VPC interface.
 */
export class NetworkConfiguration {
  /**
   * Use a public network with a CIDR allowlist.
   */
  public static publicNetwork(allowlistCidr: string): NetworkConfiguration {
    return new NetworkConfiguration(allowlistCidr, undefined);
  }

  /**
   * Use a VPC interface.
   */
  public static vpc(vpcInterface: VpcInterfaceConfig): NetworkConfiguration {
    return new NetworkConfiguration(undefined, vpcInterface.name);
  }

  /**
   * The CIDR allowlist for public internet sources, or undefined if using VPC.
   */
  public readonly whitelistCidr?: string;

  /**
   * The VPC interface name, or undefined if using public internet.
   */
  public readonly vpcInterfaceName?: string;

  private constructor(whitelistCidr?: string, vpcInterfaceName?: string) {
    this.whitelistCidr = whitelistCidr;
    this.vpcInterfaceName = vpcInterfaceName;
  }
}

/**
 * Options for Media Stream Source Configuration
 */
export interface MediaStreamSourceConfigurationCdi {
  /**
   * The format that was used to encode the data. For ancillary data streams, set the encoding name to smpte291.
   * If the encoding name is smpte291, set the color space to one of the following:
   * BT601, BT709, BT2020, or BT2100. For all other ancillary data streams, set the color space to SDR-NOCOLOR.
   */
  readonly encoding: Encoding;
  /**
   * The name of the media stream.
   */
  readonly mediaStream: MediaStream;
}

/**
 * Options for Media Stream Source Configuration
 */
export interface MediaStreamSourceConfigurationJpegXs {
  /**
   * The format that was used to encode the data. For ancillary data streams, set the encoding name to smpte291.
   * If the encoding name is smpte291, set the color space to one of the following:
   * BT601, BT709, BT2020, or BT2100. For all other ancillary data streams, set the color space to SDR-NOCOLOR.
   */
  readonly encoding: Encoding;
  /**
   * The port that the flow listens on for this incoming media stream.
   */
  readonly port: number;
  /**
   * The VPC interfaces where the media stream comes in from.
   */
  readonly inputInterface: VpcInterfaceConfig[];
  /**
   * The name of the media stream.
   */
  readonly mediaStream: MediaStream;
}

/**
 * Common configuration across all inputs
 */
export interface SourceBase {
  /**
   * The name of the source.
   */
  readonly flowSourceName: string;
  /**
   * A description of the source. This description appears only on the MediaConnect console and will not be seen by the end user.
   *
   * @default - no description
   */
  readonly description?: string;
}

/**
 * Configuration for RTP
 */
export interface SourceRtp extends SourceBase {
  /**
   * The port that the flow will be listening on for incoming content.
   */
  readonly port: number;
  /**
   * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
   *
   * @default - no maximum bitrate
   */
  readonly maxBitrate?: Bitrate;
  /**
   * Defines networking configuration
   */
  readonly network: NetworkConfiguration;
}

/**
 * Configuration for RIST
 */
export interface SourceRist extends SourceBase {
  /**
   * The maximum latency in milliseconds for a RIST or Zixi-based source.
   *
   * @default - 2000 ms
   */
  readonly maxLatency?: Duration;
  /**
   * The port that the flow will be listening on for incoming content.
   */
  readonly port: number;
  /**
   * The maximum bitrate for RIST, RTP, and RTP-FEC streams.
   *
   * @default - no maximum bitrate
   */
  readonly maxBitrate?: Bitrate;
  /**
   * Defines networking configuration
   */
  readonly network: NetworkConfiguration;
}

/**
 * Configuration for SRT Listener
 */
export interface SourceSrtListener extends SourceBase {
  /**
   * The port that the flow listens on for incoming content.
   *
   * Valid range: 1024–65535. Ports 2077 and 2088 are reserved by MediaConnect for Zixi
   * traffic and cannot be used for SRT Listener.
   */
  readonly port: number;
  /**
   * The maximum bitrate for streams.
   *
   * @default - no maximum bitrate
   */
  readonly maxBitrate?: Bitrate;
  /**
   * Defines networking configuration
   */
  readonly network: NetworkConfiguration;
  /**
   * The minimum latency in milliseconds for SRT-based streams. The value you set on your
   * MediaConnect source represents the minimal potential latency of that connection. The
   * latency of the stream is set to the higher of the sender's minimum latency and the
   * receiver's minimum latency.
   *
   * @default - no minimum latency
   */
  readonly minLatency?: Duration;

  /**
   * SRT Decryption options
   *
   * @default - no decryption
   */
  readonly decryption?: SrtPasswordEncryption;
}

/**
 * Configuration for SRT Caller
 */
export interface SourceSrtCaller extends SourceBase {
  /**
   * Source IP or domain name for SRT-caller protocol.
   */
  readonly sourceListenerAddress: string;
  /**
   * Source port for SRT-caller protocol.
   *
   * Valid range: 1024–65535. Ports 2077 and 2088 are reserved by MediaConnect for Zixi
   * traffic and cannot be used for SRT Caller.
   */
  readonly sourceListenerPort: number;
  /**
   * The maximum bitrate for streams.
   *
   * @default - no maximum bitrate
   */
  readonly maxBitrate?: Bitrate;
  /**
   * The maximum latency in milliseconds for SRT-based streams.
   *
   * @default - no maximum latency
   */
  readonly maxLatency?: Duration;
  /**
   * The minimum latency in milliseconds for SRT-based streams. The value you set on your
   * MediaConnect source represents the minimal potential latency of that connection. The
   * latency of the stream is set to the higher of the sender's minimum latency and the
   * receiver's minimum latency.
   *
   * @default - no minimum latency
   */
  readonly minLatency?: Duration;
  /**
   * The stream ID that you want to use for the transport.
   *
   * @default - no stream ID
   */
  readonly streamId?: string;
  /**
   * Optional VPC interface for the outbound SRT Caller connection. SRT Caller initiates
   * the connection to the configured `sourceListenerAddress` and `sourceListenerPort`,
   * so no CIDR allow list is needed.
   *
   * @default - outbound connection via the public internet; no VPC interface
   */
  readonly vpcInterface?: VpcInterfaceConfig;

  /**
   * SRT Decryption options
   *
   * @default - no decryption
   */
  readonly decryption?: SrtPasswordEncryption;
}

/**
 * Configuration for Zixi Push.
 *
 * No port option is exposed: MediaConnect assigns the Zixi Push ingest port itself —
 * public sources are served on 2088, VPC sources are auto-assigned a port in 2090–2099.
 * The service rejects any user-supplied port value, so the L2 surface doesn't accept one.
 *
 * @see https://docs.aws.amazon.com/mediaconnect/latest/ug/source-ports.html
 */
export interface SourceZixiPush extends SourceBase {
  /**
   * The maximum latency in milliseconds for a Zixi-based source.
   *
   * @default - chosen by MediaConnect
   */
  readonly maxLatency?: Duration;
  /**
   * The stream ID that you want to use for the transport. This parameter applies only to Zixi-based streams.
   *
   * @default - no stream ID
   */
  readonly streamId?: string;
  /**
   * Defines networking configuration
   */
  readonly network: NetworkConfiguration;
  /**
   * Decrypt source with static keys
   *
   * @default - no decryption
   */
  readonly decryption?: StaticKeyEncryption;
}

/**
 * Configuration for CDI
 */
export interface SourceCdi {
  /**
   * The name of the source.
   */
  readonly flowSourceName: string;
  /**
   * The VPC interface attachment to use for this bridge source.
   */
  readonly vpcInterface: VpcInterfaceConfig;
  /**
   * The size of the buffer (in ms) to use to sync incoming source data.
   *
   * Required by the MediaConnect service for CDI sources.
   */
  readonly maxSyncBuffer: number;
  /**
   * The port that the flow will be listening on for incoming content.
   */
  readonly port: number;
  /**
   * The media stream that is associated with the source, and the parameters for that association.
   */
  readonly mediaStreamSourceConfigurations: MediaStreamSourceConfigurationCdi[];
}

/**
 * Configuration for Jpeg XS
 */
export interface SourceJpegXs {
  /**
   * The name of the source.
   */
  readonly flowSourceName: string;
  /**
   * The size of the buffer (in ms) to use to sync incoming source data.
   *
   * @default 100
   */
  readonly maxSyncBuffer?: number;
  /**
   * The media stream that is associated with the source, and the parameters for that association.
   */
  readonly mediaStreamSourceConfigurations: MediaStreamSourceConfigurationJpegXs[];
  /**
   * The VPC interface attachment to use for this bridge source.
   *
   * @default - no VPC interface
   */
  readonly vpcInterface?: VpcInterfaceConfig[];
}

/**
 * Configuration for NDI (SpeedHQ) source.
 *
 * NDI sources are ingested from NDI senders inside your VPC. The flow must be
 * configured with `flowSize: FlowSize.LARGE` and `ndiConfig.ndiState = ENABLED`
 * with at least one NDI discovery server. The VPC connectivity for NDI is
 * configured on the discovery server entries in `NdiConfig`, not on the source
 * itself.
 */
export interface SourceNdi {
  /**
   * The name of the source.
   */
  readonly flowSourceName: string;

  /**
   * A description of the source. This description appears only on the MediaConnect
   * console and will not be seen by the end user.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The exact name of an existing NDI sender that's registered with your discovery
   * server. If included, the format of this name must be `MACHINENAME (ProgramName)`.
   *
   * If not specified, you can select the upstream NDI sender from the console
   * after starting the flow.
   *
   * @default - select the NDI sender after starting the flow
   */
  readonly sourceName?: string;
}

/**
 * Options for Gateway Bridge Source
 */
export interface GatewayBridgeSource {
  /**
   * The bridge feeding this flow.
   */
  readonly bridge: IBridge;
  /**
   * The VPC interface attachment to use for this bridge source.
   *
   * @default - no VPC interface
   */
  readonly vpcInterface?: VpcInterfaceConfig;
}

/**
 * Options for Router Source
 */
export interface RouterSource {
  /**
   * The router output that feeds this flow source.
   *
   * @default - no router output connected
   */
  readonly routerOutput?: IRouterOutput;
  /**
   * Options to decrypt incoming feed
   *
   * @default - no decryption
   */
  readonly decryption?: TransitEncryption;
}

/**
 * Options for Entitlement
 */
export interface EntitlementSource {
  /**
   * The entitlement that allows you to subscribe to content that comes from another AWS account.
   *
   * @remarks Entitlements are always imported from another AWS account using
   * `FlowEntitlement.fromFlowEntitlementArn()`. You cannot create new entitlements
   * in the same stack where you're consuming them.
   */
  readonly entitlement: IFlowEntitlement;
  /**
   * Options to decrypt incoming feed
   *
   * @default - no decryption
   */
  readonly decryption?: StaticKeyEncryption;
}

/**
 * Protocol Options for Sources
 */
export class SourceProtocol {
  /**
   * Options for Zixi Push
   */
  public static readonly ZIXI_PUSH = new SourceProtocol('zixi-push');
  /**
   * Options for RTP-FEC
   */
  public static readonly RTP_FEC = new SourceProtocol('rtp-fec');
  /**
   * Options for RTP
   */
  public static readonly RTP = new SourceProtocol('rtp');
  /**
   * Options for RIST
   */
  public static readonly RIST = new SourceProtocol('rist');
  /**
   * Options for SRT Listener
   */
  public static readonly SRT_LISTENER = new SourceProtocol('srt-listener');
  /**
   * Options for SRT Caller
   */
  public static readonly SRT_CALLER = new SourceProtocol('srt-caller');
  /**
   * Options for 2110
   */
  public static readonly JPEGXS = new SourceProtocol('st2110-jpegxs');
  /**
   * Options for CDI
   */
  public static readonly CDI = new SourceProtocol('cdi');
  /**
   * Options for NDI (SpeedHQ)
   */
  public static readonly NDI_SPEED_HQ = new SourceProtocol('ndi-speed-hq');

  /**
   * Use a custom source protocol value
   * @param value The source protocol string value
   */
  public static of(value: string): SourceProtocol {
    return new SourceProtocol(value);
  }

  /**
   * @param value The source protocol string value
   */
  private constructor(public readonly value: string) {}

  /** Returns the string value */
  public toString(): string {
    return this.value;
  }
}

/**
 * Validate a source ingest port is in the allowed range 1024-65535.
 * Skips the check when the port is tokenized.
 * @internal
 */
function validateIngestPort(port: number): void {
  if (Token.isUnresolved(port)) return;
  if (port < 1024 || port > 65535) {
    throw new UnscopedValidationError(lit`IngestPortRange`, `Ingest port must be between 1024 and 65535, got ${port}`);
  }
}

/**
 * Configurations for sources
 */
export class SourceConfiguration {
  /**
   * The source configuration for flows receiving a stream from router.
   */
  public static router(input?: RouterSource): SourceConfiguration {
    return new SourceConfiguration({
      name: input?.routerOutput?.routerOutputName,
      routerIntegrationState: State.ENABLED,
    }, undefined, undefined, input?.decryption);
  }

  /**
   * The source configuration for cloud flows receiving a stream from a bridge.
   */
  public static gatewayBridge(input: GatewayBridgeSource): SourceConfiguration {
    return new SourceConfiguration({
      gatewayBridgeSource: {
        bridgeArn: input.bridge.bridgeArn,
        vpcInterfaceAttachment: input.vpcInterface ? {
          vpcInterfaceName: input.vpcInterface.name,
        } : undefined,
      },
    });
  }

  /**
   * The entitlement that allows you to subscribe to content that comes from another AWS account. The entitlement is set by the
   * content originator and the ARN is generated as part of the originator's flow.
   *
   * @remarks The entitlement must be imported using `FlowEntitlement.fromFlowEntitlementArn()`
   * as entitlements are created by the content originator in a different AWS account.
   */
  public static entitlement(input: EntitlementSource): SourceConfiguration {
    return new SourceConfiguration({
      entitlementArn: input.entitlement.entitlementArn,
    }, input.decryption);
  }

  /**
   * Source option for RTP input
   */
  public static rtp(input: SourceRtp): SourceConfiguration {
    validateIngestPort(input.port);

    return new SourceConfiguration({
      name: input.flowSourceName,
      description: input.description,
      ingestPort: input.port,
      protocol: SourceProtocol.RTP.value,
      whitelistCidr: input.network.whitelistCidr,
      vpcInterfaceName: input.network.vpcInterfaceName,
      maxBitrate: input.maxBitrate?.toBps(),
    });
  }

  /**
   * Source option for RTP-FEC input
   */
  public static rtpFec(input: SourceRtp): SourceConfiguration {
    validateIngestPort(input.port);

    return new SourceConfiguration({
      name: input.flowSourceName,
      description: input.description,
      ingestPort: input.port,
      protocol: SourceProtocol.RTP_FEC.value,
      whitelistCidr: input.network.whitelistCidr,
      vpcInterfaceName: input.network.vpcInterfaceName,
      maxBitrate: input.maxBitrate?.toBps(),
    });
  }

  /**
   * Source option for RIST input
   */
  public static rist(input: SourceRist): SourceConfiguration {
    validateIngestPort(input.port);

    return new SourceConfiguration({
      name: input.flowSourceName,
      description: input.description,
      ingestPort: input.port,
      protocol: SourceProtocol.RIST.value,
      whitelistCidr: input.network.whitelistCidr,
      vpcInterfaceName: input.network.vpcInterfaceName,
      maxLatency: input.maxLatency?.toMilliseconds(),
      maxBitrate: input.maxBitrate?.toBps(),
    });
  }

  /**
   * Source option for SRT Listener input
   */
  public static srtListener(input: SourceSrtListener): SourceConfiguration {
    validateIngestPort(input.port);
    if (!Token.isUnresolved(input.port) && (input.port === 2077 || input.port === 2088)) {
      throw new UnscopedValidationError(lit`SrtReservedPort`, `Ports 2077 and 2088 are reserved and cannot be used for SRT Listener, got ${input.port}`);
    }

    return new SourceConfiguration({
      name: input.flowSourceName,
      description: input.description,
      ingestPort: input.port,
      protocol: SourceProtocol.SRT_LISTENER.value,
      whitelistCidr: input.network.whitelistCidr,
      vpcInterfaceName: input.network.vpcInterfaceName,
      minLatency: input.minLatency?.toMilliseconds(),
      maxBitrate: input.maxBitrate?.toBps(),
    }, undefined, input.decryption);
  }

  /**
   * Source option for Zixi Push input
   */
  public static zixiPush(input: SourceZixiPush): SourceConfiguration {
    return new SourceConfiguration({
      name: input.flowSourceName,
      description: input.description,
      // Zixi Push ingest port is service-assigned. Standard (public) sources use
      // port 2088; VPC sources are auto-assigned a port in 2090-2099 and reject
      // any explicit ingestPort value. Only set the port for the public case.
      // @see https://docs.aws.amazon.com/mediaconnect/latest/ug/source-ports.html
      ingestPort: input.network.vpcInterfaceName !== undefined ? undefined : 2088,
      protocol: SourceProtocol.ZIXI_PUSH.value,
      whitelistCidr: input.network.whitelistCidr,
      vpcInterfaceName: input.network.vpcInterfaceName,
      streamId: input.streamId,
      maxLatency: input.maxLatency?.toMilliseconds(),
    }, input.decryption);
  }

  /**
   * Source option for SRT Caller input
   */
  public static srtCaller(input: SourceSrtCaller): SourceConfiguration {
    if (!Token.isUnresolved(input.sourceListenerPort) && (input.sourceListenerPort < 1024 || input.sourceListenerPort > 65535)) {
      throw new UnscopedValidationError(lit`SourceListenerPortRange`, `Source listener port must be between 1024 and 65535, got ${input.sourceListenerPort}`);
    }
    if (!Token.isUnresolved(input.sourceListenerPort) && (input.sourceListenerPort === 2077 || input.sourceListenerPort === 2088)) {
      throw new UnscopedValidationError(lit`SrtReservedPort`, `Ports 2077 and 2088 are reserved and cannot be used for SRT Caller, got ${input.sourceListenerPort}`);
    }

    return new SourceConfiguration({
      name: input.flowSourceName,
      description: input.description,
      sourceListenerAddress: input.sourceListenerAddress,
      sourceListenerPort: input.sourceListenerPort,
      protocol: SourceProtocol.SRT_CALLER.value,
      vpcInterfaceName: input.vpcInterface?.name,
      streamId: input.streamId,
      maxLatency: input.maxLatency?.toMilliseconds(),
      minLatency: input.minLatency?.toMilliseconds(),
      maxBitrate: input.maxBitrate?.toBps(),
    }, undefined, input.decryption);
  }

  /**
   * Source option for CDI input
   */
  public static cdi(input: SourceCdi): SourceConfiguration {
    validateIngestPort(input.port);
    if (input.maxSyncBuffer !== undefined
      && !Token.isUnresolved(input.maxSyncBuffer)
      && (input.maxSyncBuffer < 0 || input.maxSyncBuffer > 250)) {
      throw new UnscopedValidationError(lit`MaxSyncBufferRange`, `Max sync buffer must be between 0 and 250, got ${input.maxSyncBuffer}`);
    }

    // Validate CDI requires EFA interface
    if (input.vpcInterface.networkInterfaceType?.value !== NetworkInterface.EFA.value) {
      throw new UnscopedValidationError(
        lit`CdiRequiresEfa`,
        'CDI protocol requires an EFA network interface type',
      );
    }

    return new SourceConfiguration({
      name: input.flowSourceName,
      ingestPort: input.port,
      // CDI requires MaxSyncBuffer at the service level. When omitted, default to
      // 100 ms — matches the MediaConnect console default and avoids a deploy-time error.
      maxSyncBuffer: input.maxSyncBuffer ?? 100,
      protocol: SourceProtocol.CDI.value,
      vpcInterfaceName: input.vpcInterface?.name,
      mediaStreamSourceConfigurations: input.mediaStreamSourceConfigurations.map(inputStreamSource => {
        return {
          encodingName: inputStreamSource.encoding.value,
          mediaStreamName: inputStreamSource.mediaStream._bind().mediaStreamName,
        };
      }),
    });
  }

  /**
   * Source option for Jpeg-XS input
   */
  public static jpegXs(input: SourceJpegXs): SourceConfiguration {
    jpegXsValidation(input);

    return new SourceConfiguration({
      name: input.flowSourceName,
      // JPEG XS, like CDI, requires MaxSyncBuffer at the service level. Default to
      // 100 ms when omitted — matches the MediaConnect console default.
      maxSyncBuffer: input.maxSyncBuffer ?? 100,
      protocol: SourceProtocol.JPEGXS.value,
      mediaStreamSourceConfigurations: parseJpegXsMediaStreamConfigurationFields(input.mediaStreamSourceConfigurations),
    });
  }

  /**
   * Source option for NDI (SpeedHQ) input.
   *
   * The flow must be configured with `flowSize: FlowSize.LARGE` and
   * `ndiConfig.ndiState = State.ENABLED` with at least one NDI discovery server.
   */
  public static ndi(input: SourceNdi): SourceConfiguration {
    return new SourceConfiguration({
      name: input.flowSourceName,
      description: input.description,
      protocol: SourceProtocol.NDI_SPEED_HQ.value,
      ndiSourceSettings: input.sourceName ? {
        sourceName: input.sourceName,
      } : undefined,
    });
  }

  /**
   * @param input - CFN-shaped source properties (encryption fields are merged in `_bind`).
   * @param staticKeyDecryption - Optional static-key decryption. Set at most one of
   *   `staticKeyDecryption` / `srtPasswordDecryption`.
   * @param srtPasswordDecryption - Optional SRT-password decryption.
   * @param routerDecryption - Optional transit decryption for router integration.
   */
  private constructor(
    private readonly input: CfnFlow.SourceProperty,
    private readonly staticKeyDecryption?: StaticKeyEncryption,
    private readonly srtPasswordDecryption?: SrtPasswordEncryption,
    private readonly routerDecryption?: TransitEncryption,
  ) { }

  /**
   * Called when the source configuration is bound to a Flow or FlowSource.
   * @internal
   */
  public _bind(scope: Construct): CfnFlow.SourceProperty {
    const cidr = this.input.whitelistCidr;
    if (cidr !== undefined && !Token.isUnresolved(cidr) && isOpenCidr(cidr)) {
      Annotations.of(scope).addWarningV2(
        '@aws-cdk/aws-mediaconnect-alpha:openSourceCidr',
        `Source CIDR allowlist '${cidr}' allows traffic from any IP. Restrict to the narrowest range your source can send from.`,
      );
    }
    return {
      ...this.input,
      decryption: this.renderDecryption(scope),
      routerIntegrationTransitDecryption: this.input.routerIntegrationState === State.ENABLED
        ? renderTransitEncryption(scope, 'RouterTransitDecryptionRole', this.routerDecryption)
        : undefined,
    };
  }

  private renderDecryption(scope: Construct): CfnFlow.EncryptionProperty | undefined {
    if (this.staticKeyDecryption) return renderStaticKeyEncryption(scope, this.staticKeyDecryption);
    if (this.srtPasswordDecryption) return renderSrtPasswordEncryption(scope, this.srtPasswordDecryption);
    return undefined;
  }
}

/**
 * Validation for JPEGXS configuration
 * @param input SourceJpegXs configuration
 */
function jpegXsValidation(input: SourceJpegXs) {
  if (input.maxSyncBuffer !== undefined
    && !Token.isUnresolved(input.maxSyncBuffer)
    && (input.maxSyncBuffer < 0 || input.maxSyncBuffer > 250)) {
    throw new UnscopedValidationError(lit`MaxSyncBufferRange`, `Max sync buffer must be between 0 and 250, got ${input.maxSyncBuffer}`);
  }

  // Skip structural validation when the whole list is tokenized — we can't
  // iterate it, and any per-element validation below assumes real values.
  if (Token.isUnresolved(input.mediaStreamSourceConfigurations)) return;

  // Validate exactly 2 input configurations per media stream for JPEG XS
  input.mediaStreamSourceConfigurations.forEach((config) => {
    if (!config.inputInterface || config.inputInterface.length !== 2) {
      throw new UnscopedValidationError(
        lit`JpegXsInputInterfaceCount`,
        'JPEG XS protocol requires exactly 2 input configurations per media stream source configuration, ' +
        `media stream '${config.mediaStream._bind().mediaStreamName}' has ${config.inputInterface?.length ?? 0}`,
      );
    }
  });

  const usedPorts = new Set<number>();
  input.mediaStreamSourceConfigurations.forEach((config) => {
    if (usedPorts.has(config.port)) {
      throw new UnscopedValidationError(
        lit`DuplicateMediaStreamPort`,
        `Each media stream must use a unique port, port ${config.port} is used by multiple media streams`,
      );
    }
    usedPorts.add(config.port);
  });

  let efaCount = 0;
  input.mediaStreamSourceConfigurations.forEach(config => {
    config.inputInterface.forEach(iface => {
      if (iface.networkInterfaceType?.value === NetworkInterface.EFA.value) {
        efaCount++;
      }
    });
  });
  if (efaCount > 1) {
    throw new UnscopedValidationError(
      lit`JpegXsMaxEfaInterfaces`,
      `JPEG XS flows can have a maximum of 1 EFA VPC interface, got ${efaCount}`,
    );
  }

  // Validate that the 2 input interfaces are different
  input.mediaStreamSourceConfigurations.forEach((config) => {
    if (config.inputInterface[0] === config.inputInterface[1]) {
      throw new UnscopedValidationError(
        lit`JpegXsDuplicateInterface`,
        `The 2 input interfaces for media stream '${config.mediaStream._bind().mediaStreamName}' must be different VPC interfaces`,
      );
    }
  });

  // Validate at most 1 video media stream
  const videoStreams = input.mediaStreamSourceConfigurations.filter(
    config => config.mediaStream._bind().mediaStreamType === 'video',
  );

  if (videoStreams.length > 1) {
    throw new UnscopedValidationError(
      lit`MaxVideoStreams`,
      `A source may reference at most one video media stream, got ${videoStreams.length}`,
    );
  }
}

/**
 * Helper function to parse media stream configuration fields
 */
function parseJpegXsMediaStreamConfigurationFields(mediaStreamConfig?: MediaStreamSourceConfigurationJpegXs[]):
  CfnFlow.MediaStreamSourceConfigurationProperty[] | undefined {
  if (!mediaStreamConfig) return undefined;
  return mediaStreamConfig.map(config => ({
    encodingName: config.encoding.value,
    inputConfigurations: config.inputInterface?.map(inputInterface => ({
      inputPort: config.port,
      interface: {
        name: inputInterface.name,
      },
    })),
    mediaStreamName: config.mediaStream._bind().mediaStreamName,
  }));
}
