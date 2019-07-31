import { PolicyStatement } from '@aws-cdk/aws-iam';
import lambda = require('@aws-cdk/aws-lambda');
import { Aws, CfnResource, Construct, Duration, Stack, Token } from '@aws-cdk/core';
import crypto = require('crypto');
import path = require('path');
import { Cluster } from './cluster';

export interface KubectlHandlerProps {
  /**
   * The EKS cluster that this handler is associated with.
   */
  readonly cluster: Cluster;
}

/**
 * A custom resource handler that can invoke kubectl against an EKS cluster.
 *
 */
export class KubectlHandler extends Construct {
  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: KubectlHandlerProps) {
    super(scope, id);

    const kubectl = new KubectlLayer(this, 'kubectl-lambda-layer');

    this.function = new lambda.Function(this, 'ResourceProvider', {
      code: lambda.Code.asset(path.join(__dirname, 'resource-handler')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      layers: [ kubectl ],
      memorySize: 256,
      environment: {
        CLUSTER_NAME: props.cluster.clusterName,
      }
    });

    this.function.addToRolePolicy(new PolicyStatement({
      actions: [ 'eks:DescribeCluster' ],
      resources: [ props.cluster.clusterArn ],
    }));

    this.function.addToRolePolicy(new PolicyStatement({
      actions: [ 'ec2:DescribeInstances', 'ec2:DescribeTags' ],
      resources: [ '*' ],
    }));

    // this is required since we need to assume the stack role because this is
    // the only role that gets administrative permissions on the k8s cluster by
    // EKS (and we don't know this role during synthesis).
    this.function.addToRolePolicy(new PolicyStatement({
      actions: [ 'sts:AssumeRole' ],
      resources: [ '*' ]
    }));

    // we use DescribeStacks in order to find out which IAM role was used to
    // create the stack and then use it in the call to `aws eks update-kubeconfig`
    // EKS doesn't support explicitly specifying this role, so it will just use
    // the role that was specified when the stack was created.
    this.function.addToRolePolicy(new PolicyStatement({
      actions: [ 'cloudformation:DescribeStacks' ],
      resources: [ Aws.STACK_ID ]
    }));
  }
}

/**
 * An AWS Lambda layer that includes kubectl and the AWS CLI.
 *
 * @see https://github.com/aws-samples/aws-lambda-layer-kubectl
 */
class KubectlLayer extends Construct implements lambda.ILayerVersion {
  public readonly layerVersionArn: string;
  public readonly compatibleRuntimes?: lambda.Runtime[];

  public readonly stack: Stack;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.stack = Stack.of(this);

    const uniqueId = crypto.createHash('md5').update(this.node.path).digest("hex");

    this.stack.templateOptions.transforms = [ 'AWS::Serverless-2016-10-31' ]; // required for AWS::Serverless
    const resource = new CfnResource(this, 'Resource', {
      type: 'AWS::Serverless::Application',
      properties: {
        Location: {
          ApplicationId: 'arn:aws:serverlessrepo:us-east-1:903779448426:applications/lambda-layer-kubectl',
          SemanticVersion: '1.13.7'
        },
        Parameters: {
          LayerName: `kubectl-${uniqueId}`
        }
      }
    });

    this.layerVersionArn = Token.asString(resource.getAtt('Outputs.LayerVersionArn'));
  }

  public addPermission(_id: string, _permission: lambda.LayerVersionPermission): void {
    return;
  }
}
