import * as lambda from '@aws-cdk/aws-lambda';
import * as core from '@aws-cdk/core';
import * as crypto from 'crypto';

const CFNCLI_APP_ARN = 'arn:aws:serverlessrepo:us-east-1:665331858954:applications/lambda-layer-cfncli';

const CFNCLI_APP_VERSION = '0.1.2';

export interface CfncliLayerProps {
  /**
   * The semantic version of the cfncli AWS Lambda Layer SAR app to use.
   *
   * @default '0.1.2'
   */
  readonly version?: string;
}

/**
 * An AWS Lambda layer that includes CloudFormation CLI.
 *
 * @see https://github.com/eduardomourar/aws-lambda-layer-cfncli
 */
export class CfncliLayer extends core.Construct implements lambda.ILayerVersion {

  /**
   * Gets or create a singleton instance of this construct.
   */
  public static getOrCreate(scope: core.Construct, props: CfncliLayerProps = {}): CfncliLayer {
    const stack = core.Stack.of(scope);
    const id = 'cfncli-layer-' + (props.version || '8C2542BC-BF2B-4DFE-B765-E181FD30A9A0');
    const exists = stack.node.tryFindChild(id) as CfncliLayer;
    if (exists) {
      return exists;
    }

    return new CfncliLayer(stack, id, props);
  }

  /**
   * The ARN of the AWS Lambda layer version.
   */
  public readonly layerVersionArn: string;

  /**
   * All runtimes are compatible.
   */
  public readonly compatibleRuntimes?: lambda.Runtime[] = undefined;

  constructor(scope: core.Construct, id: string, props: CfncliLayerProps = {}) {
    super(scope, id);

    const uniqueId = crypto.createHash('md5').update(this.node.path).digest('hex');
    const version = props.version || CFNCLI_APP_VERSION;

    this.stack.templateOptions.transforms = [ 'AWS::Serverless-2016-10-31' ]; // required for AWS::Serverless
    const resource = new core.CfnResource(this, 'Resource', {
      type: 'AWS::Serverless::Application',
      properties: {
        Location: {
          ApplicationId: CFNCLI_APP_ARN,
          SemanticVersion: version,
        },
        Parameters: {
          LayerName: `cfncli-${uniqueId}`,
        },
      },
    });

    this.layerVersionArn = core.Token.asString(resource.getAtt('Outputs.LayerVersionArn'));
  }

  public get stack() {
    return core.Stack.of(this);
  }

  public addPermission(_id: string, _permission: lambda.LayerVersionPermission): void {
    return;
  }
}
