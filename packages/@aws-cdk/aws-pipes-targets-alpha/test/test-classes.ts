import { IPipe, ISource, SourceConfig, SourceParameters } from '@aws-cdk/aws-pipes-alpha';

export class TestSource implements ISource {
  readonly sourceArn = 'source-arn';
  private sourceParameters = {};
  public grantRead = jest.fn();

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
}
