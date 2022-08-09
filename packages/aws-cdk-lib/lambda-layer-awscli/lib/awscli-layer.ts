/* eslint-disable no-console */
import { Construct, Node } from 'constructs';
import * as lambda from '../../aws-lambda';
import { RemovalPolicy, ResourceEnvironment, Stack } from '../../core';

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
    // eslint-disable-next-line no-console
    console.log('loading package');
    console.log(require.resolve('@aws-cdk/lambda-layer-awscli'));
    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
    this.package = require('@aws-cdk/lambda-layer-awscli');
    console.log(Object.keys(this.package));

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
