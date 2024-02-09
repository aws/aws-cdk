import { IPipe, ISource, SourceConfig, SourceParameters } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';

/**
 * A source that reads from an SQS queue.
 */
export class Sqs implements ISource {
  readonly sourceArn = 'source-arn';
  private sourceParameters = {};
  constructor(parameters?: SourceParameters) {
    if (parameters) {
      this.sourceParameters = parameters;
    }
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(_grantee: IRole): void {
    throw new Error('Method not implemented.');
  }

}