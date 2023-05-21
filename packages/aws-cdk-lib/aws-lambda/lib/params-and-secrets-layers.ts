import { Construct } from 'constructs';
import { IFunction } from './function-base';
import { ISecret } from '../../aws-secretsmanager';

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
          arn: '',
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
