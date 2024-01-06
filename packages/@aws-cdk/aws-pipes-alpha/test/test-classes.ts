import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { EnrichmentParametersConfig, IEnrichment, ILogDestination, IPipe, ISource, ITarget, LogDestinationConfig, SourceConfig, SourceParameters } from '../lib';

export class TestSource implements ISource {
  private sourceArn = 'source-arn';
  private sourceParameters = {};
  public grantRead = jest.fn();

  constructor(parameters?: SourceParameters) {
    if (parameters) {
      this.sourceParameters = parameters;
    }
  }

  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceArn: this.sourceArn,
      sourceParameters: this.sourceParameters,
    };
  }
}

export class TestTarget implements ITarget {
  private targetArn: string = 'target-arn';
  private targetParameters: CfnPipe.PipeTargetParametersProperty = {};
  public grantPush = jest.fn();

  constructor(parameters?: CfnPipe.PipeTargetParametersProperty) {
    if (parameters) {
      this.targetParameters = parameters;
    }
  }
  public bind = (_pipe: IPipe)=>({
    targetArn: this.targetArn,
    targetParameters: this.targetParameters,
  });
}

export class TestEnrichment implements IEnrichment {
  private enrichmentArn= 'enrichment-arn'
  private enrichmentParameters = {};
  public grantInvoke = jest.fn();

  constructor(parameters?: EnrichmentParametersConfig['enrichmentParameters']) {
    if (parameters) {
      this.enrichmentParameters = parameters;
    }
  }
  bind = (_pipe: IPipe)=>({
    enrichmentArn: this.enrichmentArn,
    enrichmentParameters: this.enrichmentParameters,
  });
}

export class TestLogDestination implements ILogDestination {
  logDestinationArn = 'log-destination-arn';
  parameters = {
    cloudwatchLogsLogDestination: {
      logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/events/pipes/TestPipe',
    },
  };
  public grantPush = jest.fn();
  bind(_pipe: IPipe): LogDestinationConfig {
    return {
      parameters: this.parameters,
    };
  }

}
