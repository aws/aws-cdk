import * as cdk from '@aws-cdk/core';
import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { isStackArtifact } from '../private/cloud-assembly-internals';
import { IFileSet } from './file-set';
import { StackAsset, StackDeployment } from './stack-deployment';
import { Step } from './step';

export interface StageDeploymentProps {
  readonly stageName?: string;
  readonly pre?: Step[];
  readonly post?: Step[];
  readonly customCloudAssembly?: IFileSet;
}

export class StageDeployment {
  public static fromStage(stage: cdk.Stage, props: StageDeploymentProps = {}) {
    const assembly = stage.synth();
    if (assembly.stacks.length === 0) {
      // If we don't check here, a more puzzling "stage contains no actions"
      // error will be thrown come deployment time.
      throw new Error(`The given Stage construct ('${stage.node.path}') should contain at least one Stack`);
    }

    const stepFromArtifact = new Map<CloudFormationStackArtifact, StackDeployment>();
    for (const artifact of assembly.stacks) {
      const step = StackDeployment.fromArtifact(artifact, {
        scope: stage,
        customCloudAssembly: props.customCloudAssembly,
      });
      stepFromArtifact.set(artifact, step);
    }

    for (const artifact of assembly.stacks) {
      const stackDependencies = artifact.dependencies.filter(isStackArtifact);
      for (const dep of stackDependencies) {
        const depStep = stepFromArtifact.get(dep);
        if (!depStep) {
          throw new Error(`Stack '${artifact.id}' depends on stack not found in same Stage: '${dep.id}'`);
        }
        stepFromArtifact.get(artifact)?.addDependency(depStep);
      }
    }

    return new StageDeployment(Array.from(stepFromArtifact.values()), {
      stageName: stage.stageName,
      ...props,
    });
  }

  public readonly stageName: string;
  public readonly pre: Step[];
  public readonly post: Step[];

  private constructor(public readonly stacks: StackDeployment[], props: StageDeploymentProps = {}) {
    this.stageName = props.stageName ?? '';
    this.pre = props.pre ?? [];
    this.post = props.post ?? [];
  }

  public addPre(...steps: Step[]) {
    this.pre.push(...steps);
  }

  public addPost(...steps: Step[]) {
    this.post.push(...steps);
  }

  public get requiredAssets(): StackAsset[] {
    const assets = new Map<string, StackAsset>();

    for (const stack of this.stacks) {
      for (const asset of stack.requiredAssets) {
        assets.set(asset.assetSelector, asset);
      }
    }

    return Array.from(assets.values());
  }
}