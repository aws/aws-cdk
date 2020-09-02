import * as crypto from 'crypto';
import * as lambda from '@aws-cdk/aws-lambda';
import { CfnResource, Construct, Token, Stack, ResourceEnvironment } from '@aws-cdk/core';

const KUBECTL_APP_ARN = 'arn:aws:serverlessrepo:us-east-1:903779448426:applications/lambda-layer-kubectl';
const KUBECTL_APP_CN_ARN = 'arn:aws-cn:serverlessrepo:cn-north-1:487369736442:applications/lambda-layer-kubectl';
const KUBECTL_APP_VERSION = '2.0.0';

/**
 * Properties for KubectlLayer.
 */
export interface KubectlLayerProps {
  /**
   * The semantic version of the kubectl AWS Lambda Layer SAR app to use.
   *
   * @default '2.0.0'
   */
  readonly version?: string;

  /**
   * The Serverless Application Repository application ID which contains the kubectl layer.
   * @default - The ARN for the `lambda-layer-kubectl` SAR app.
   * @see https://github.com/aws-samples/aws-lambda-layer-kubectl
   */
  readonly applicationId?: string;
}

/**
 * An AWS Lambda layer that includes kubectl and the AWS CLI.
 *
 * @see https://github.com/aws-samples/aws-lambda-layer-kubectl
 */
export class KubectlLayer extends Construct implements lambda.ILayerVersion {
  /**
   * The ARN of the AWS Lambda layer version.
   */
  public readonly layerVersionArn: string;

  public readonly stack: Stack;
  public readonly env: ResourceEnvironment;

  /**
   * All runtimes are compatible.
   */
  public readonly compatibleRuntimes?: lambda.Runtime[] = undefined;

  constructor(scope: Construct, id: string, props: KubectlLayerProps = {}) {
    super(scope, id);

    this.stack = Stack.of(this);
    this.env = {
      account: this.stack.account,
      region: this.stack.region,
    };

    const uniqueId = crypto.createHash('md5').update(this.node.path).digest('hex');
    const version = props.version ?? KUBECTL_APP_VERSION;
    const applictionId = props.applicationId ?? (this.isChina() ? KUBECTL_APP_CN_ARN : KUBECTL_APP_ARN);

    this.stack.templateOptions.transforms = ['AWS::Serverless-2016-10-31']; // required for AWS::Serverless
    const resource = new CfnResource(this, 'Resource', {
      type: 'AWS::Serverless::Application',
      properties: {
        Location: {
          ApplicationId: applictionId,
          SemanticVersion: version,
        },
        Parameters: {
          LayerName: `kubectl-${uniqueId}`,
        },
      },
    });

    this.layerVersionArn = Token.asString(resource.getAtt('Outputs.LayerVersionArn'));
  }

  public addPermission(_id: string, _permission: lambda.LayerVersionPermission): void {
    return;
  }

  private isChina(): boolean {
    const region = this.stack.region;
    return !Token.isUnresolved(region) && region.startsWith('cn-');
  }
}
