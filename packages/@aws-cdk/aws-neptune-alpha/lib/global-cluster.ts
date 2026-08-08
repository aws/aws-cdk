import { CfnGlobalCluster } from 'aws-cdk-lib/aws-neptune';
import type { IResource } from 'aws-cdk-lib/core';
import { ArnFormat, Resource, Stack, Token, ValidationError } from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { EngineVersion, IDatabaseCluster } from './cluster';

/**
 * A Neptune Global Database cluster.
 *
 * @see https://docs.aws.amazon.com/neptune/latest/userguide/neptune-global-database.html
 */
export interface IGlobalCluster extends IResource {
  /**
   * The identifier of the global database cluster.
   *
   * @attribute
   */
  readonly globalClusterIdentifier: string;
}

/**
 * Properties for a new Neptune Global Database cluster.
 */
export interface GlobalClusterProps {
  /**
   * An optional identifier for the global database cluster.
   *
   * @default - A name is automatically generated.
   */
  readonly globalClusterIdentifier?: string;

  /**
   * The Neptune engine version to use for the global database cluster.
   *
   * Cannot be used together with `sourceCluster`; when a source cluster is
   * provided the engine version is inherited from it.
   *
   * @default - the default engine version, or inherited from `sourceCluster`.
   */
  readonly engineVersion?: EngineVersion;

  /**
   * An existing Neptune database cluster to use as the primary cluster of the
   * global database cluster.
   *
   * When provided, the global database cluster inherits the engine, engine
   * version and storage encryption settings of this cluster.
   *
   * @default - an empty global database cluster is created without a primary cluster.
   */
  readonly sourceCluster?: IDatabaseCluster;

  /**
   * Indicates whether the global database cluster has deletion protection enabled.
   *
   * @default false
   */
  readonly deletionProtection?: boolean;

  /**
   * Whether the global database cluster is encrypted.
   *
   * Cannot be used together with `sourceCluster`; when a source cluster is
   * provided the storage encryption setting is inherited from it.
   *
   * @default - false, or inherited from `sourceCluster`.
   */
  readonly storageEncrypted?: boolean;
}

/**
 * A new or imported Neptune Global Database cluster.
 */
abstract class GlobalClusterBase extends Resource implements IGlobalCluster {
  public abstract readonly globalClusterIdentifier: string;
}

/**
 * Create a Neptune Global Database cluster.
 *
 * A global database spans multiple AWS Regions, enabling low-latency global
 * reads and disaster recovery from Region-wide outages.
 *
 * @resource AWS::Neptune::GlobalCluster
 * @see https://docs.aws.amazon.com/neptune/latest/userguide/neptune-global-database.html
 */
@propertyInjectable
export class GlobalCluster extends GlobalClusterBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-neptune-alpha.GlobalCluster';

  /**
   * Import an existing global database cluster by its identifier.
   */
  public static fromGlobalClusterIdentifier(scope: Construct, id: string, globalClusterIdentifier: string): IGlobalCluster {
    class Import extends GlobalClusterBase {
      public readonly globalClusterIdentifier = globalClusterIdentifier;
    }

    return new Import(scope, id);
  }

  public readonly globalClusterIdentifier: string;

  constructor(scope: Construct, id: string, props: GlobalClusterProps = {}) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.sourceCluster && props.engineVersion) {
      throw new ValidationError(lit`SourceClusterWithEngineVersion`, 'cannot specify both sourceCluster and engineVersion; the engine version is inherited from the source cluster', this);
    }

    if (props.sourceCluster && props.storageEncrypted !== undefined) {
      throw new ValidationError(lit`SourceClusterWithStorageEncrypted`, 'cannot specify both sourceCluster and storageEncrypted; storage encryption is inherited from the source cluster', this);
    }

    this.validateGlobalClusterIdentifier(props.globalClusterIdentifier);

    const resource = new CfnGlobalCluster(this, 'Resource', {
      globalClusterIdentifier: props.globalClusterIdentifier,
      // Engine and version are inherited from the source cluster when one is provided.
      engine: props.sourceCluster ? undefined : 'neptune',
      engineVersion: props.sourceCluster ? undefined : props.engineVersion?.version,
      sourceDbClusterIdentifier: props.sourceCluster ? this.clusterArn(props.sourceCluster) : undefined,
      deletionProtection: props.deletionProtection,
      storageEncrypted: props.sourceCluster ? undefined : props.storageEncrypted,
    });

    this.globalClusterIdentifier = resource.ref;
  }

  /**
   * Build the ARN of a Neptune database cluster, which is what
   * `SourceDBClusterIdentifier` expects.
   */
  private clusterArn(cluster: IDatabaseCluster): string {
    return Stack.of(this).formatArn({
      service: 'rds',
      resource: 'cluster',
      resourceName: cluster.clusterIdentifier,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  private validateGlobalClusterIdentifier(identifier?: string): void {
    if (identifier === undefined || Token.isUnresolved(identifier)) {
      return;
    }

    if (identifier.length < 1 || identifier.length > 63) {
      throw new ValidationError(lit`InvalidGlobalClusterIdentifierLength`, `globalClusterIdentifier must be between 1 and 63 characters long, got ${identifier.length} characters: ${JSON.stringify(identifier)}`, this);
    }

    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(identifier)) {
      throw new ValidationError(lit`InvalidGlobalClusterIdentifier`, `globalClusterIdentifier must start with a lowercase letter and contain only lowercase letters, digits and hyphens, and must not end with a hyphen or contain two consecutive hyphens, got: ${JSON.stringify(identifier)}`, this);
    }
  }
}
