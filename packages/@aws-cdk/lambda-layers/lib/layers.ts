import lambda = require('@aws-cdk/aws-lambda');
import { Construct, Stack } from '@aws-cdk/core';
import path = require('path');

/**
 * Properties for a layer
 */
export interface LayerProps {
  /**
   * The name of the layer
   */
  readonly name: string;

  /**
   * Dependencies for the layer
   */
  readonly dependencies: string[];

  /**
   * The runtime family of the layer
   *
   * @default RuntimeFamily.NODEJS
   */
  readonly runtimeFamily?: lambda.RuntimeFamily

  /**
   * The description of the layer
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Compatible runtimes for the layer
   *
   * @default [Runtime.NODEJS_10_X]
   */
  readonly compatibleRuntimes?: lambda.Runtime[];
}

/**
 * A layer
 */
export class Layer {
  /**
   * AWS SDK JS layer
   *
   * Use this layer to have a more recent version of the AWS SDK than the one
   * included in the Lambda runtime.
   */
  public static readonly AWS_SDK_JS = new Layer({
    name: 'aws-sdk-js',
    description: 'AWS SDK JS',
    dependencies: ['aws-sdk'],
  });

  /**
   * The name of the layer
   */
  public readonly name: string;

  /**
   * Dependencies of the layer
   */
  public readonly dependencies: string[];

  /**
   * The runtime family of the layer
   */
  public readonly runtimeFamily: lambda.RuntimeFamily;

  private readonly compatibleRuntimes: lambda.Runtime[];
  private readonly description?: string;

  constructor(props: LayerProps) {
    this.name = props.name;
    this.dependencies = props.dependencies;
    this.runtimeFamily = props.runtimeFamily || lambda.RuntimeFamily.NODEJS;
    this.compatibleRuntimes = props.compatibleRuntimes || [lambda.Runtime.NODEJS_10_X],
    this.description = props.description;
  }

  /**
   * Returns a singleton layer version for this layer
   */
  public getLayerVersion(scope: Construct) {
    const id = `layer-${this.name}`;
    const layer = Stack.of(scope).node.tryFindChild(id) as lambda.LayerVersion;
    if (layer) {
      return layer;
    }

    return new lambda.LayerVersion(Stack.of(scope), id, {
      code: lambda.Code.fromAsset(path.join(require.resolve('@aws-cdk/lambda-layers'), '../../layers', this.name)),
      compatibleRuntimes: this.compatibleRuntimes,
      description: this.description
    });
  }
}
