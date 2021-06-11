import { AssetType, Blueprint, BlueprintQueries, FileSet, ScriptStep, StackAsset, StackDeployment, StageDeployment, Step, Wave } from '../blueprint';
import { DependencyBuilders, Graph, GraphNode, GraphNodeCollection } from '../private/graph';
import { CodePipelineSource } from './codepipeline-source';

export interface PipelineStructureProps {
  readonly selfMutation?: boolean;
}

/**
 * Logic to turn the deployment blueprint into a graph
 *
 * This code makes all the decisions on how to lay out the CodePipeline
 */
export class PipelineStructure {
  public readonly graph: AGraph = Graph.of('', { type: 'group' });
  public readonly cloudAssemblyFileSet: FileSet;
  public readonly queries: BlueprintQueries;

  private readonly added = new Map<Step, AGraphNode>();
  private readonly assetNodes = new Map<string, AGraphNode>();
  private readonly synthNode: AGraphNode;
  private readonly selfMutateNode?: AGraphNode;
  private readonly stackOutputDependencies = new DependencyBuilders<StackDeployment, any>();
  private lastPreparationNode: AGraphNode;
  private _fileAssetCtr = 0;
  private _dockerAssetCtr = 0;

  constructor(public readonly blueprint: Blueprint, props: PipelineStructureProps = {}) {
    this.queries = new BlueprintQueries(blueprint);

    this.synthNode = this.addBuildStep(blueprint.synthStep);
    if (this.synthNode.data?.type === 'step') {
      this.synthNode.data.isBuildStep = true;
    }
    this.lastPreparationNode = this.synthNode;

    const cloudAssembly = blueprint.synthStep.primaryOutput?.primaryOutput;
    if (!cloudAssembly) {
      throw new Error(`The synth step must produce the cloud assembly artifact, but doesn't: ${blueprint.synthStep}`);
    }

    this.cloudAssemblyFileSet = cloudAssembly;

    if (props.selfMutation) {
      const stage: AGraph = Graph.of('UpdatePipeline', { type: 'group' });
      this.graph.add(stage);
      this.selfMutateNode = GraphNode.of('SelfMutate', { type: 'self-update' });
      stage.add(this.selfMutateNode);

      this.selfMutateNode.dependOn(this.synthNode);
      this.lastPreparationNode = this.selfMutateNode;
    }

    const waves = blueprint.waves.map(w => this.addWave(w));

    // Make sure the waves deploy sequentially
    for (let i = 1; i < waves.length; i++) {
      waves[i].dependOn(waves[i - 1]);
    }

    // Add additional dependencies between steps that depend on stack outputs and the stacks
    // that produce them.
  }

  public isSynthNode(node: AGraphNode) {
    return this.synthNode === node;
  }

  private addBuildStep(step: Step) {
    return this.addAndRecurse(step, this.topLevelGraph('Build'));
  }

  private addWave(wave: Wave): AGraph {
    // If the wave only has one Stage in it, don't add an additional Graph around it
    const retGraph: AGraph = wave.stages.length === 1
      ? this.addStage(wave.stages[0])
      : Graph.of(wave.id, { type: 'group' }, wave.stages.map(s => this.addStage(s)));

    this.addPrePost(wave.pre, wave.post, retGraph);
    retGraph.dependOn(this.lastPreparationNode);
    this.graph.add(retGraph);

    return retGraph;
  }

  private addStage(stage: StageDeployment): AGraph {
    const retGraph: AGraph = Graph.of(stage.stageName, { type: 'group' });

    const stackGraphs = new Map<StackDeployment, AGraph>();

    for (const stack of stage.stacks) {
      const stackGraph: AGraph = Graph.of(this.simpleStackName(stack.stackName, stage.stageName), { type: 'stack-group', stack });
      const prepareNode: AGraphNode = GraphNode.of('Prepare', { type: 'prepare', stack });
      const deployNode: AGraphNode = GraphNode.of('Deploy', {
        type: 'execute',
        stack,
        captureOutputs: this.queries.stackOutputsReferenced(stack).length > 0,
      });

      retGraph.add(stackGraph);
      stackGraph.add(prepareNode, deployNode);
      deployNode.dependOn(prepareNode);
      stackGraphs.set(stack, stackGraph);

      // Depend on Cloud Assembly
      const cloudAssembly = stack.customCloudAssembly?.primaryOutput ?? this.cloudAssemblyFileSet;
      prepareNode.dependOn(this.addAndRecurse(cloudAssembly.producer, retGraph));

      // Depend on Assets
      // FIXME: Custom Cloud Assembly currently doesn't actually help separating
      // out templates from assets!!!
      for (const asset of stack.requiredAssets) {
        const assetNode = this.publishAsset(asset);
        prepareNode.dependOn(assetNode);
      }

      // Add stack output synchronization point
      if (this.queries.stackOutputsReferenced(stack).length > 0) {
        this.stackOutputDependencies.get(stack).dependOn(deployNode);
      }
    }

    for (const stack of stage.stacks) {
      for (const dep of stack.dependsOnStacks) {
        stackGraphs.get(stack)?.dependOn(stackGraphs.get(dep)!);
      }
    }

    this.addPrePost(stage.pre, stage.post, retGraph);

    return retGraph;
  }

