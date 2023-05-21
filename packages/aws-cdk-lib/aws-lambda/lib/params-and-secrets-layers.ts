import { Construct, IConstruct } from 'constructs';
import { Architecture } from './architecture';
import { IFunction } from './function-base';
import { ISecret } from '../../aws-secretsmanager';
import { Token, Stack } from '../../core';
import { RegionInfo, FactName } from '../../region-info';

/**
 * Config returned from `ParamsAndSecretsVersion._bind`
 */
interface ParamsAndSecretsBindConfig {
  /**
   * ARN of the Parameters and Secrets layer version
   */
  readonly arn: string;
}

export interface ParamsAndSecretsConfig {
  /**
   *
   */
  readonly secret: ISecret;

  /**
   * The Parameters and Secrets Extension layer.
   */
  readonly paramsAndSecretsVersion: ParamsAndSecretsLayerVersion;
}

export abstract class ParamsAndSecretsLayerVersion {
  public static readonly LATEST = ParamsAndSecretsLayerVersion.fromLookUp();

  public static fromParamsAndSecretsVersionArn(arn: string): ParamsAndSecretsLayerVersion {
    class ParamsAndSecretsArn extends ParamsAndSecretsLayerVersion {
      public readonly layerVersionArn = arn;
      public _bind(_scope: Construct, _function: IFunction): ParamsAndSecretsBindConfig {
        return {
          arn,
        };
      }
    }

    return new ParamsAndSecretsArn();
  }

  private static fromLookUp(): ParamsAndSecretsLayerVersion {
    class ParamsAndSecretsVersion extends ParamsAndSecretsLayerVersion {
      public _bind(_scope: Construct, _function: IFunction): ParamsAndSecretsBindConfig {
        return {
          arn: getVersionArn(_scope, _function.architecture?.name ?? Architecture.X86_64.name),
        };
      }
    }

    return new ParamsAndSecretsVersion();
  }

  /**
   * Returns the arn of the Parameters and Secrets extension
   *
   * @internal
   */
  public abstract _bind(_scope: Construct, _function: IFunction): ParamsAndSecretsBindConfig;
}

function getVersionArn(scope: IConstruct, architecture: string): string {
  const stack = Stack.of(scope);
  const region = stack.region;

  if (region !== undefined && !Token.isUnresolved(region)) {
    const layerArn = RegionInfo.get(region).paramsAndSecretsLambdaLayerArn(architecture);
    if (layerArn === undefined) {
      throw new Error(`Parameters and Secrets Extension is not supported in region ${region}`);
    }
    return layerArn;
  }

  return stack.regionalFact(FactName.paramsAndSecretsLambdaLayer(architecture));
}
