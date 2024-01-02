import { App, Stack } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DesiredState, EnrichmentParameters, IEnrichment, ILogDestination, ISource, ITarget, IncludeExecutionData, LogLevel, Pipe, SourceParameters, TargetParameters } from '../lib';

class TestSource implements ISource {
  sourceArn = 'source-arn';
  sourceParameters = {};
  public grantRead = jest.fn();

  constructor(parameters?: SourceParameters) {
    if (parameters) {
      this.sourceParameters = parameters;
    }
  }
}

class TestTarget implements ITarget {
  targetArn = 'target-arn';
  targetParameters = {};
  public grantPush = jest.fn();

  constructor(parameters?: TargetParameters) {
    if (parameters) {
      this.targetParameters = parameters;
    }
  }
}

class TestEnrichment implements IEnrichment {
  enrichmentArn = 'enrichment-arn';
  enrichmentParameters = {};
  public grantInvoke = jest.fn();

  constructor(parameters?: EnrichmentParameters) {
    if (parameters) {
      this.enrichmentParameters = parameters;
    }
  }
}

class TestLogDestination implements ILogDestination {
  logDestinationArn = 'log-destination-arn';
  parameters = {
    cloudwatchLogsLogDestination: {
      logGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/events/pipes/TestPipe',
    },
  };
  public grantPush = jest.fn();

}

describe('Pipe', () => {
  let stack: Stack;
  const source = new TestSource();
  const target = new TestTarget();

  beforeEach(() => {
    jest.resetAllMocks();
    const app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('is present with props', () => {
    // WHEN
    new Pipe(stack, 'TestPipe', {
      pipeName: 'TestPipe',
      description: 'test description',
      desiredState: DesiredState.RUNNING,
      tags: {
        key: 'value',
      },
      source,
      target,
    });
    const template = Template.fromStack(stack);

    // THEN
    template.resourceCountIs('AWS::Pipes::Pipe', 1);
    expect(template).toMatchSnapshot();
  });

  test('fromPipeName', () => {
    // WHEN
    const pipe = Pipe.fromPipeName(stack, 'TestPipe', 'TestPipe');

    // THEN
    expect(pipe.pipeName).toEqual('TestPipe');
    expect(pipe.pipeArn).toEqual('arn:aws:pipes:us-east-1:123456789012:pipe/TestPipe');
    expect(pipe.pipeRole.roleArn).toEqual(expect.stringContaining('role/TestPipe'));
  });

  describe('source', () => {
    it('should grant read permissions to the source', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
      });

      // THEN
      expect(source.grantRead).toHaveBeenCalled();
      expect(source.grantRead).toHaveBeenCalledWith(pipe.pipeRole);
    });

    it('should pass parameters and arn', () => {
      // GIVEN
      const sourceWithParameters: ISource =new TestSource({
        sqsQueueParameters: {
          batchSize: 2,
        },
      });

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source: sourceWithParameters,
        target,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          Source: 'source-arn',
          SourceParameters: {
            SqsQueueParameters: {
              BatchSize: 2,
            },
          },
        },
      },
      );

    });

    it('should add filter criteria to the source parameters', () => {
      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        filter: {
          filters: [
            {
              pattern: 'filter-pattern',
            },
          ],
        },
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          SourceParameters: {
            FilterCriteria: {
              Filters: [
                {
                  Pattern: 'filter-pattern',
                },
              ],
            },
          },
        },
      },
      );

    });
    it('should merge filter criteria and source parameters', () => {
      // GIVEN
      const sourceWithParameters: ISource =new TestSource({
        sqsQueueParameters: {
          batchSize: 2,
        },
      });

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source: sourceWithParameters,
        target,
        filter: {
          filters: [
            {
              pattern: 'filter-pattern',
            },
          ],
        },
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          SourceParameters: {
            SqsQueueParameters: {
              BatchSize: 2,
            },
            FilterCriteria: {
              Filters: [
                {
                  Pattern: 'filter-pattern',
                },
              ],
            },
          },
        },
      },
      );

    });
  });

  describe('target', () => {

    it('should grant push permissions to the target', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
      });

      // THEN
      expect(target.grantPush).toHaveBeenCalled();
      expect(target.grantPush).toHaveBeenCalledWith(pipe.pipeRole);
    });

    it('should pass parameters and arn', () => {
      // GIVEN
      const targetWithParameters: ITarget = new TestTarget({
        sqsQueueParameters: {
          messageGroupId: 'message-group-id',
        },
      });

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target: targetWithParameters,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          Target: 'target-arn',
          TargetParameters: {
            SqsQueueParameters: {
              MessageGroupId: 'message-group-id',
            },
          },
        },
      },
      );
    });
  });

  describe('enrichment', () => {
    const enrichment = new TestEnrichment();

    it('should grant invoke permissions to the enrichment', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        enrichment,
      });

      // THEN
      expect(enrichment.grantInvoke).toHaveBeenCalled();
      expect(enrichment.grantInvoke).toHaveBeenCalledWith(pipe.pipeRole);
    });

    it('should pass enrichment parameters', () => {
      // GIVEN
      const enrichmentWithParameters =new TestEnrichment({
        inputTransformation: { inputTemplate: 'input-template' },
      } );

      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        enrichment: enrichmentWithParameters,
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          Enrichment: 'enrichment-arn',
          EnrichmentParameters: {
            InputTemplate: 'input-template',
          },
        },
      },
      );
    });
  });

  describe('role', () => {
    it('should create a role', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
      });

      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBeInstanceOf(Role);
    });

    it('should use the provided role', () => {
      // GIVEN
      const enrichment: IEnrichment = new TestEnrichment();

      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      });

      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        enrichment,
        target,
        role,
      });

      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBe(role);
      expect(source.grantRead).toHaveBeenCalledWith(role);
      expect(target.grantPush).toHaveBeenCalledWith(role);
      expect(enrichment.grantInvoke).toHaveBeenCalledWith(role);

    });

    it('should call grant on the provided role', () => {
      // GIVEN
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      });
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        role,
      });
      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBe(role);
    });

    it('should use the imported role', () => {
      // GIVEN
      const role = Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/Role');
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        role,
      });
      // THEN
      expect(pipe.pipeRole).toBeDefined();
      expect(pipe.pipeRole).toBe(role);
      expect(source.grantRead).toHaveBeenCalledWith(role);
      expect(target.grantPush).toHaveBeenCalledWith(role);
    });
  });

  describe('logs', () => {
    const logDestination = new TestLogDestination();
    it('should pass along log configuration', () => {
      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logLevel: LogLevel.INFO,
        logIncludeExecutionData: [IncludeExecutionData.ALL],
        logDestinations: [
          logDestination,
        ],
      });

      const template = Template.fromStack(stack);

      // THEN
      template.hasResource('AWS::Pipes::Pipe', {
        Properties: {
          LogConfiguration: {
            CloudwatchLogsLogDestination: {

              LogGroupArn: 'arn:aws:logs:us-east-1:123456789012:log-group:/aws/events/pipes/TestPipe',
            },
            Level: 'INFO',
            IncludeExecutionData: ['ALL'],
          },
        },
      },
      );
    } );

    it('should call grantPush of the log destination with pipe role', () => {
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        logDestinations: [logDestination],
      });

      // THEN
      expect(logDestination.grantPush).toHaveBeenCalledWith(pipe.pipeRole);
    });
  });
});
