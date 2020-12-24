import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import { SecretValue } from '@aws-cdk/core';
import { enumerate, expectProp, flatten } from '../_util';
import { ExecutionAction, ExecutionArtifact, ExecutionGraph, ExecutionNode, ExecutionSourceAction, commonAncestor, SourceType, ancestorPath } from '../graph';
import { Backend, RenderBackendOptions } from './index';

export interface CodePipelineBackendProps {
  // Legacy and tweaking props
  readonly pipelineName?: string;
  readonly crossAccountKeys?: boolean;
  readonly cdkCliVersion?: string;
  readonly selfMutating?: boolean;

  // The following 2 should probably go on the asset/synth/selfmutating strategies
  readonly vpc?: string;
  readonly subnetSelection?: ec2.SubnetSelection;
}


export class CodePipelineBackend extends Backend {
  private _pipeline?: cp.Pipeline;
  private artifacts = new Map<ExecutionArtifact, cp.Artifact>();

  constructor(private readonly props: CodePipelineBackendProps) {
    super();
  }

  public renderBackend(options: RenderBackendOptions): void {
    if (this._pipeline) {
      throw new Error('Pipeline already created');
    }

    this._pipeline = new cp.Pipeline(options.scope, 'Resource', {
      pipelineName: this.props.pipelineName,
      crossAccountKeys: this.props.crossAccountKeys ?? false,
      restartExecutionOnUpdate: true,
    });

    for (const node of flatten(options.executionGraph.sortedChildren())) {
      if (!(node instanceof ExecutionGraph)) {
        throw new Error('For CodePipeline, top-level children of execution graph must be subgraphs');
      }
      this.addStageFromGraphNode(node);
    }
  }

  public get pipeline(): cp.Pipeline {
    if (!this._pipeline) {
      throw new Error('Pipeline not created yet');
    }
    return this._pipeline;
  }

  private addStageFromGraphNode(graph: ExecutionGraph) {
    const stage = this.pipeline.addStage({ stageName: graph.name });

    const tranches = graph.sortedLeaves();
    const sharedParent = commonAncestor(flatten(tranches));

    for (const [i, tranche] of enumerate(tranches)) {
      const actions = tranche.filter(isExecutionAction);
      for (const node of actions) {
        stage.addAction(this.makeAction({
          runOrder: i + 1,
          node,
          sharedParent,
        }));
      }
    }
  }

  private makeAction(options: MakeActionOptions): cp.IAction {
    if (options.node instanceof ExecutionSourceAction) {
      return this.makeSourceAction(options.node, options);
    }

    throw new Error(`Don't know how to make CodePipeline Action from ${options.node}`);
  }

  private makeSourceAction(source: ExecutionSourceAction, options: MakeActionOptions): cp.IAction {
    const sourceProps = source.props;
    switch (sourceProps.type) {
      case SourceType.GITHUB:
        const gitHubProps = expectProp(sourceProps, 'gitHubSource');
        return new cpa.GitHubSourceAction({
          runOrder: options.runOrder,
          trigger: cpa.GitHubTrigger.WEBHOOK,
          repo: gitHubProps.repo,
          owner: gitHubProps.owner,
          branch: gitHubProps.branch,
          output: this.translateArtifact(source.outputArtifact),
          actionName: actionName(source, options.sharedParent),
          oauthToken: SecretValue.secretsManager(gitHubProps.authentication.tokenName),
        });

      default:
        throw new Error(`Don't know how to make CodePipeline Source Action for ${sourceProps.type}`);
    }
  }

  private translateArtifact(x: ExecutionArtifact): cp.Artifact {
    let ret = this.artifacts.get(x);
    if (!ret) {
      this.artifacts.set(x, ret = new cp.Artifact());
    }
    return ret;
  }
}

interface MakeActionOptions {
  readonly runOrder: number;
  readonly node: ExecutionAction;
  readonly sharedParent: ExecutionNode;
}

function isExecutionAction(node: ExecutionNode): node is ExecutionAction {
  return node instanceof ExecutionAction;
}

function actionName(node: ExecutionNode, parent: ExecutionNode) {
  const names = ancestorPath(node, parent).map(n => n.name);
  return names.map(sanitizeName).join('.');
}

function sanitizeName(x: string): string {
  return x.replace(/[^A-Za-z0-9.@\-_]/g, '_');


}