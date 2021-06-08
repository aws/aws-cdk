/// !cdk-integ PipelineStack
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { App, CfnParameter, CfnResource, SecretValue, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../../lib';

class MyStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const stack = new Stack(this, 'Stack', props);
    new CfnResource(stack, 'Resource', {
      type: 'AWS::Test::SomeResource',
    });
  }
}

/**
 * The stack that defines the application pipeline
 */
class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact('CloudAsm');
    const integTestArtifact = new codepipeline.Artifact('IntegTests');

    const pipeline = new cdkp.CdkPipeline(this, 'Pipeline', {
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.plainText('not-a-secret'),
        owner: 'OWNER',
        repo: 'REPO',
        trigger: codepipeline_actions.GitHubTrigger.POLL,
      }),

      // How it will be built
      synthAction: cdkp.SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        projectName: 'MyServicePipeline-synth',
        additionalArtifacts: [
          {
            directory: 'test',
            artifact: integTestArtifact,
          },
        ],
      }),
    });

    // This is where we add the application stages
    // ...
    const stage = pipeline.addApplicationStage(new MyStage(this, 'PreProd', {
      env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    }));
    stage.addActions(
      new cdkp.ShellScriptAction({
        actionName: 'UseSource',
        commands: [
          // Comes from source
          'cat README.md',
        ],
        additionalArtifacts: [sourceArtifact],
      }),
    );
  }
}

const app = new App({
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true',
  },
});
new CdkpipelinesDemoPipelineStack(app, 'PipelineStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
app.synth();


class TheStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const clusterName = new CfnParameter(this, 'ClusterName');
    const namespace = new CfnParameter(this, 'Namespace');

    const kubeNamespace = new CfnResource(this, 'KubeNamespace', {
      type: 'AWSQS::Kubernetes::Resource',
      properties: {
        ClusterName: clusterName.valueAsString,
        Namespace: 'default',
        Manifest: this.toJsonString({
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: namespace.valueAsString,
            labels: {
              name: namespace.valueAsString,
            }
          },
        }),
      },
    });

    new CfnResource(this, 'KubeStateMetrics', {
      type: 'AWSQS::Kubernetes::Helm',
      properties: {
        ClusterID: clusterName.valueAsString,
        Name: 'kube-state-metrics',
        Namespace: kubeNamespace.getAtt('Name').toString(),
        Repository: 'https://prometheus-community.github.io/helm-charts',
        Chart: 'prometheus-community/kube-state-metrics',
      },
    });
  }
}

