import cdk = require('@aws-cdk/cdk');
import { Code, InlineCode } from './code';
import { Runtime } from './runtime';

export interface LayerVersionProps {
  /**
   * The runtimes that this layer is compatible with.
   *
   * @default All runtimes are supported
   */
  compatibleRuntimes?: Runtime[];

  /**
   * The content of this Layer. Using the ``InlineCode`` class is not permitted.
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
   * @param awsAccountId   the AWS account ID that will be granted access to the layer, or '*' to grant usage to any/all
   *                       AWS accounts. The default is '*'.
   * @param organizationId when using '*' as the ``awsAccountId``, a organization ID can be procided to restrict usage
   *                       to accounts that are memeber of a given organization.
   */
  public grantUsage(awsAccountId: string = '*', organizationId?: string): this {
    if (organizationId != null && awsAccountId !== '*') {
      throw new Error(`OrganizationId can only be specified if AwsAccountId is '*', but it is ${awsAccountId}`);
    }

    new cdk.Resource(this, `grant-usage-${awsAccountId}-${organizationId || '*'}`, {
      type: 'AWS::Lambda::LayerVersionPermission',
      properties: {
        Action: 'lambda:GetLayerVersion',
        LayerVersionArn: this.layerVersionArn,
        Principal: awsAccountId,
        OrganizationId: organizationId,
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
    if (props.code instanceof InlineCode) {
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
