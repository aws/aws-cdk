import { Match, Template } from '../../../assertions';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { MediaConvertCreateJob } from '../../lib';

let stack: cdk.Stack;

beforeEach(() => {
  stack = new cdk.Stack();
});

describe('MediaConvert Create Job', () => {

  test('REQUEST_RESPONSE Integration Pattern', () => {
    // WHEN
    const task = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
      createJobRequest: {
        Role: 'arn:aws:iam::123456789012:role/MediaConvertRole',
        Settings: {
          OutputGroups: [],
          Inputs: [],
        },
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::mediaconvert:createJob',
          ],
        ],
      },
      End: true,
      Parameters: {
        Role: 'arn:aws:iam::123456789012:role/MediaConvertRole',
        Settings: {
          OutputGroups: [],
          Inputs: [],
        },
      },
    });
  });

  test('RUN_JOB Integration Pattern', () => {
    // WHEN
    const task = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      createJobRequest: {
        Role: 'arn:aws:iam::123456789012:role/MediaConvertRole',
        Settings: {
          OutputGroups: [],
          Inputs: [],
        },
      },
    });

    // THEN
    expect(stack.resolve(task.toStateJson())).toEqual({
      Type: 'Task',
      Resource: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::mediaconvert:createJob.sync',
          ],
        ],
      },
      End: true,
      Parameters: {
        Role: 'arn:aws:iam::123456789012:role/MediaConvertRole',
        Settings: {
          OutputGroups: [],
          Inputs: [],
        },
      },
    });
  });

  test('Fails on Unsupported Integration Pattern', () => {
    expect(() => {
      // WHEN
      const task = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
        integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
        createJobRequest: {
          Settings: {
            OutputGroups: [],
            Inputs: [],
          },
        },
      });
      // THEN
    }).toThrow(/Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/);
  });

  test('Fails on role not specified', () => {
    expect(() => {
      // WHEN
      const task = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
        createJobRequest: {
          Settings: {
            OutputGroups: [],
            Inputs: [],
          },
        },
      });
      // THEN
    }).toThrow(/Default\/MediaConvertCreateJob is missing required property: Role/);
  });

  test('Fails on settings not specified', () => {
    expect(() => {
      // WHEN
      const task = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
        createJobRequest: {
          Role: 'arn:aws:iam::123456789012:role/MediaConvertRole',
        },
      });
      // THEN
    }).toThrow(/Default\/MediaConvertCreateJob is missing required property: Settings/);
  });

  test('Required Policy statements are generated in REQUEST_RESPONSE Integration', () => {
    // WHEN
    const task = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
      createJobRequest: {
        Role: 'arn:aws:iam::123456789012:role/MediaConvertRole',
        Settings: {
          OutputGroups: [],
          Inputs: [],
        },
      },
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: 'arn:aws:iam::123456789012:role/MediaConvertRole',
            Condition: {
              StringLike: {
                'iam:PassedToService': 'mediaconvert.amazonaws.com',
              },
            },
          },
          {
            Action: 'mediaconvert:CreateJob',
            Effect: 'Allow',
            Resource: '*',
          },
        ]),
      }),
    });
  });

  test('Required Policy statements are generated in RUN_JOB Integration', () => {
    // WHEN
    const task = new MediaConvertCreateJob(stack, 'MediaConvertCreateJob', {
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      createJobRequest: {
        Role: 'arn:aws:iam::123456789012:role/MediaConvertRole',
        Settings: {
          OutputGroups: [],
          Inputs: [],
        },
      },
    });

    new sfn.StateMachine(stack, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: 'arn:aws:iam::123456789012:role/MediaConvertRole',
            Condition: {
              StringLike: {
                'iam:PassedToService': 'mediaconvert.amazonaws.com',
              },
            },
          },
          {
            Action: 'mediaconvert:CreateJob',
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: ['mediaconvert:GetJob', 'mediaconvert:CancelJob'],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':events:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':rule/StepFunctionsGetEventsForMediaConvertJobRule',
                ],
              ],
            },
          },
        ]),
      }),
    });
  });
});
