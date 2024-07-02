import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { ICluster } from '@aws-cdk/aws-redshift-alpha';
import { Aws } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Redshift target properties.
 */
export interface RedshiftTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default - none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * The name of the database.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-database
   */
  readonly database: string;

  /**
   * The database user name. Required when authenticating using temporary credentials.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-dbuser
   */
  // TODO: implement this
  //readonly dbUser?: string;

  /**
   * The name or ARN of the secret that enables access to the database. Required when authenticating using Secrets Manager.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-secretmanagerarn
   */
  readonly secretManagerArn?: string;

  /**
   * The SQL statement text to run.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-sqls
   */
  readonly sqls: string[];

  /**
   * The name of the SQL statement. You can name the SQL statement when you create it to identify the query.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-statementname
   */
  readonly statementName?: string;

  /**
   * Indicates whether to send an event back to EventBridge after the SQL statement runs.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetredshiftdataparameters.html#cfn-pipes-pipe-pipetargetredshiftdataparameters-withevent
   * @default False
   */
  readonly withEvent?: boolean;
}

/**
 * A EventBridge Pipes target that sends messages to an SQS queue.
 */
export class RedshiftTarget implements ITarget {
  private redshiftParameters?: RedshiftTargetParameters;
  public readonly targetArn: string;

  constructor(cluster: ICluster, parameters?: RedshiftTargetParameters) {
    this.targetArn = `arn:${Aws.PARTITION}:redshift:${cluster.env.region}:${cluster.env.account}:cluster:${cluster.clusterName}`;
    this.redshiftParameters = parameters;
  }

  grantPush(grantee: iam.IRole): void {
    if (this.redshiftParameters?.secretManagerArn) {
      const statements = [new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['redshift-data:BatchExecuteStatement'],
        resources: [this.targetArn],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['secretsmanager:GetSecretValue'],
        resources: [this.redshiftParameters.secretManagerArn],
      })];

      grantee.attachInlinePolicy(new iam.Policy(grantee, 'policy', { statements }));
    }
  }

  bind(pipe: IPipe): TargetConfig {
    if (!this.redshiftParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.redshiftParameters.inputTransformation?.bind(pipe).inputTemplate,
        redshiftDataParameters: this.redshiftParameters,
      },
    };
  }
}
