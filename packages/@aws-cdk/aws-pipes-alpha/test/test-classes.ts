import { EnrichmentParameters, IEnrichment, ILogDestination, ISource, ITarget, SourceParameters, TargetParameters } from '../lib';

export class TestSource implements ISource {
  sourceArn = 'source-arn';
  sourceParameters = {};
  public grantRead = jest.fn();

  constructor(parameters?: SourceParameters) {
    if (parameters) {
      this.sourceParameters = parameters;
    }
  }
}

export class TestTarget implements ITarget {
  targetArn = 'target-arn';
  targetParameters = {};
  public grantPush = jest.fn();

  constructor(parameters?: TargetParameters) {
    if (parameters) {
      this.targetParameters = parameters;
    }
  }
}

export class TestEnrichment implements IEnrichment {
  enrichmentArn = 'enrichment-arn';
  enrichmentParameters = {};
  public grantInvoke = jest.fn();
  constructor(parameters?: EnrichmentParameters) {
    if (parameters) {
      this.enrichmentParameters = parameters;
    }
  }
}

export class TestLogDestination implements ILogDestination {
  logDestinationArn = 'log-destination-arn';
  parameters = {
    cloudwatchLogsLogDestination: {
      logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/events/pipes/TestPipe',
    },
  };
  public grantPush = jest.fn();

}
