import { App, Stack } from 'aws-cdk-lib';

import { Template } from 'aws-cdk-lib/assertions';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DesiredState, IPipeEnrichment, IPipeSource, IPipeTarget, Pipe } from '../lib';

describe('Pipe', () => {
  let stack: Stack;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });
  });

  test('pipe is present with props', () => {
    // WHEN
    new Pipe(stack, 'TestPipe', {
      pipeName: 'TestPipe',
      description: 'test description',
      desiredState: DesiredState.RUNNING,
      tags: {
        key: 'value',
      },
      source: {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},

      },
      target: {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      },
    });
    const template = Template.fromStack(stack);
    // THEN
    template.resourceCountIs('AWS::Pipes::Pipe', 1);
    expect(template).toMatchSnapshot();
  });

  describe('source', () => {
    it('should grant read permissions to the source', () => {
      // GIVEN
      const source = {
        grantRead: jest.fn(),
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
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
      const source: IPipeSource = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {
          sqsQueueParameters: {
            batchSize: 2,
          },
        },
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
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
      // GIVEN
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
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
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {
          sqsQueueParameters: {
            batchSize: 2,
          },
        },
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
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
      // GIVEN
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: jest.fn(),
        targetArn: 'target-arn',
        targetParameters: {},
      };
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
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target: IPipeTarget = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {
          sqsQueueParameters: {
            messageGroupId: 'message-group-id',
          },
        },
      };
      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
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
    it('should grant invoke permissions to the enrichment', () => {
      // GIVEN
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
      const enrichment: IPipeEnrichment = {
        enrichmentArn: 'enrichment-arn',
        enrichmentParameters: {},
        grantInvoke: jest.fn(),
      };
      // WHEN
      const pipe = new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        enrichment: enrichment,
      });
      // THEN
      expect(enrichment.grantInvoke).toHaveBeenCalled();
      expect(enrichment.grantInvoke).toHaveBeenCalledWith(pipe.pipeRole);
    });

    it('should pass enrichment parameters', () => {
      // GIVEN
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
      const enrichment: IPipeEnrichment = {
        enrichmentArn: 'enrichment-arn',
        enrichmentParameters: {
          inputTemplate: 'input-template',
        },
        grantInvoke: () => { },
      };
      // WHEN
      new Pipe(stack, 'TestPipe', {
        pipeName: 'TestPipe',
        source,
        target,
        enrichment: enrichment,
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
      // GIVEN
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
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
      const source = {
        grantRead: jest.fn(),
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: jest.fn(),
        targetArn: 'target-arn',
        targetParameters: {},
      };

      const enrichment: IPipeEnrichment = {
        enrichmentArn: 'enrichment-arn',
        enrichmentParameters: {
          inputTemplate: 'input-template',
        },
        grantInvoke: jest.fn(),
      };
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
      const source = {
        grantRead: () => { },
        sourceArn: 'source-arn',
        sourceParameters: {},
      };
      const target = {
        grantPush: () => { },
        targetArn: 'target-arn',
        targetParameters: {},
      };
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
  });
});
