import * as lambda from '../../aws-lambda';
import { RemovalPolicy, ResourceEnvironment, Stack } from '../../core';
import { Construct, Node } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer implements lambda.ILayerVersion {

  private readonly package: any;
  private readonly layer: lambda.LayerVersion;
  public readonly layerVersionArn: string;
  public readonly compatibleRuntimes?: lambda.Runtime[];
  public readonly stack: Stack;
  public readonly env: ResourceEnvironment;
  public readonly node: Node;

  constructor(scope: Construct, id: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    this.package = require('@aws-cdk/lambda-layer-awscli');

    this.layer = new this.package.AwsCliLayer(scope, id);
    this.layerVersionArn = this.layer.layerVersionArn;
    this.compatibleRuntimes = this.layer.compatibleRuntimes;
    this.stack = this.layer.stack;
    this.env = this.layer.env;
    this.node = this.layer.node;
  }

  public addPermission(id: string, permission: lambda.LayerVersionPermission): void {
    this.layer.addPermission(id, permission);
  }

  applyRemovalPolicy(policy: RemovalPolicy): void {
    this.layer.applyRemovalPolicy(policy);
  }
}
