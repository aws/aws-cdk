import * as secrets from "aws-cdk-lib/aws-secretsmanager";
/******************************************************************************
 *                              ENUMS
 *****************************************************************************/
export enum RedshiftAuthType {
  /**
   * Allow your service role to authenticate to your Amazon Redshift provisioned query engine with IAM
   */
  IAM = "IAM",
  /**
   * Allow you to authenticate using an Amazon Redshift database user
   */
  DB_USER = "USERNAME",
  /**
   * Allows you to authenticate using a password stored in AWS Secrets Manager
   */
  SECRET = "USERNAME_PASSWORD",
}

/******************************************************************************
 *                             COMMON INTERFACES
 *****************************************************************************/
/**
 * An interface to configure
 */
interface RedshiftAuthL2Config {
  readonly authType: RedshiftAuthType;
  readonly secret?: secrets.ISecret;
  readonly username?: string;
}

/******************************************************************************
 *                                  CLASS
 *****************************************************************************/
/**
 * Specifies how the authentication to Redshift will happen.
 */
export class RedshiftAuth {
  public static withIamRole(): RedshiftAuth {
    return new RedshiftAuth({ authType: RedshiftAuthType.IAM });
  }
  public static withSecret(secret: secrets.ISecret): RedshiftAuth {
    return new RedshiftAuth({ authType: RedshiftAuthType.SECRET, secret });
  }
  public static withDBUsername(username: string): RedshiftAuth {
    return new RedshiftAuth({ authType: RedshiftAuthType.DB_USER, username });
  }
  public readonly authType: RedshiftAuthType;
  public readonly secret?: secrets.ISecret;
  public readonly username?: string;

  constructor(config: RedshiftAuthL2Config) {
    this.authType = config.authType;
    this.secret = config.secret;
    this.username = config.username;
  }

  render() {
    return {
      type: this.authType,
      ...(this.authType === RedshiftAuthType.SECRET && {
        usernamePasswordSecretArn: this.secret!.secretArn,
      }),
      ...(this.authType === RedshiftAuthType.DB_USER && {
        databaseUser: this.username!,
      }),
    };
  }
}
