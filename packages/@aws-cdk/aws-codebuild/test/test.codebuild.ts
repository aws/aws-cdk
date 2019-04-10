import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import codecommit = require('@aws-cdk/aws-codecommit');
import ec2 = require('@aws-cdk/aws-ec2');
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
      new codebuild.Project(stack, 'MyProject', {
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
              "Service": { "Fn::Join": ["", ["codebuild.", { Ref: "AWS::URLSuffix" }]] }
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
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":logs:",
                        {
                          "Ref": "AWS::Region"
                        },
                        ":",
                        {
                          "Ref": "AWS::AccountId"
                        },
                        ":log-group:/aws/codebuild/",
                        {
                          "Ref": "MyProject39F7B0AE"
                        }
                      ]
                    ]
                  },
                  {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":logs:",
                        {
                          "Ref": "AWS::Region"
                        },
                        ":",
                        {
                          "Ref": "AWS::AccountId"
                        },
                        ":log-group:/aws/codebuild/",
                        {
                          "Ref": "MyProject39F7B0AE"
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
            "Image": "aws/codebuild/standard:1.0",
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

      const source = new codebuild.CodeCommitSource({ repository: repo, cloneDepth: 2 });

      new codebuild.Project(stack, 'MyProject', {
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
              "Service": { "Fn::Join": ["", ["codebuild.", { Ref: "AWS::URLSuffix" }]] }
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
                  "arn:",
                  {
                  "Ref": "AWS::Partition"
                  },
                  ":logs:",
                  {
                  "Ref": "AWS::Region"
                  },
                  ":",
                  {
                  "Ref": "AWS::AccountId"
                  },
                  ":log-group:/aws/codebuild/",
                  {
                    "Ref": "MyProject39F7B0AE"
                  }
                ]
                ]
              },
              {
                "Fn::Join": [
                "",
                [
                  "arn:",
                  {
                  "Ref": "AWS::Partition"
                  },
                  ":logs:",
                  {
                  "Ref": "AWS::Region"
                  },
                  ":",
                  {
                  "Ref": "AWS::AccountId"
                  },
                  ":log-group:/aws/codebuild/",
                  {
                    "Ref": "MyProject39F7B0AE"
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
          "Artifacts": {
            "Type": "NO_ARTIFACTS"
          },
          "Environment": {
            "ComputeType": "BUILD_GENERAL1_SMALL",
            "Image": "aws/codebuild/standard:1.0",
            "PrivilegedMode": false,
            "Type": "LINUX_CONTAINER"
          },
          "ServiceRole": {
            "Fn::GetAtt": [
            "MyProjectRole9BBE5233",
            "Arn"
            ]
          },
          "Source": {
            "Location": {
            "Fn::GetAtt": [
              "MyRepoF4F48043",
              "CloneUrlHttp"
            ]
            },
            "GitCloneDepth": 2,
            "Type": "CODECOMMIT"
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

      new codebuild.Project(stack, 'MyProject', {
        source: new codebuild.S3BucketSource({
          bucket,
          path: 'path/to/source.zip',
        }),
        environment: {
          buildImage: codebuild.WindowsBuildImage.WIN_SERVER_CORE_2016_BASE,
        },
      });

      expect(stack).toMatch({
        "Resources": {
        "MyBucketF68F3FF0": {
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain"
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
              "Service": { "Fn::Join": ["", ["codebuild.", { Ref: "AWS::URLSuffix" }]] }
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
                  "/*"
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
                  "arn:",
                  {
                  "Ref": "AWS::Partition"
                  },
                  ":logs:",
                  {
                  "Ref": "AWS::Region"
                  },
                  ":",
                  {
                  "Ref": "AWS::AccountId"
                  },
                  ":log-group:/aws/codebuild/",
                  {
                    "Ref": "MyProject39F7B0AE"
                  }
                ]
                ]
              },
              {
                "Fn::Join": [
                "",
                [
                  "arn:",
                  {
                  "Ref": "AWS::Partition"
                  },
                  ":logs:",
                  {
                  "Ref": "AWS::Region"
                  },
                  ":",
                  {
                  "Ref": "AWS::AccountId"
                  },
                  ":log-group:/aws/codebuild/",
                  {
                    "Ref": "MyProject39F7B0AE"
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
          "Artifacts": {
            "Type": "NO_ARTIFACTS"
          },
          "Environment": {
            "ComputeType": "BUILD_GENERAL1_MEDIUM",
            "Image": "aws/codebuild/windows-base:1.0",
            "PrivilegedMode": false,
            "Type": "WINDOWS_CONTAINER"
          },
          "ServiceRole": {
            "Fn::GetAtt": [
            "MyProjectRole9BBE5233",
            "Arn"
            ]
          },
          "Source": {
            "Location": {
            "Fn::Join": [
              "",
              [
              {
                "Ref": "MyBucketF68F3FF0"
              },
              "/path/to/source.zip"
              ]
            ]
            },
            "Type": "S3"
          }
          }
        }
        }
      });
      test.done();
    },
    'fail creating a Project when no build spec is given'(test: Test) {
      const stack = new cdk.Stack();

      test.throws(() => {
        new codebuild.Project(stack, 'MyProject', {
        });
      }, /buildSpec/);

      test.done();
    },
    'with VPC configuration'(test: Test) {
      const stack = new cdk.Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket');
      const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
      const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
          groupName: 'Bob',
          vpc,
          allowAllOutbound: true,
          description: 'Example',
      });
      new codebuild.Project(stack, 'MyProject', {
        source: new codebuild.S3BucketSource({
          bucket,
          path: 'path/to/source.zip',
        }),
        vpc,
        securityGroups: [securityGroup]
      });
      expect(stack).to(haveResourceLike("AWS::CodeBuild::Project", {
        "VpcConfig": {
          "SecurityGroupIds": [
            {
              "Fn::GetAtt": [
                "SecurityGroup1F554B36F",
                "GroupId"
              ]
            }
          ],
          "Subnets": [
            {
              "Ref": "MyVPCPrivateSubnet1Subnet641543F4"
            },
            {
              "Ref": "MyVPCPrivateSubnet2SubnetA420D3F0"
            },
            {
              "Ref": "MyVPCPrivateSubnet3SubnetE1B8B1B4"
            }
          ],
          "VpcId": {
            "Ref": "MyVPCAFB07A31"
          }
        }
      }));
      test.done();
    },
    'without VPC configuration but security group identified'(test: Test) {
      const stack = new cdk.Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket');
      const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
      const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
          groupName: 'Bob',
          vpc,
          allowAllOutbound: true,
          description: 'Example',
      });

      test.throws(() =>
        new codebuild.Project(stack, 'MyProject', {
          source: new codebuild.S3BucketSource({
            bucket,
            path: 'path/to/source.zip',
          }),
          securityGroups: [securityGroup]
        })
      , /Cannot configure 'securityGroup' or 'allowAllOutbound' without configuring a VPC/);
      test.done();
    },
    'with VPC configuration but allowAllOutbound identified'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const vpc = new ec2.VpcNetwork(stack, 'MyVPC');
      const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
          groupName: 'Bob',
          vpc,
          allowAllOutbound: true,
          description: 'Example',
      });
      test.throws(() =>
        new codebuild.Project(stack, 'MyProject', {
          source: new codebuild.S3BucketSource({
            bucket,
            path: 'path/to/source.zip',
          }),
          vpc,
          allowAllOutbound: true,
          securityGroups: [securityGroup]
        })
      , /Configure 'allowAllOutbound' directly on the supplied SecurityGroup/);
      test.done();
    }
  },

  'using timeout and path in S3 artifacts sets it correctly'(test: Test) {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    new codebuild.Project(stack, 'Project', {
      buildSpec: {
        version: '0.2',
      },
      artifacts: new codebuild.S3BucketBuildArtifacts({
        path: 'some/path',
        name: 'some_name',
        bucket,
      }),
      timeout: 123,
    });

    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      "Artifacts": {
        "Path": "some/path",
        "Name": "some_name",
        "Type": "S3",
      },
      "TimeoutInMinutes": 123,
    }));

    test.done();
  },

  'secondary sources': {
    'require providing an identifier when creating a Project'(test: Test) {
      const stack = new cdk.Stack();

      test.throws(() => {
        new codebuild.Project(stack, 'MyProject', {
          buildSpec: {
            version: '0.2',
          },
          secondarySources: [
            new codebuild.CodePipelineSource(),
          ],
        });
      }, /identifier/);

      test.done();
    },

    'are not allowed for a Project with CodePipeline as Source'(test: Test) {
      const stack = new cdk.Stack();
      const project = new codebuild.Project(stack, 'MyProject', {
        source: new codebuild.CodePipelineSource(),
      });

      project.addSecondarySource(new codebuild.S3BucketSource({
        bucket: new s3.Bucket(stack, 'MyBucket'),
        path: 'some/path',
        identifier: 'id',
      }));

      test.throws(() => {
        expect(stack);
      }, /secondary sources/);

      test.done();
    },

    'added with an identifer after the Project has been created are rendered in the template'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const project = new codebuild.Project(stack, 'MyProject', {
        source: new codebuild.S3BucketSource({
          bucket,
          path: 'some/path',
        }),
      });

      project.addSecondarySource(new codebuild.S3BucketSource({
        bucket,
        path: 'another/path',
        identifier: 'source1',
      }));

      expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
        "SecondarySources": [
          {
            "SourceIdentifier": "source1",
            "Type": "S3",
          },
        ],
      }));

      test.done();
    },
  },

  'secondary artifacts': {
    'require providing an identifier when creating a Project'(test: Test) {
      const stack = new cdk.Stack();

      test.throws(() => {
        new codebuild.Project(stack, 'MyProject', {
          buildSpec: {
            version: '0.2',
          },
          secondaryArtifacts: [
            new codebuild.S3BucketBuildArtifacts({
              bucket: new s3.Bucket(stack, 'MyBucket'),
              path: 'some/path',
              name: 'name',
            }),
          ],
        });
      }, /identifier/);

      test.done();
    },

    'are not allowed for a Project with CodePipeline as Source'(test: Test) {
      const stack = new cdk.Stack();
      const project = new codebuild.Project(stack, 'MyProject', {
        source: new codebuild.CodePipelineSource(),
      });

      project.addSecondaryArtifact(new codebuild.S3BucketBuildArtifacts({
        bucket: new s3.Bucket(stack, 'MyBucket'),
        path: 'some/path',
        name: 'name',
        identifier: 'id',
      }));

      test.throws(() => {
        expect(stack);
      }, /secondary artifacts/);

      test.done();
    },

    'added with an identifier after the Project has been created are rendered in the template'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const project = new codebuild.Project(stack, 'MyProject', {
        source: new codebuild.S3BucketSource({
          bucket,
          path: 'some/path',
        }),
      });

      project.addSecondaryArtifact(new codebuild.S3BucketBuildArtifacts({
        bucket,
        path: 'another/path',
        name: 'name',
        identifier: 'artifact1',
      }));

      expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
        "SecondaryArtifacts": [
          {
            "ArtifactIdentifier": "artifact1",
            "Type": "S3",
          },
        ],
      }));

      test.done();
    },
  },

  'artifacts': {
    'CodePipeline': {
      'both source and artifacs are set to CodePipeline'(test: Test) {
        const stack = new cdk.Stack();

        new codebuild.Project(stack, 'MyProject', {
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
          "Image": "aws/codebuild/standard:1.0",
          "ComputeType": "BUILD_GENERAL1_SMALL"
          }
        }));

        test.done();
      },

      'if source is set to CodePipeline, and artifacts are not set, they are defaulted to CodePipeline'(test: Test) {
        const stack = new cdk.Stack();

        new codebuild.Project(stack, 'MyProject', {
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
          "Image": "aws/codebuild/standard:1.0",
          "ComputeType": "BUILD_GENERAL1_SMALL"
          }
        }));

        test.done();
      },

      'fails if one of source/artifacts is set to CodePipeline and the other isn\'t'(test: Test) {
          const stack = new cdk.Stack();

          test.throws(() => new codebuild.Project(stack, 'MyProject', {
            source: new codebuild.CodePipelineSource(),
            artifacts: new codebuild.NoBuildArtifacts()
          }), /Both source and artifacts must be set to CodePipeline/);

          test.throws(() => new codebuild.Project(stack, 'YourProject', {
            source: new codebuild.CodeCommitSource({
              repository: new codecommit.Repository(stack, 'MyRepo', { repositoryName: 'boo' })
            }),
            artifacts: new codebuild.CodePipelineBuildArtifacts()
          }), /Both source and artifacts must be set to CodePipeline/);

          test.done();
      }
    }
  },

  'events'(test: Test) {
    const stack = new cdk.Stack();
    const project = new codebuild.Project(stack, 'MyProject', {
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

    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource(),
      environment: {
        environmentVariables: {
          FOO: { value: '1234' },
          BAR: { value: `111${new cdk.Token({ twotwotwo: '222' })}`, type: codebuild.BuildEnvironmentVariableType.ParameterStore }
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
            { twotwotwo: "222" }
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
      "Image": "aws/codebuild/standard:1.0",
      "ComputeType": "BUILD_GENERAL1_SMALL"
      }
    }));

    test.done();
  },

  '.metricXxx() methods can be used to obtain Metrics for CodeBuild projects'(test: Test) {
    const stack = new cdk.Stack();

    const project = new codebuild.Project(stack, 'MyBuildProject', { source: new codebuild.CodePipelineSource() });

    const metricBuilds = project.metricBuilds();
    test.same(metricBuilds.dimensions!.ProjectName, project.projectName);
    test.deepEqual(metricBuilds.namespace, 'AWS/CodeBuild');
    test.deepEqual(metricBuilds.statistic, 'Sum', 'default stat is SUM');
    test.deepEqual(metricBuilds.metricName, 'Builds');

    const metricDuration = project.metricDuration({ label: 'hello' });

    test.deepEqual(metricDuration.metricName, 'Duration');
    test.deepEqual(metricDuration.label, 'hello');

    test.deepEqual(project.metricFailedBuilds().metricName, 'FailedBuilds');
    test.deepEqual(project.metricSucceededBuilds().metricName, 'SucceededBuilds');

    test.done();
  },

  'using ComputeType.Small with a Windows image fails validation'(test: Test) {
    const stack = new cdk.Stack();
    const invalidEnvironment: codebuild.BuildEnvironment = {
      buildImage: codebuild.WindowsBuildImage.WIN_SERVER_CORE_2016_BASE,
      computeType: codebuild.ComputeType.Small,
    };

    test.throws(() => {
      new codebuild.Project(stack, 'MyProject', {
        source: new codebuild.CodePipelineSource(),
        environment: invalidEnvironment,
      });
    }, /Windows images do not support the Small ComputeType/);

    test.done();
  }
};
