import { expect } from '@aws-cdk/assert';
import { BuildSpec } from '@aws-cdk/aws-codebuild';
import { Repository } from '@aws-cdk/aws-codecommit';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';

import { PullRequestCheck } from '../lib';

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const repository = new Repository(stack, 'Repository', {
      repositoryName: 'MyRepositoryName',
      description: 'Some description.'
    });

    // WHEN
    new PullRequestCheck(stack, 'PullRequestCheck', {
      repository,
      buildSpec: BuildSpec.fromSourceFilename('buildspecs/prcheck.yml')
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        Repository22E53BBD: {
          Type: 'AWS::CodeCommit::Repository',
          Properties: {
            RepositoryName: 'MyRepositoryName',
            RepositoryDescription: 'Some description.',
            Triggers: []
          }
        },
        RepositoryPullRequestChangeRule71FDD004: {
          Type: 'AWS::Events::Rule',
          Properties: {
            EventPattern: {
              'detail': {
                event: ['pullRequestSourceBranchUpdated', 'pullRequestCreated']
              },
              'source': ['aws.codecommit'],
              'resources': [
                {
                  'Fn::GetAtt': ['Repository22E53BBD', 'Arn']
                }
              ],
              'detail-type': ['CodeCommit Pull Request State Change']
            },
            State: 'ENABLED',
            Targets: [
              {
                Arn: {
                  'Fn::GetAtt': [
                    'PullRequestCheckPullRequestFunction9A17A6B8',
                    'Arn'
                  ]
                },
                Id: 'Target0'
              },
              {
                Arn: {
                  'Fn::GetAtt': [
                    'PullRequestCheckPullRequestProjectF12CB57F',
                    'Arn'
                  ]
                },
                Id: 'Target1',
                InputTransformer: {
                  InputPathsMap: {
                    'detail-sourceCommit': '$.detail.sourceCommit',
                    'detail-pullRequestId': '$.detail.pullRequestId',
                    'detail-repositoryNames-0-': '$.detail.repositoryNames[0]',
                    'detail-destinationCommit': '$.detail.destinationCommit'
                  },
                  InputTemplate:
                    '{"sourceVersion":<detail-sourceCommit>,"artifactsOverride":{"type":"NO_ARTIFACTS"},' +
                    '"environmentVariablesOverride":[{"name":"pullRequestId","value":<detail-pullRequestId>,' +
                    '"type":"PLAINTEXT"},{"name":"repositoryName","value":<detail-repositoryNames-0->,"type":"PLAINTEXT"},' +
                    '{"name":"sourceCommit","value":<detail-sourceCommit>,"type":"PLAINTEXT"},{"name":"destinationCommit",' +
                    '"value":<detail-destinationCommit>,"type":"PLAINTEXT"}]}'
                },
                RoleArn: {
                  'Fn::GetAtt': [
                    'PullRequestCheckPullRequestProjectEventsRoleE5A7F0BC',
                    'Arn'
                  ]
                }
              }
            ]
          }
        },
        PullRequestCheckLambdaRoleD4C3CFE2: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: {
                      'Fn::Join': [
                        '',
                        [
                          'lambda.',
                          {
                            Ref: 'AWS::URLSuffix'
                          }
                        ]
                      ]
                    }
                  }
                }
              ],
              Version: '2012-10-17'
            }
          }
        },
        PullRequestCheckLambdaRoleDefaultPolicyD4692040: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: [
                    'codebuild:*',
                    'codecommit:*',
                    'logs:CreateLogGroup',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents',
                    'logs:GetLogEvents'
                  ],
                  Effect: 'Allow',
                  Resource: '*'
                }
              ],
              Version: '2012-10-17'
            },
            PolicyName: 'PullRequestCheckLambdaRoleDefaultPolicyD4692040',
            Roles: [
              {
                Ref: 'PullRequestCheckLambdaRoleD4C3CFE2'
              }
            ]
          }
        },
        PullRequestCheckPullRequestFunction9A17A6B8: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: {
                Ref: 'PullRequestCheckPullRequestFunctionCodeS3BucketF015D77C'
              },
              S3Key: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref:
                                'PullRequestCheckPullRequestFunctionCodeS3VersionKey765B3FA3'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      'Fn::Select': [
                        1,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref:
                                'PullRequestCheckPullRequestFunctionCodeS3VersionKey765B3FA3'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                ]
              }
            },
            Handler: 'pull_request.lambda_handler',
            Role: {
              'Fn::GetAtt': ['PullRequestCheckLambdaRoleD4C3CFE2', 'Arn']
            },
            Runtime: 'python3.7'
          },
          DependsOn: [
            'PullRequestCheckLambdaRoleDefaultPolicyD4692040',
            'PullRequestCheckLambdaRoleD4C3CFE2'
          ]
        },
        PullRequestCheckPullRequestFunctionAllowEventRuleRepositoryPullRequestChangeRuleC71F405272C691BC: {
          Type: 'AWS::Lambda::Permission',
          Properties: {
            Action: 'lambda:InvokeFunction',
            FunctionName: {
              'Fn::GetAtt': [
                'PullRequestCheckPullRequestFunction9A17A6B8',
                'Arn'
              ]
            },
            Principal: 'events.amazonaws.com',
            SourceArn: {
              'Fn::GetAtt': ['RepositoryPullRequestChangeRule71FDD004', 'Arn']
            }
          }
        },
        PullRequestCheckCodeBuildResultFunctionE246172A: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: {
                Ref:
                  'PullRequestCheckCodeBuildResultFunctionCodeS3Bucket554E206D'
              },
              S3Key: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref:
                                'PullRequestCheckCodeBuildResultFunctionCodeS3VersionKey99D37D4C'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      'Fn::Select': [
                        1,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref:
                                'PullRequestCheckCodeBuildResultFunctionCodeS3VersionKey99D37D4C'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                ]
              }
            },
            Handler: 'code_build_result.lambda_handler',
            Role: {
              'Fn::GetAtt': ['PullRequestCheckLambdaRoleD4C3CFE2', 'Arn']
            },
            Runtime: 'python3.7'
          },
          DependsOn: [
            'PullRequestCheckLambdaRoleDefaultPolicyD4692040',
            'PullRequestCheckLambdaRoleD4C3CFE2'
          ]
        },
        PullRequestCheckCodeBuildResultFunctionAllowEventRulePullRequestCheckPullRequestProjectPullRequestValidationRuleF9D9EF4A9DED08EE: {
          Type: 'AWS::Lambda::Permission',
          Properties: {
            Action: 'lambda:InvokeFunction',
            FunctionName: {
              'Fn::GetAtt': [
                'PullRequestCheckCodeBuildResultFunctionE246172A',
                'Arn'
              ]
            },
            Principal: 'events.amazonaws.com',
            SourceArn: {
              'Fn::GetAtt': [
                'PullRequestCheckPullRequestProjectPullRequestValidationRule16A1C1AC',
                'Arn'
              ]
            }
          }
        },
        PullRequestCheckPullRequestProjectRole63741937: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: {
                      'Fn::Join': [
                        '',
                        [
                          'codebuild.',
                          {
                            Ref: 'AWS::URLSuffix'
                          }
                        ]
                      ]
                    }
                  }
                }
              ],
              Version: '2012-10-17'
            }
          }
        },
        PullRequestCheckPullRequestProjectRoleDefaultPolicyBB7DD656: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: 'codecommit:GitPull',
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': ['Repository22E53BBD', 'Arn']
                  }
                },
                {
                  Action: [
                    'logs:CreateLogGroup',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents'
                  ],
                  Effect: 'Allow',
                  Resource: [
                    {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition'
                          },
                          ':logs:',
                          {
                            Ref: 'AWS::Region'
                          },
                          ':',
                          {
                            Ref: 'AWS::AccountId'
                          },
                          ':log-group:/aws/codebuild/',
                          {
                            Ref: 'PullRequestCheckPullRequestProjectF12CB57F'
                          }
                        ]
                      ]
                    },
                    {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition'
                          },
                          ':logs:',
                          {
                            Ref: 'AWS::Region'
                          },
                          ':',
                          {
                            Ref: 'AWS::AccountId'
                          },
                          ':log-group:/aws/codebuild/',
                          {
                            Ref: 'PullRequestCheckPullRequestProjectF12CB57F'
                          },
                          ':*'
                        ]
                      ]
                    }
                  ]
                }
              ],
              Version: '2012-10-17'
            },
            PolicyName:
              'PullRequestCheckPullRequestProjectRoleDefaultPolicyBB7DD656',
            Roles: [
              {
                Ref: 'PullRequestCheckPullRequestProjectRole63741937'
              }
            ]
          }
        },
        PullRequestCheckPullRequestProjectF12CB57F: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Artifacts: {
              Type: 'NO_ARTIFACTS'
            },
            Environment: {
              ComputeType: 'BUILD_GENERAL1_SMALL',
              Image: 'aws/codebuild/standard:2.0',
              PrivilegedMode: false,
              Type: 'LINUX_CONTAINER'
            },
            ServiceRole: {
              'Fn::GetAtt': [
                'PullRequestCheckPullRequestProjectRole63741937',
                'Arn'
              ]
            },
            Source: {
              BuildSpec: 'buildspecs/prcheck.yml',
              Location: {
                'Fn::GetAtt': ['Repository22E53BBD', 'CloneUrlHttp']
              },
              Type: 'CODECOMMIT'
            },
            Name: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': ['Repository22E53BBD', 'Name']
                  },
                  '-pull-request'
                ]
              ]
            }
          }
        },
        PullRequestCheckPullRequestProjectPullRequestValidationRule16A1C1AC: {
          Type: 'AWS::Events::Rule',
          Properties: {
            EventPattern: {
              'source': ['aws.codebuild'],
              'detail': {
                'project-name': [
                  {
                    Ref: 'PullRequestCheckPullRequestProjectF12CB57F'
                  }
                ]
              },
              'detail-type': ['CodeBuild Build State Change']
            },
            State: 'ENABLED',
            Targets: [
              {
                Arn: {
                  'Fn::GetAtt': [
                    'PullRequestCheckCodeBuildResultFunctionE246172A',
                    'Arn'
                  ]
                },
                Id: 'Target0'
              }
            ]
          }
        },
        PullRequestCheckPullRequestProjectEventsRoleE5A7F0BC: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: {
                      'Fn::Join': [
                        '',
                        [
                          'events.',
                          {
                            Ref: 'AWS::URLSuffix'
                          }
                        ]
                      ]
                    }
                  }
                }
              ],
              Version: '2012-10-17'
            }
          }
        },
        PullRequestCheckPullRequestProjectEventsRoleDefaultPolicy949E41E9: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: 'codebuild:StartBuild',
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': [
                      'PullRequestCheckPullRequestProjectF12CB57F',
                      'Arn'
                    ]
                  }
                }
              ],
              Version: '2012-10-17'
            },
            PolicyName:
              'PullRequestCheckPullRequestProjectEventsRoleDefaultPolicy949E41E9',
            Roles: [
              {
                Ref: 'PullRequestCheckPullRequestProjectEventsRoleE5A7F0BC'
              }
            ]
          }
        }
      },
      Parameters: {
        PullRequestCheckPullRequestFunctionCodeS3BucketF015D77C: {
          Type: 'String',
          Description:
            'S3 bucket for asset "PullRequestCheck/PullRequestFunction/Code"'
        },
        PullRequestCheckPullRequestFunctionCodeS3VersionKey765B3FA3: {
          Type: 'String',
          Description:
            'S3 key for asset version "PullRequestCheck/PullRequestFunction/Code"'
        },
        PullRequestCheckPullRequestFunctionCodeArtifactHash19BB9994: {
          Type: 'String',
          Description:
            'Artifact hash for asset "PullRequestCheck/PullRequestFunction/Code"'
        },
        PullRequestCheckCodeBuildResultFunctionCodeS3Bucket554E206D: {
          Type: 'String',
          Description:
            'S3 bucket for asset "PullRequestCheck/CodeBuildResultFunction/Code"'
        },
        PullRequestCheckCodeBuildResultFunctionCodeS3VersionKey99D37D4C: {
          Type: 'String',
          Description:
            'S3 key for asset version "PullRequestCheck/CodeBuildResultFunction/Code"'
        },
        PullRequestCheckCodeBuildResultFunctionCodeArtifactHash27C2925E: {
          Type: 'String',
          Description:
            'Artifact hash for asset "PullRequestCheck/CodeBuildResultFunction/Code"'
        }
      }
    });

    test.done();
  }
};
