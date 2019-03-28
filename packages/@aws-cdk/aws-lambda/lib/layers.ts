import cdk = require('@aws-cdk/cdk');
import { Code } from './code';
import { CfnLayerVersion, CfnLayerVersionPermission } from './lambda.generated';
import { Runtime } from './runtime';

export interface LayerVersionProps {
  /**
   * The runtimes that this layer is compatible with.
   *
   * @default All runtimes are supported
   */
  readonly compatibleRuntimes?: Runtime[];

  /**
   * The content of this Layer. Using *inline* (per ``code.isInline``) code is not permitted.
   */
  readonly code: Code;

  /**
   * The description the this Lambda Layer.
   */
  readonly description?: string;

  /**
   * The SPDX licence identifier or URL to the license file for this layer.
   *
   * @default no license information will be recorded.
   */
  readonly license?: string;

  /**
   * The name of the layer.
   * @default a name will be generated.
   */
  readonly name?: string;
}

export interface ILayerVersion extends cdk.IConstruct {
  /**
   * The ARN of the Lambda Layer version that this Layer defines.
   */
  readonly layerVersionArn: string;

  /**
   * The runtimes compatible with this Layer.
   */
  readonly compatibleRuntimes?: Runtime[];

  /**
   * Exports this layer for use in another Stack. The resulting object can be passed to the ``LayerVersion.import``
   * function to obtain an ``ILayerVersion`` in the user stack.
   */
  export(): LayerVersionImportProps;

  /**
   * Grants usage of this layer to specific entities. Usage within the same account where the layer is defined is always
   * allowed and does not require calling this method. Note that the principal that creates the Lambda function using
   * the layer (for example, a CloudFormation changeset execution role) also needs to have the
   * ``lambda:GetLayerVersion`` permission on the layer version.
   *
   * @param id the ID of the grant in the construct tree.
   * @param grantee the identification of the grantee.
   */
  grantUsage(id: string, grantee: LayerVersionUsageGrantee): ILayerVersion
}

/**
 * A reference to a Lambda Layer version.
 */
export abstract class LayerVersionBase extends cdk.Construct implements ILayerVersion {
  public abstract readonly layerVersionArn: string;
  public abstract readonly compatibleRuntimes?: Runtime[];

  public grantUsage(id: string, grantee: LayerVersionUsageGrantee): ILayerVersion {
    if (grantee.organizationId != null && grantee.accountId !== '*') {
      throw new Error(`OrganizationId can only be specified if AwsAccountId is '*', but it is ${grantee.accountId}`);
    }

    new CfnLayerVersionPermission(this, id, {
      action: 'lambda:GetLayerVersion',
      layerVersionArn: this.layerVersionArn,
      principal: grantee.accountId,
      organizationId: grantee.organizationId,
    });
    return this;
  }

  public export(): LayerVersionImportProps {
    return {
      layerVersionArn: new cdk.CfnOutput(this, 'LayerVersionArn', { value: this.layerVersionArn }).makeImportValue().toString(),
      compatibleRuntimes: this.compatibleRuntimes,
    };
  }
}

/**
 * Identification of an account (or organization) that is allowed to access a Lambda Layer Version.
 */
export interface LayerVersionUsageGrantee {
  /**
   * The AWS Account id of the account that is authorized to use a Lambda Layer Version. The wild-card ``'*'`` can be
   * used to grant access to "any" account (or any account in an organization when ``organizationId`` is specified).
   */
  readonly accountId: string;

  /**
   * The ID of the AWS Organization to hwich the grant is restricted.
   *
   * Can only be specified if ``accountId`` is ``'*'``
   */
  readonly organizationId?: string;
}

/**
 * Properties necessary to import a LayerVersion.
 */
export interface LayerVersionImportProps {
  /**
   * The ARN of the LayerVersion.
   */
  readonly layerVersionArn: string;

