import { Construct, IConstruct } from 'constructs';
import { Architecture } from './architecture';
import { ISecret } from '../../aws-secretsmanager';
import { Token, Stack, Lazy } from '../../core';
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

/**
 * Parameters and Secrets Extension configuration
 */
export interface ParamsAndSecretsConfig {
  /**
   * The secret to grant the function access to
   */
  readonly secret: ISecret;

  /**
   * The Parameters and Secrets Extension layer
   */
  readonly layerVersion: ParamsAndSecretsLayerVersion;
}

/**
 * Version of Parameters and Secrets Extension
 */
export abstract class ParamsAndSecretsLayerVersion {
  /**
   * Version for x86_64
   */
  public static readonly FOR_X86_64 = ParamsAndSecretsLayerVersion.fromArchitecture(Architecture.X86_64);

  /**
   * Version for ARM_64
   */
  public static readonly FOR_ARM_64 = ParamsAndSecretsLayerVersion.fromArchitecture(Architecture.ARM_64);

  /**
   * Use the Parameters and Secrets extension associate with the provided ARN. Make sure the ARN is associated
   * with the same region as your function
   *
   * @see https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html#retrieving-secrets_lambda_ARNs
   */
  public static fromVersionArn(arn: string): ParamsAndSecretsLayerVersion {
    class ParamsAndSecretsArn extends ParamsAndSecretsLayerVersion {
      public readonly layerVersionArn = arn;

      public _bind(_scope: Construct): ParamsAndSecretsBindConfig {
        return {
          arn,
        };
      }
    }

    return new ParamsAndSecretsArn();
  }

  /**
   * Use the architecture to build the object
   */
  private static fromArchitecture(architecture: Architecture): ParamsAndSecretsLayerVersion {
    class ParamsAndSecretsVersion extends ParamsAndSecretsLayerVersion {
      public readonly layerVersionArn = Lazy.uncachedString({
        produce: (context) => getVersionArn(context.scope, architecture.name),
      });

      public _bind(_scope: Construct): ParamsAndSecretsBindConfig {
        return {
          arn: getVersionArn(_scope, architecture.name),
        };
      }
    }

    return new ParamsAndSecretsVersion();
  }

  /**
   * The arn of the Parameters and Secrets extension lambda
   */
  public readonly layerVersionArn: string = '';

  /**
   * Returns the arn of the Parameters and Secrets extension
   *
   * @internal
   */
  public abstract _bind(_scope: Construct): ParamsAndSecretsBindConfig;
}

/**
 * Function to retrieve the correct Parameters and Secrets Extension Lambda ARN from RegionInfo,
 * or create a mapping to look it up at stack deployment time.
 *
 * This function is run on CDK synthesis.
 */
function getVersionArn(scope: IConstruct, architecture: string): string {
  const stack = Stack.of(scope);
  const region = stack.region;

  if (region !== undefined && !Token.isUnresolved(region)) {
    const layerArn = RegionInfo.get(region).paramsAndSecretsLambdaLayerArn(architecture);
    if (layerArn === undefined) {
      throw new Error(`Parameters and Secrets Extension is not supported in region ${region} for ${architecture} architecture`);
    }
    return layerArn;
  }

  return stack.regionalFact(FactName.paramsAndSecretsLambdaLayer(architecture));
}
