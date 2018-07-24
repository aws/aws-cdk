import { expect, haveResource } from '@aws-cdk/assert';
import codecommit = require('@aws-cdk/aws-codecommit');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codebuild = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
    'default properties': {
        'with CodePipeline source'(test: Test) {
            const stack = new cdk.Stack();

            const source = new codebuild.CodePipelineSource();
            new codebuild.BuildProject(stack, 'MyProject', {
                source
            });

            expect(stack).toMatch({
              "Resources": {
                "MyProjectRole9BBE5233": {
                  "Type": "AWS::IAM::Role",
                  "Properties": {
                    "AssumeRolePolicyDocument": {
                      "Statement": [
                        {
                          "Action": "sts:AssumeRole",
                          "Effect": "Allow",
                          "Principal": {
                            "Service": "codebuild.amazonaws.com"
                          }
                        }
                      ],
                      "Version": "2012-10-17"
                    }
                  }
                },
                "MyProjectRoleDefaultPolicyB19B7C29": {
                  "Type": "AWS::IAM::Policy",
                  "Properties": {
                    "PolicyDocument": {
                      "Statement": [
                        {
                          "Action": [
                            "logs:CreateLogGroup",
                            "logs:CreateLogStream",
                            "logs:PutLogEvents"
                          ],
                          "Effect": "Allow",
                          "Resource": [
                            {
                              "Fn::Join": [
                                "",
                                [
                                  "arn",
                                  ":",
                                  {
                                    "Ref": "AWS::Partition"
                                  },
                                  ":",
                                  "logs",
                                  ":",
                                  {
                                    "Ref": "AWS::Region"
                                  },
                                  ":",
                                  {
                                    "Ref": "AWS::AccountId"
                                  },
                                  ":",
                                  "log-group",
                                  ":",
                                  {
                                    "Fn::Join": [
                                      "",
                                      [
                                        "/aws/codebuild/",
                                        {
                                          "Ref": "MyProject39F7B0AE"
                                        }
                                      ]
                                    ]
                                  }
                                ]
                              ]
                            },
                            {
                              "Fn::Join": [
                                "",
                                [
                                  {
                                    "Fn::Join": [
                                      "",
                                      [
                                        "arn",
                                        ":",
                                        {
                                          "Ref": "AWS::Partition"
                                        },
                                        ":",
                                        "logs",
                                        ":",
                                        {
                                          "Ref": "AWS::Region"
                                        },
                                        ":",
                                        {
                                          "Ref": "AWS::AccountId"
                                        },
                                        ":",
                                        "log-group",
                                        ":",
                                        {
                                          "Fn::Join": [
                                            "",
                                            [
                                              "/aws/codebuild/",
                                              {
                                                "Ref": "MyProject39F7B0AE"
                                              }
                                            ]
                                          ]
                                        }
                                      ]
                                    ]
                                  },
                                  ":*"
                                ]
                              ]
                            }
                          ]
                        }
                      ],
                      "Version": "2012-10-17"
                    },
                    "PolicyName": "MyProjectRoleDefaultPolicyB19B7C29",
                    "Roles": [
                      {
                        "Ref": "MyProjectRole9BBE5233"
                      }
                    ]
                  }
                },
                "MyProject39F7B0AE": {
                  "Type": "AWS::CodeBuild::Project",
                  "Properties": {
                    "Source": {
                      "Type": "CODEPIPELINE"
                    },
                    "Artifacts": {
                      "Type": "CODEPIPELINE"
                    },
                    "ServiceRole": {
                      "Fn::GetAtt": [
                        "MyProjectRole9BBE5233",
                        "Arn"
                      ]
                    },
                    "Environment": {
                      "Type": "LINUX_CONTAINER",
                      "PrivilegedMode": false,
                      "Image": "aws/codebuild/ubuntu-base:14.04",
                      "ComputeType": "BUILD_GENERAL1_SMALL"
                    }
                  }
                }
              }
            });

            test.done();
        },
        'with CodeCommit source'(test: Test) {
            const stack = new cdk.Stack();

            const repo = new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'hello-cdk' });

            const source = new codebuild.CodeCommitSource(repo);

            new codebuild.BuildProject(stack, 'MyProject', {
                source
            });

            expect(stack).toMatch({
              "Resources": {
                "MyRepoF4F48043": {
                  "Type": "AWS::CodeCommit::Repository",
                  "Properties": {
                    "RepositoryName": "hello-cdk",
                    "Triggers": []
                  }
                },
                "MyProjectRole9BBE5233": {
                  "Type": "AWS::IAM::Role",
                  "Properties": {
                    "AssumeRolePolicyDocument": {
                      "Statement": [
                        {
                          "Action": "sts:AssumeRole",
                          "Effect": "Allow",
                          "Principal": {
                            "Service": "codebuild.amazonaws.com"
                          }
                        }
                      ],
                      "Version": "2012-10-17"
                    }
                  }
                },
                "MyProjectRoleDefaultPolicyB19B7C29": {
                  "Type": "AWS::IAM::Policy",
                  "Properties": {
                    "PolicyDocument": {
                      "Statement": [
                        {
                          "Action": "codecommit:GitPull",
                          "Effect": "Allow",
                          "Resource": {
                            "Fn::GetAtt": [
                              "MyRepoF4F48043",
                              "Arn"
                            ]
                          }
                        },
                        {
                          "Action": [
                            "logs:CreateLogGroup",
                            "logs:CreateLogStream",
                            "logs:PutLogEvents"
                          ],
                          "Effect": "Allow",
                          "Resource": [
                            {
                              "Fn::Join": [
                                "",
                                [
                                  "arn",
                                  ":",
                                  {
                                    "Ref": "AWS::Partition"
                                  },
                                  ":",
                                  "logs",
                                  ":",
                                  {
                                    "Ref": "AWS::Region"
                                  },
                                  ":",
                                  {
                                    "Ref": "AWS::AccountId"
                                  },
                                  ":",
                                  "log-group",
                                  ":",
                                  {
                                    "Fn::Join": [
                                      "",
                                      [
                                        "/aws/codebuild/",
                                        {
                                          "Ref": "MyProject39F7B0AE"
                                        }
                                      ]
                                    ]
                                  }
                                ]
                              ]
                            },
                            {
                              "Fn::Join": [
                                "",
                                [
                                  {
                                    "Fn::Join": [
                                      "",
                                      [
                                        "arn",
                                        ":",
                                        {
                                          "Ref": "AWS::Partition"
                                        },
                                        ":",
                                        "logs",
                                        ":",
                                        {
                                          "Ref": "AWS::Region"
                                        },
                                        ":",
                                        {
                                          "Ref": "AWS::AccountId"
                                        },
                                        ":",
                                        "log-group",
                                        ":",
                                        {
                                          "Fn::Join": [
                                            "",
                                            [
                                              "/aws/codebuild/",
                                              {
                                                "Ref": "MyProject39F7B0AE"
                                              }
                                            ]
                                          ]
                                        }
                                      ]
                                    ]
                                  },
                                  ":*"
                                ]
                              ]
                            }
                          ]
                        }
                      ],
                      "Version": "2012-10-17"
                    },
                    "PolicyName": "MyProjectRoleDefaultPolicyB19B7C29",
                    "Roles": [
                      {
                        "Ref": "MyProjectRole9BBE5233"
                      }
                    ]
                  }
                },
                "MyProject39F7B0AE": {
                  "Type": "AWS::CodeBuild::Project",
                  "Properties": {
                    "Source": {
                      "Type": "CODECOMMIT",
                      "Location": {
                        "Fn::GetAtt": [
                          "MyRepoF4F48043",
                          "CloneUrlHttp"
                        ]
                      }
                    },
                    "Artifacts": {
                      "Type": "NO_ARTIFACTS"
                    },
                    "ServiceRole": {
                      "Fn::GetAtt": [
                        "MyProjectRole9BBE5233",
                        "Arn"
                      ]
                    },
                    "Environment": {
                      "Type": "LINUX_CONTAINER",
                      "PrivilegedMode": false,
                      "Image": "aws/codebuild/ubuntu-base:14.04",
                      "ComputeType": "BUILD_GENERAL1_SMALL"
                    }
                  }
                }
              }
            });
            test.done();
        },
        'with S3Bucket source'(test: Test) {
            const stack = new cdk.Stack();
            const bucket = new s3.Bucket(stack, 'MyBucket');

            new codebuild.BuildProject(stack, 'MyProject', {
              source: new codebuild.S3BucketSource(bucket, 'path/to/source.zip')
            });

            expect(stack).toMatch({
              "Resources": {
                "MyBucketF68F3FF0": {
                  "Type": "AWS::S3::Bucket"
                },
                "MyProjectRole9BBE5233": {
                  "Type": "AWS::IAM::Role",
                  "Properties": {
                    "AssumeRolePolicyDocument": {
                      "Statement": [
                        {
                          "Action": "sts:AssumeRole",
                          "Effect": "Allow",
                          "Principal": {
                            "Service": "codebuild.amazonaws.com"
                          }
                        }
                      ],
                      "Version": "2012-10-17"
                    }
                  }
                },
                "MyProjectRoleDefaultPolicyB19B7C29": {
                  "Type": "AWS::IAM::Policy",
                  "Properties": {
                    "PolicyDocument": {
                      "Statement": [
                        {
                          "Action": [
                            "s3:GetObject*",
                            "s3:GetBucket*",
                            "s3:List*"
                          ],
                          "Effect": "Allow",
                          "Resource": [
                            {
                              "Fn::GetAtt": [
                                "MyBucketF68F3FF0",
                                "Arn"
                              ]
                            },
                            {
                              "Fn::Join": [
                                "",
                                [
                                  {
                                    "Fn::GetAtt": [
                                      "MyBucketF68F3FF0",
                                      "Arn"
                                    ]
                                  },
                                  "/",
                                  "*"
                                ]
                              ]
                            }
                          ]
                        },
                        {
                          "Action": [
                            "logs:CreateLogGroup",
                            "logs:CreateLogStream",
                            "logs:PutLogEvents"
                          ],
                          "Effect": "Allow",
                          "Resource": [
                            {
                              "Fn::Join": [
                                "",
                                [
                                  "arn",
                                  ":",
                                  {
                                    "Ref": "AWS::Partition"
                                  },
                                  ":",
                                  "logs",
                                  ":",
                                  {
                                    "Ref": "AWS::Region"
                                  },
                                  ":",
                                  {
                                    "Ref": "AWS::AccountId"
                                  },
                                  ":",
                                  "log-group",
                                  ":",
                                  {
                                    "Fn::Join": [
                                      "",
                                      [
                                        "/aws/codebuild/",
                                        {
                                          "Ref": "MyProject39F7B0AE"
                                        }
                                      ]
                                    ]
                                  }
                                ]
                              ]
                            },
                            {
                              "Fn::Join": [
                                "",
                                [
                                  {
                                    "Fn::Join": [
                                      "",
                                      [
                                        "arn",
                                        ":",
                                        {
                                          "Ref": "AWS::Partition"
                                        },
                                        ":",
                                        "logs",
                                        ":",
                                        {
                                          "Ref": "AWS::Region"
                                        },
                                        ":",
                                        {
                                          "Ref": "AWS::AccountId"
                                        },
                                        ":",
                                        "log-group",
                                        ":",
                                        {
                                          "Fn::Join": [
                                            "",
                                            [
                                              "/aws/codebuild/",
                                              {
                                                "Ref": "MyProject39F7B0AE"
                                              }
                                            ]
                                          ]
                                        }
                                      ]
                                    ]
                                  },
                                  ":*"
                                ]
                              ]
                            }
                          ]
                        }
                      ],
                      "Version": "2012-10-17"
                    },
                    "PolicyName": "MyProjectRoleDefaultPolicyB19B7C29",
                    "Roles": [
                      {
                        "Ref": "MyProjectRole9BBE5233"
                      }
                    ]
                  }
                },
                "MyProject39F7B0AE": {
                  "Type": "AWS::CodeBuild::Project",
                  "Properties": {
                    "Source": {
                      "Type": "S3",
                      "Location": {
                        "Fn::Join": [
                          "",
                          [
                            {
                              "Ref": "MyBucketF68F3FF0"
                            },
                            "/",
                            "path/to/source.zip"
                          ]
                        ]
                      }
                    },
                    "Artifacts": {
                      "Type": "NO_ARTIFACTS"
                    },
                    "ServiceRole": {
                      "Fn::GetAtt": [
                        "MyProjectRole9BBE5233",
                        "Arn"
                      ]
                    },
                    "Environment": {
                      "Type": "LINUX_CONTAINER",
                      "PrivilegedMode": false,
                      "Image": "aws/codebuild/ubuntu-base:14.04",
                      "ComputeType": "BUILD_GENERAL1_SMALL"
                    }
                  }
                }
              }
            });
            test.done();
        }
    },

    'artifacts': {
        'CodePipeline': {
            'both source and artifacs are set to CodePipeline'(test: Test) {
                const stack = new cdk.Stack();

                new codebuild.BuildProject(stack, 'MyProject', {
                    source: new codebuild.CodePipelineSource(),
                    artifacts: new codebuild.CodePipelineBuildArtifacts()
                });

                expect(stack).to(haveResource('AWS::CodeBuild::Project', {
                  "Source": {
                    "Type": "CODEPIPELINE"
                  },
                  "Artifacts": {
                    "Type": "CODEPIPELINE"
                  },
                  "ServiceRole": {
                    "Fn::GetAtt": [
                      "MyProjectRole9BBE5233",
                      "Arn"
                    ]
                  },
                  "Environment": {
                    "Type": "LINUX_CONTAINER",
                    "PrivilegedMode": false,
                    "Image": "aws/codebuild/ubuntu-base:14.04",
                    "ComputeType": "BUILD_GENERAL1_SMALL"
                  }
                }));

                test.done();
            },

            'if sourcde is set to CodePipeline, and artifacts are not set, they are defaulted to CodePipeline'(test: Test) {
                const stack = new cdk.Stack();

                new codebuild.BuildProject(stack, 'MyProject', {
                    source: new codebuild.CodePipelineSource()
                });

                expect(stack).to(haveResource('AWS::CodeBuild::Project', {
                  "Source": {
                    "Type": "CODEPIPELINE"
                  },
                  "Artifacts": {
                    "Type": "CODEPIPELINE"
                  },
                  "ServiceRole": {
                    "Fn::GetAtt": [
                      "MyProjectRole9BBE5233",
                      "Arn"
                    ]
                  },
                  "Environment": {
                    "Type": "LINUX_CONTAINER",
                    "PrivilegedMode": false,
                    "Image": "aws/codebuild/ubuntu-base:14.04",
                    "ComputeType": "BUILD_GENERAL1_SMALL"
                  }
                }));

                test.done();
            },

            'fails if one of source/artifacts is set to CodePipeline and the other isn\'t'(test: Test) {
                  const stack = new cdk.Stack();

                  test.throws(() => new codebuild.BuildProject(stack, 'MyProject', {
                      source: new codebuild.CodePipelineSource(),
                      artifacts: new codebuild.NoBuildArtifacts()
                  }), /Both source and artifacts must be set to CodePipeline/);

                  test.throws(() => new codebuild.BuildProject(stack, 'YourProject', {
                      source: new codebuild.CodeCommitSource(new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'boo' })),
                      artifacts: new codebuild.CodePipelineBuildArtifacts()
                  }), /Both source and artifacts must be set to CodePipeline/);

                  test.done();
            }
        }
    },

    'events'(test: Test) {
        const stack = new cdk.Stack();
        const project = new codebuild.BuildProject(stack, 'MyProject', {
            source: new codebuild.CodePipelineSource()
        });

        project.onBuildFailed('OnBuildFailed');
        project.onBuildSucceeded('OnBuildSucceeded');
        project.onPhaseChange('OnPhaseChange');
        project.onStateChange('OnStateChange');
        project.onBuildStarted('OnBuildStarted');

        expect(stack).to(haveResource('AWS::Events::Rule', {
            "EventPattern": {
              "source": [
                "aws.codebuild"
              ],
              "detail-type": [
                "CodeBuild Build State Change"
              ],
              "detail": {
                "project-name": [
                  {
                    "Ref": "MyProject39F7B0AE"
                  }
                ],
                "build-status": [
                  "FAILED"
                ]
              }
            },
            "State": "ENABLED"
        }));

        expect(stack).to(haveResource('AWS::Events::Rule', {
            "EventPattern": {
              "source": [
                "aws.codebuild"
              ],
              "detail-type": [
                "CodeBuild Build State Change"
              ],
              "detail": {
                "project-name": [
                  {
                    "Ref": "MyProject39F7B0AE"
                  }
                ],
                "build-status": [
                  "SUCCEEDED"
                ]
              }
            },
            "State": "ENABLED"
        }));

        expect(stack).to(haveResource('AWS::Events::Rule', {
            "EventPattern": {
              "source": [
                "aws.codebuild"
              ],
              "detail-type": [
                "CodeBuild Build Phase Change"
              ],
              "detail": {
                "project-name": [
                  {
                    "Ref": "MyProject39F7B0AE"
                  }
                ]
              }
            },
            "State": "ENABLED"
        }));

        expect(stack).to(haveResource('AWS::Events::Rule', {
            "EventPattern": {
              "source": [
                "aws.codebuild"
              ],
              "detail-type": [
                "CodeBuild Build State Change"
              ],
              "detail": {
                "project-name": [
                  {
                    "Ref": "MyProject39F7B0AE"
                  }
                ]
              }
            },
            "State": "ENABLED"
        }));

        expect(stack).to(haveResource('AWS::Events::Rule', {
          "EventPattern": {
            "source": [
              "aws.codebuild"
            ],
            "detail-type": [
              "CodeBuild Build State Change"
            ],
            "detail": {
              "project-name": [
                {
                  "Ref": "MyProject39F7B0AE"
                }
              ],
              "build-status": [
                "IN_PROGRESS"
              ]
            }
          },
          "State": "ENABLED"
        }));

        test.done();
    },

    'environment variables can be overridden at the project level'(test: Test) {
        const stack = new cdk.Stack();

        new codebuild.BuildProject(stack, 'Project', {
          source: new codebuild.CodePipelineSource(),
          environment: {
            environmentVariables: {
              FOO: { value: '1234' },
              BAR: { value: new cdk.FnConcat('111', '222'), type: codebuild.BuildEnvironmentVariableType.ParameterStore }
            }
          },
          environmentVariables: {
            GOO: { value: 'ABC' },
            FOO: { value: 'OVERRIDE!' }
          }
        });

        expect(stack).to(haveResource('AWS::CodeBuild::Project', {
          "Source": {
            "Type": "CODEPIPELINE"
          },
          "Artifacts": {
            "Type": "CODEPIPELINE"
          },
          "ServiceRole": {
            "Fn::GetAtt": [
              "ProjectRole4CCB274E",
              "Arn"
            ]
          },
          "Environment": {
            "Type": "LINUX_CONTAINER",
            "EnvironmentVariables": [
              {
                "Type": "PLAINTEXT",
                "Value": "OVERRIDE!",
                "Name": "FOO"
              },
              {
                "Type": "PARAMETER_STORE",
                "Value": {
                  "Fn::Join": [
                    "",
                    [
                      "111",
                      "222"
                    ]
                  ]
                },
                "Name": "BAR"
              },
              {
                "Type": "PLAINTEXT",
                "Value": "ABC",
                "Name": "GOO"
              }
            ],
            "PrivilegedMode": false,
            "Image": "aws/codebuild/ubuntu-base:14.04",
            "ComputeType": "BUILD_GENERAL1_SMALL"
          }
        }));

        test.done();
    }
};