  /**
   * The list of compatible runtimes with this Layer.
   */
  readonly compatibleRuntimes?: Runtime[];
}

/**
 * Defines a new Lambda Layer version.
 */
export class LayerVersion extends LayerVersionBase {
  /**
   * Imports a Layer that has been defined externally.
   *
   * @param scope the parent Construct that will use the imported layer.
   * @param id    the id of the imported layer in the construct tree.
   * @param props the properties of the imported layer.
   */
  public static import(scope: cdk.Construct, id: string, props: LayerVersionImportProps): ILayerVersion {
    return new ImportedLayerVersion(scope, id, props);
  }

  public readonly layerVersionArn: string;
  public readonly compatibleRuntimes?: Runtime[];

  constructor(scope: cdk.Construct, id: string, props: LayerVersionProps) {
    super(scope, id);
    if (props.compatibleRuntimes && props.compatibleRuntimes.length === 0) {
      throw new Error('Attempted to define a Lambda layer that supports no runtime!');
    }
    if (props.code.isInline) {
      throw new Error('Lambda layers cannot be created from inline code');
    }
    // Allow usage of the code in this context...
    props.code.bind(this);

    const resource = new CfnLayerVersion(this, 'Resource', {
      compatibleRuntimes: props.compatibleRuntimes && props.compatibleRuntimes.map(r => r.name),
      content: new cdk.Token(() => props.code._toJSON(resource)),
      description: props.description,
      layerName: props.name,
      licenseInfo: props.license,
    });

    this.layerVersionArn = resource.layerVersionArn;
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}

class ImportedLayerVersion extends LayerVersionBase {
  public readonly layerVersionArn: string;
  public readonly compatibleRuntimes?: Runtime[];

  public constructor(parent: cdk.Construct, id: string, props: LayerVersionImportProps) {
    super(parent, id);

    if (props.compatibleRuntimes && props.compatibleRuntimes.length === 0) {
      throw new Error('Attempted to import a Lambda layer that supports no runtime!');
    }

    this.layerVersionArn = props.layerVersionArn;
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}

/**
 * Properties of a Singleton Lambda Layer Version.
 */
export interface SingletonLayerVersionProps extends LayerVersionProps {
  /**
   * A unique identifier to identify this lambda layer version.
   *
   * The identifier should be unique across all layer providers.
   * We recommend generating a UUID per provider.
   */
  readonly uuid: string;
}

/**
 * A Singleton Lambda Layer Version. The construct gurantees exactly one LayerVersion will be created in a given Stack
 * for the provided ``uuid``. It is recommended to use ``uuidgen`` to create a new ``uuid`` each time a new singleton
 * layer is created.
 */
export class SingletonLayerVersion extends cdk.Construct implements ILayerVersion {
  private readonly layerVersion: ILayerVersion;

  constructor(scope: cdk.Construct, id: string, props: SingletonLayerVersionProps) {
    super(scope, id);

    this.layerVersion = this.ensureLayerVersion(props);
  }

  public get layerVersionArn(): string {
    return this.layerVersion.layerVersionArn;
  }

  public get compatibleRuntimes(): Runtime[] | undefined {
    return this.layerVersion.compatibleRuntimes;
  }

  public export(): LayerVersionImportProps {
    return {
      layerVersionArn: this.layerVersionArn,
      compatibleRuntimes: this.compatibleRuntimes,
    };
  }

  public grantUsage(id: string, grantee: LayerVersionUsageGrantee): ILayerVersion {
    this.layerVersion.grantUsage(id, grantee);
    return this;
  }

  private ensureLayerVersion(props: SingletonLayerVersionProps): ILayerVersion {
    const singletonId = `SingletonLayer-${props.uuid}`;
    const existing = this.node.stack.node.tryFindChild(singletonId);
    if (existing) {
      return existing as unknown as ILayerVersion;
    }
    return new LayerVersion(this.node.stack, singletonId, props);
  }
}
