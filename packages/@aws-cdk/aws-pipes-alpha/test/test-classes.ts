import { Role } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import {
  EnrichmentParametersConfig,
  IEnrichment,
  IPipe,
  ISource,
  ITarget,
  SourceConfig,
  SourceParameters,
  SourceWithDeadLetterTarget,
} from '../lib';

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

export class TestSourceWithDeadLetterTarget extends SourceWithDeadLetterTarget {
  deadLetterTarget?: IQueue | ITopic;
  public grantRead = jest.fn();

  constructor(deadLetterTarget: IQueue | ITopic) {
    super('source-arn', deadLetterTarget);
    this.deadLetterTarget = deadLetterTarget;
  }

  grantPush(grantee: Role, deadLetterTarget?: IQueue | ITopic) {
    if (deadLetterTarget instanceof Queue) {
      deadLetterTarget.grantSendMessages(grantee);
    } else if (deadLetterTarget instanceof Topic) {
      deadLetterTarget.grantPublish(grantee);
    }
  }

  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: {},
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

export class TestEnrichment implements IEnrichment {
  readonly enrichmentArn= 'enrichment-arn';
  private enrichmentParameters = {};
  public grantInvoke = jest.fn();

  constructor(parameters?: EnrichmentParametersConfig['enrichmentParameters']) {
    if (parameters) {
      this.enrichmentParameters = parameters;
    }
  }
  bind = (_pipe: IPipe)=>({
    enrichmentParameters: this.enrichmentParameters,
  });
}
