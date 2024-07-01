import { IPipe, ISource, ITarget, SourceConfig, SourceParameters } from '@aws-cdk/aws-pipes-alpha';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';

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

export class TestTarget implements ITarget {
  readonly targetArn: string = 'target-arn';
  private targetParameters: CfnPipe.PipeTargetParametersProperty = {};
  public grantPush = jest.fn();

  constructor(parameters?: CfnPipe.PipeTargetParametersProperty) {
    if (parameters) {
      this.targetParameters = parameters;
    }
  }
  public bind = (_pipe: IPipe)=>({
    targetParameters: this.targetParameters,
  });
}

