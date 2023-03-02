import { CodeBuild } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockUpdateProject: (params: CodeBuild.UpdateProjectInput) => CodeBuild.UpdateProjectOutput;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateProject = jest.fn();
  hotswapMockSdkProvider.setUpdateProjectMock(mockUpdateProject);
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('returns undefined when a new CodeBuild Project is added to the Stack', async () => {
    // GIVEN
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateProject).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateProject).not.toHaveBeenCalled();
    }
  });

  test('calls the updateProject() API when it receives only a source difference in a CodeBuild project', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
            Name: 'my-project',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'new-spec',
                Type: 'NO_SOURCE',
              },
              Name: 'my-project',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateProject).toHaveBeenCalledWith({
      name: 'my-project',
      source: {
        type: 'NO_SOURCE',
        buildspec: 'new-spec',
      },
    });
  });

  test('calls the updateProject() API when it receives only a source version difference in a CodeBuild project', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
            Name: 'my-project',
            SourceVersion: 'v1',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'current-spec',
                Type: 'NO_SOURCE',
              },
              Name: 'my-project',
              SourceVersion: 'v2',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateProject).toHaveBeenCalledWith({
      name: 'my-project',
      sourceVersion: 'v2',
    });
  });

  test('calls the updateProject() API when it receives only an environment difference in a CodeBuild project', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
            Name: 'my-project',
            Environment: {
              ComputeType: 'BUILD_GENERAL1_SMALL',
              EnvironmentVariables: [
                {
                  Name: 'SUPER_IMPORTANT_ENV_VAR',
                  Type: 'PLAINTEXT',
                  Value: 'super cool value',
                },
                {
                  Name: 'SECOND_IMPORTANT_ENV_VAR',
                  Type: 'PLAINTEXT',
                  Value: 'yet another super cool value',
                },
              ],
              Image: 'aws/codebuild/standard:1.0',
              ImagePullCredentialsType: 'CODEBUILD',
              PrivilegedMode: false,
              Type: 'LINUX_CONTAINER',
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'current-spec',
                Type: 'NO_SOURCE',
              },
              Name: 'my-project',
              Environment: {
                ComputeType: 'BUILD_GENERAL1_SMALL',
                EnvironmentVariables: [
                  {
                    Name: 'SUPER_IMPORTANT_ENV_VAR',
                    Type: 'PLAINTEXT',
                    Value: 'changed value',
                  },
                  {
                    Name: 'NEW_IMPORTANT_ENV_VAR',
                    Type: 'PLAINTEXT',
                    Value: 'new value',
                  },
                ],
                Image: 'aws/codebuild/standard:1.0',
                ImagePullCredentialsType: 'CODEBUILD',
                PrivilegedMode: false,
                Type: 'LINUX_CONTAINER',
              },
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateProject).toHaveBeenCalledWith({
      name: 'my-project',
      environment: {
        computeType: 'BUILD_GENERAL1_SMALL',
        environmentVariables: [
          {
            name: 'SUPER_IMPORTANT_ENV_VAR',
            type: 'PLAINTEXT',
            value: 'changed value',
          },
          {
            name: 'NEW_IMPORTANT_ENV_VAR',
            type: 'PLAINTEXT',
            value: 'new value',
          },
        ],
        image: 'aws/codebuild/standard:1.0',
        imagePullCredentialsType: 'CODEBUILD',
        privilegedMode: false,
        type: 'LINUX_CONTAINER',
      },
    });
  });

  test("correctly evaluates the project's name when it references a different resource from the template", async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
        },
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
            Name: {
              'Fn::Join': ['-', [
                { Ref: 'Bucket' },
                'project',
              ]],
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(setup.stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'mybucket'));
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Bucket: {
            Type: 'AWS::S3::Bucket',
          },
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'new-spec',
                Type: 'NO_SOURCE',
              },
              Name: {
                'Fn::Join': ['-', [
                  { Ref: 'Bucket' },
                  'project',
                ]],
              },
            },
            Metadata: {
              'aws:asset:path': 'old-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateProject).toHaveBeenCalledWith({
      name: 'mybucket-project',
      source: {
        type: 'NO_SOURCE',
        buildspec: 'new-spec',
      },
    });
  });

  test("correctly falls back to taking the project's name from the current stack if it can't evaluate it in the template", async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Parameters: {
        Param1: { Type: 'String' },
        AssetBucketParam: { Type: 'String' },
      },
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
            Name: { Ref: 'Param1' },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(setup.stackSummaryOf('CodeBuildProject', 'AWS::CodeBuild::Project', 'my-project'));
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Parameters: {
          Param1: { Type: 'String' },
          AssetBucketParam: { Type: 'String' },
        },
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'new-spec',
                Type: 'NO_SOURCE',
              },
              Name: { Ref: 'Param1' },
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact, { AssetBucketParam: 'asset-bucket' });

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateProject).toHaveBeenCalledWith({
      name: 'my-project',
      source: {
        type: 'NO_SOURCE',
        buildspec: 'new-spec',
      },
    });
  });

  test("will not perform a hotswap deployment if it cannot find a Ref target (outside the project's name)", async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Parameters: {
        Param1: { Type: 'String' },
      },
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: { 'Fn::Sub': '${Param1}' },
              Type: 'NO_SOURCE',
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(setup.stackSummaryOf('CodeBuildProject', 'AWS::CodeBuild::Project', 'my-project'));
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Parameters: {
          Param1: { Type: 'String' },
        },
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: { 'Fn::Sub': '${Param1}' },
                Type: 'CODEPIPELINE',
              },
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // THEN
    await expect(() =>
      hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact),
    ).rejects.toThrow(/Parameter or resource 'Param1' could not be found for evaluation/);
  });

  test("will not perform a hotswap deployment if it doesn't know how to handle a specific attribute (outside the project's name)", async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
        },
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: { 'Fn::GetAtt': ['Bucket', 'UnknownAttribute'] },
              Type: 'NO_SOURCE',
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('CodeBuildProject', 'AWS::CodeBuild::Project', 'my-project'),
      setup.stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'my-bucket'),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Bucket: {
            Type: 'AWS::S3::Bucket',
          },
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: { 'Fn::GetAtt': ['Bucket', 'UnknownAttribute'] },
                Type: 'S3',
              },
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // THEN
    await expect(() =>
      hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact),
    ).rejects.toThrow("We don't support the 'UnknownAttribute' attribute of the 'AWS::S3::Bucket' resource. This is a CDK limitation. Please report it at https://github.com/aws/aws-cdk/issues/new/choose");
  });

  test('calls the updateProject() API when it receives a difference in a CodeBuild project with no name', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
          },
          Metadata: {
            'aws:asset:path': 'current-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'new-spec',
                Type: 'NO_SOURCE',
              },
            },
            Metadata: {
              'aws:asset:path': 'current-path',
            },
          },
        },
      },
    });

    // WHEN
    setup.pushStackResourceSummaries(setup.stackSummaryOf('CodeBuildProject', 'AWS::CodeBuild::Project', 'mock-project-resource-id'));
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateProject).toHaveBeenCalledWith({
      name: 'mock-project-resource-id',
      source: {
        type: 'NO_SOURCE',
        buildspec: 'new-spec',
      },
    });
  });

  test('does not call the updateProject() API when it receives a change that is not Source, SourceVersion, or Environment difference in a CodeBuild project', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
            ConcurrentBuildLimit: 1,
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'current-spec',
                Type: 'NO_SOURCE',
              },
              ConcurrentBuildLimit: 2,
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateProject).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateProject).not.toHaveBeenCalled();
    }
  });

  test(`when it receives a change that is not Source, SourceVersion, or Environment difference in a CodeBuild project alongside a hotswappable change,
        it does not call the updateProject() API in CLASSIC mode, but it does in HOTSWAP_ONLY mode`,
  async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::CodeBuild::Project',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
            ConcurrentBuildLimit: 1,
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
              Source: {
                BuildSpec: 'new-spec',
                Type: 'NO_SOURCE',
              },
              ConcurrentBuildLimit: 2,
            },
          },
        },
      },
    });

    setup.pushStackResourceSummaries(setup.stackSummaryOf('CodeBuildProject', 'AWS::CodeBuild::Project', 'mock-project-resource-id'));
    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateProject).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateProject).toHaveBeenCalledWith({
        name: 'mock-project-resource-id',
        source: {
          type: 'NO_SOURCE',
          buildspec: 'new-spec',
        },
      });
    }
  });
  test('does not call the updateProject() API when a resource with type that is not AWS::CodeBuild::Project but has the same properties is changed', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        CodeBuildProject: {
          Type: 'AWS::NotCodeBuild::NotAProject',
          Properties: {
            Source: {
              BuildSpec: 'current-spec',
              Type: 'NO_SOURCE',
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          CodeBuildProject: {
            Type: 'AWS::NotCodeBuild::NotAProject',
            Properties: {
              Source: {
                BuildSpec: 'new-spec',
                Type: 'NO_SOURCE',
              },
            },
            Metadata: {
              'aws:asset:path': 'old-path',
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateProject).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateProject).not.toHaveBeenCalled();
    }
  });
});