  private addPrePost(pre: Step[], post: Step[], parent: AGraph) {
    const currentNodes = new GraphNodeCollection(parent.nodes);
    for (const p of pre) {
      const preNode = this.addAndRecurse(p, parent);
      currentNodes.dependOn(preNode);
    }
    for (const p of post) {
      const postNode = this.addAndRecurse(p, parent);
      postNode.dependOn(...currentNodes.nodes);
    }
  }

  private topLevelGraph(name: string): AGraph {
    let ret = this.graph.tryGetChild(name);
    if (!ret) {
      ret = new Graph<GraphAnnotation>(name);
      this.graph.add(ret);
    }
    return ret as AGraph;
  }

  private addAndRecurse(step: Step, parent: AGraph) {
    const previous = this.added.get(step);
    if (previous) { return previous; }

    const node: AGraphNode = GraphNode.of(step.id, { type: 'step', step });

    // If the step is a source step, change the parent to a special "Source" stage
    // (CodePipeline wants it that way)
    if (step instanceof CodePipelineSource) {
      parent = this.topLevelGraph('Source');
    }

    parent.add(node);
    this.added.set(step, node);

    for (const dep of step.dependencySteps) {
      const producerNode = this.addAndRecurse(dep, parent);
      node.dependOn(producerNode);
    }

    // Add stack dependencies (by use of the dependencybuilder this also works
    // if we encounter the Step before the Stack has been properly added yet)
    if (step instanceof ScriptStep) {
      for (const output of Object.values(step.envFromOutputs)) {
        const stack = this.queries.producingStack(output);
        this.stackOutputDependencies.get(stack).dependBy(node);
      }
    }

    return node;
  }

  private publishAsset(stackAsset: StackAsset): AGraphNode {
    const assetsGraph = this.topLevelGraph('Assets');

    const assetNode = this.assetNodes.get(stackAsset.assetId);
    if (assetNode) {
      const data = assetNode.data;
      if (data?.type !== 'publish-assets') {
        throw new Error(`${assetNode} has the wrong data.type: ${data?.type}`);
      }

      // No duplicates
      if (!data.assets.some(a => a.assetSelector === stackAsset.assetSelector)) {
        data.assets.push(stackAsset);
      }
    }

    const id = stackAsset.assetType === AssetType.FILE ? `FileAsset${++this._fileAssetCtr}` : `DockerAsset${++this._dockerAssetCtr}`;
    const newNode: AGraphNode = GraphNode.of(id, { type: 'publish-assets', assets: [stackAsset] });
    this.assetNodes.set(stackAsset.assetId, newNode);
    assetsGraph.add(newNode);
    newNode.dependOn(this.lastPreparationNode);
    return newNode;
  }

  /**
   * Simplify the stack name by removing the `Stage-` prefix if it exists.
   */
  private simpleStackName(stackName: string, stageName: string) {
    return stripPrefix(stackName, `${stageName}-`);
  }
}

type GraphAnnotation =
  { readonly type: 'group' }
  | { readonly type: 'stack-group'; readonly stack: StackDeployment }
  | { readonly type: 'publish-assets'; readonly assets: StackAsset[] }
  | { readonly type: 'step'; readonly step: Step; isBuildStep?: boolean }
  | { readonly type: 'self-update' }
  | { readonly type: 'prepare'; readonly stack: StackDeployment }
  | { readonly type: 'execute'; readonly stack: StackDeployment; readonly captureOutputs: boolean }
  ;

// Type aliases for the graph nodes tagged with our specific annotation type
// (to save on generics in the code above).
export type AGraphNode = GraphNode<GraphAnnotation>;
export type AGraph = Graph<GraphAnnotation>;

function stripPrefix(s: string, prefix: string) {
  return s.startsWith(prefix) ? s.substr(prefix.length) : s;
}