import cdk = require('@aws-cdk/cdk');
import { Code } from './code';
import { Runtime } from './runtime';

export interface LayerVersionProps {
  /**
   * The runtimes that this layer is compatible with.
   *
   * @default All runtimes are supported
   */
  compatibleRuntimes?: Runtime[];

  /**
   * The content of this Layer. Using the *inline* code is not permitted.
   */
  code: Code;

  /**
   * The description the this Lambda Layer.
   */
  description?: string;

  /**
   * The SPDX licence identifier or URL to the license file for this layer.
   */
  license?: string;

  /**
   * The name of the layer.
   * @default a name will be generated.
   */
  name?: string;
}

/**
 * A reference to a Lambda Layer version.
 */
export abstract class LayerVersionRef extends cdk.Construct {
  /**
   * Imports a Layer that has been defined externally.
   *
   * @param parent the parent Construct that will use the imported layer.
   * @param id     the id of the imported layer in the construct tree.
   * @param props  the properties of the imported layer.
   */
  public static import(parent: cdk.Construct, id: string, props: LayerVersionRefProps): LayerVersionRef {
    return new ImportedLayerVersionRef(parent, id, props);
  }

  /**
   * The ARN of the Lambda Layer version that this Layer defines.
   */
  public abstract readonly layerVersionArn: string;

  /**
   * The runtimes compatible with this Layer.
   */
  public abstract readonly compatibleRuntimes?: Runtime[];

  /**
   * Grants usage of this layer to specific entities. Usage within the same account where the layer is defined is always
   * allowed and does not require calling this method. Note that the principal that creates the Lambda function using
   * the layer (for example, a CloudFormation changeset execution role) also needs to have the
   * ``lambda:GetLayerVersion`` permission on the layer version.
   *
   * @param grantee the identification of the grantee.
   */
  public grantUsage(grantee: LayerVersionUsageGrantee): LayerVersionRef {
    if (grantee.organizationId != null && grantee.accountId !== '*') {
      throw new Error(`OrganizationId can only be specified if AwsAccountId is '*', but it is ${grantee.accountId}`);
    }

    new cdk.Resource(this, `grant-usage-${grantee.accountId}-${grantee.organizationId || '*'}`, {
      type: 'AWS::Lambda::LayerVersionPermission',
      properties: {
        Action: 'lambda:GetLayerVersion',
        LayerVersionArn: this.layerVersionArn,
        Principal: grantee.accountId,
        OrganizationId: grantee.organizationId,
      }
    });
    return this;
  }

  /**
   * Exports this layer for use in another Stack. The resulting object can be passed to the ``LayerRef.import`` function
   * to obtain a ``LayerRef`` in the user stack.
   */
  public export(): LayerVersionRefProps {
    return {
      layerVersionArn: new cdk.Output(this, 'LayerVersionArn', { value: this.layerVersionArn }).makeImportValue().toString(),
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
  accountId: string;

  /**
   * The ID of the AWS Organization to hwich the grant is restricted.
   *
   * Can only be specified if ``accountId`` is ``'*'``
   */
  organizationId?: string;
}

/**
 * Properties necessary to import a LayerRef.
 */
export interface LayerVersionRefProps {
  /**
   * The ARN of the LayerVersion.
   */
  layerVersionArn: string;

  /**
   * The list of compatible runtimes with this Layer.
   */
  compatibleRuntimes?: Runtime[];
}

/**
 * Defines a new Lambda Layer version.
 */
export class LayerVersion extends LayerVersionRef {
  public readonly layerVersionArn: string;
  public readonly compatibleRuntimes?: Runtime[];

  constructor(parent: cdk.Construct, id: string, props: LayerVersionProps) {
    super(parent, id);
    if (props.compatibleRuntimes && props.compatibleRuntimes.length === 0) {
      throw new Error('Attempted to define a Lambda layer that supports no runtime!');
    }
    if (props.code.isInline) {
      throw new Error('Lambda layers cannot be created from inline code');
    }
    // Allow usage of the code in this context...
    props.code.bind(this);

    const resource = new cdk.Resource(this, 'Resource', {
      type: 'AWS::Lambda::LayerVersion',
      properties: {
        CompatibleRuntimes: props.compatibleRuntimes && props.compatibleRuntimes.map(r => r.name),
        Content: props.code.toJSON(),
        Description: props.description,
        LayerName: props.name,
        LicenseInfo: props.license,
      }
    });

    this.layerVersionArn = resource.ref;
    this.compatibleRuntimes = props.compatibleRuntimes;
  }
}

class ImportedLayerVersionRef extends LayerVersionRef {
  public readonly layerVersionArn: string;
  public readonly compatibleRuntimes?: Runtime[];

  public constructor(parent: cdk.Construct, id: string, props: LayerVersionRefProps) {
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
  uuid: string;
}

/**
 * A Singleton Lambda Layer Version. The construct gurantees exactly one LayerVersion will be created in a given Stack
 * for the provided ``uuid``. It is recommended to use ``uuidgen`` to create a new ``uuid`` each time a new singleton
 * layer is created.
 */
export class SingletonLayerVersion extends LayerVersionRef {
  private readonly layerVersion: LayerVersionRef;

  constructor(parent: cdk.Construct, id: string, props: SingletonLayerVersionProps) {
    super(parent, id);

    this.layerVersion = this.ensureLayerVersion(props);
  }

  public get layerVersionArn(): string {
    return this.layerVersion.layerVersionArn;
  }

  public get compatibleRuntimes(): Runtime[] | undefined {
    return this.layerVersion.compatibleRuntimes;
  }

  public grantUsage(grantee: LayerVersionUsageGrantee): LayerVersionRef {
    this.layerVersion.grantUsage(grantee);
    return this;
  }

  private ensureLayerVersion(props: SingletonLayerVersionProps): LayerVersionRef {
    const singletonId = `SingletonLayer-${props.uuid}`;
    const stack = cdk.Stack.find(this);
    const existing = stack.tryFindChild(singletonId);
    if (existing) {
      return existing as LayerVersionRef;
    }
    return new LayerVersion(stack, singletonId, props);
  }
}
