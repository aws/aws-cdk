import { DependencyBuilders, Graph, GraphNode, GraphNodeCollection } from './graph';
import { PipelineQueries } from './pipeline-queries';
import { AssetType, FileSet, StackAsset, StackDeployment, StageDeployment, Step, Wave } from '../blueprint';
import { PipelineBase } from '../main/pipeline-base';

export interface PipelineGraphProps {
  /**
   * Add a self-mutation step.
   *
   * @default false
   */
  readonly selfMutation?: boolean;

  /**
   * Publishes the template asset to S3.
   *
   * @default false
   */
  readonly publishTemplate?: boolean;

  /**
   * Whether to combine asset publishers for the same type into one step
   *
   * @default false
   */
  readonly singlePublisherPerAssetType?: boolean;

  /**
   * Add a "prepare" step for each stack which can be used to create the change
   * set. If this is disabled, only the "execute" step will be included.
   *
   * @default true
   */
  readonly prepareStep?: boolean;
}

/**
 * Logic to turn the deployment blueprint into a graph
 *
 * This code makes all the decisions on how to lay out the CodePipeline
 */
export class PipelineGraph {
  /**
   * A Step object that may be used as the producer of FileSets that should not be represented in the graph
   */
  public static readonly NO_STEP: Step = new class extends Step { }('NO_STEP');

  public readonly graph: AGraph = Graph.of('', { type: 'group' });
  public readonly cloudAssemblyFileSet: FileSet;
  public readonly queries: PipelineQueries;

  private readonly added = new Map<Step, AGraphNode>();
  private readonly assetNodes = new Map<string, AGraphNode>();
  private readonly assetNodesByType = new Map<AssetType, AGraphNode>();
  private readonly synthNode?: AGraphNode;
  private readonly selfMutateNode?: AGraphNode;
  private readonly stackOutputDependencies = new DependencyBuilders<StackDeployment>();
  /** Mapping steps to depbuilders, satisfied by the step itself  */
  private readonly nodeDependencies = new DependencyBuilders<Step>();
  private readonly publishTemplate: boolean;
  private readonly prepareStep: boolean;
  private readonly singlePublisher: boolean;

  private lastPreparationNode?: AGraphNode;
  private _fileAssetCtr = 0;
  private _dockerAssetCtr = 0;

  constructor(public readonly pipeline: PipelineBase, props: PipelineGraphProps = {}) {
    this.publishTemplate = props.publishTemplate ?? false;
    this.prepareStep = props.prepareStep ?? true;
    this.singlePublisher = props.singlePublisherPerAssetType ?? false;

    this.queries = new PipelineQueries(pipeline);

    if (pipeline.synth instanceof Step) {
      this.synthNode = this.addBuildStep(pipeline.synth);
      if (this.synthNode?.data?.type === 'step') {
        this.synthNode.data.isBuildStep = true;
      }
    }
    this.lastPreparationNode = this.synthNode;

    const cloudAssembly = pipeline.synth.primaryOutput?.primaryOutput;
    if (!cloudAssembly) {
      throw new Error(`The synth step must produce the cloud assembly artifact, but doesn't: ${pipeline.synth}`);
    }

    this.cloudAssemblyFileSet = cloudAssembly;

    if (props.selfMutation) {
      const stage: AGraph = Graph.of('UpdatePipeline', { type: 'group' });
      this.graph.add(stage);
      this.selfMutateNode = aGraphNode('SelfMutate', { type: 'self-update' });
      stage.add(this.selfMutateNode);

      this.selfMutateNode.dependOn(this.synthNode);
      this.lastPreparationNode = this.selfMutateNode;
    }

    const waves = pipeline.waves.map(w => this.addWave(w));

    // Make sure the waves deploy sequentially
    for (let i = 1; i < waves.length; i++) {
      waves[i].dependOn(waves[i - 1]);
    }

    this.addMissingDependencyNodes();
  }

  public isSynthNode(node: AGraphNode) {
    return this.synthNode === node;
  }

  private addBuildStep(step: Step) {
    return this.addStepNode(step, this.topLevelGraph('Build'));
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
      const prepareNode: AGraphNode | undefined = this.prepareStep ? aGraphNode('Prepare', { type: 'prepare', stack }) : undefined;
      const deployNode: AGraphNode = aGraphNode('Deploy', {
        type: 'execute',
        stack,
        captureOutputs: this.queries.stackOutputsReferenced(stack).length > 0,
        withoutChangeSet: prepareNode === undefined,
      });

      retGraph.add(stackGraph);
      stackGraph.add(deployNode);

      // node or node collection that represents first point of contact in each stack
      let firstDeployNode;
      if (prepareNode) {
        stackGraph.add(prepareNode);
        deployNode.dependOn(prepareNode);
        firstDeployNode = prepareNode;
      } else {
        firstDeployNode = deployNode;
      }

      // add changeset steps at the stack level
      if (stack.changeSet.length > 0) {
        if (prepareNode) {
          this.addChangeSetNode(stack.changeSet, prepareNode, deployNode, stackGraph);
        } else {
          throw new Error(`Cannot use \'changeSet\' steps for stack \'${stack.stackName}\': the pipeline does not support them or they have been disabled`);
        }
      }

      // add pre and post steps at the stack level
      const preNodes = this.addPrePost(stack.pre, stack.post, stackGraph);
      if (preNodes.nodes.length > 0) {
        firstDeployNode = preNodes;
      }

      stackGraphs.set(stack, stackGraph);

      const cloudAssembly = this.cloudAssemblyFileSet;

      firstDeployNode.dependOn(this.addStepNode(cloudAssembly.producer, retGraph));

      // add the template asset
      if (this.publishTemplate) {
        if (!stack.templateAsset) {
          throw new Error(`"publishTemplate" is enabled, but stack ${stack.stackArtifactId} does not have a template asset`);
        }

        firstDeployNode.dependOn(this.publishAsset(stack.templateAsset));
      }

      // Depend on Assets
      // FIXME: Custom Cloud Assembly currently doesn't actually help separating
      // out templates from assets!!!
      for (const asset of stack.assets) {
        const assetNode = this.publishAsset(asset);
        firstDeployNode.dependOn(assetNode);
      }

      // Add stack output synchronization point
      if (this.queries.stackOutputsReferenced(stack).length > 0) {
        this.stackOutputDependencies.for(stack).dependOn(deployNode);
      }
    }

    for (const stack of stage.stacks) {
      for (const dep of stack.stackDependencies) {
        const stackNode = stackGraphs.get(stack);
        const depNode = stackGraphs.get(dep);
        if (!stackNode) {
          throw new Error(`cannot find node for ${stack.stackName}`);
        }
        if (!depNode) {
          throw new Error(`cannot find node for ${dep.stackName}`);
        }
        stackNode.dependOn(depNode);
      }
    }

    this.addPrePost(stage.pre, stage.post, retGraph);

    return retGraph;
  }

  private addChangeSetNode(changeSet: Step[], prepareNode: AGraphNode, deployNode: AGraphNode, graph: AGraph) {
    for (const c of changeSet) {
      const changeSetNode = this.addStepNode(c, graph);
      changeSetNode?.dependOn(prepareNode);
      deployNode.dependOn(changeSetNode);
    }
  }

  private addPrePost(pre: Step[], post: Step[], parent: AGraph) {
    const currentNodes = new GraphNodeCollection(parent.nodes);
    const preNodes = new GraphNodeCollection(new Array<AGraphNode>());
    for (const p of pre) {
      const preNode = this.addStepNode(p, parent);
      currentNodes.dependOn(preNode);
      preNodes.nodes.push(preNode!);
    }
    for (const p of post) {
      const postNode = this.addStepNode(p, parent);
      postNode?.dependOn(...currentNodes.nodes);
    }
    return preNodes;
  }

  private topLevelGraph(name: string): AGraph {
    let ret = this.graph.tryGetChild(name);
    if (!ret) {
      ret = new Graph<GraphAnnotation>(name);
      this.graph.add(ret);
    }
    return ret as AGraph;
  }

  /**
   * Add a Node to a Graph for a given Step
   *
   * Adds all dependencies for that Node to the same Step as well.
   */
  private addStepNode(step: Step, parent: AGraph) {
    if (step === PipelineGraph.NO_STEP) { return undefined; }

    const previous = this.added.get(step);
    if (previous) { return previous; }

    const node: AGraphNode = aGraphNode(step.id, { type: 'step', step });

    // If the step is a source step, change the parent to a special "Source" stage
    // (CodePipeline wants it that way)
    if (step.isSource) {
      parent = this.topLevelGraph('Source');
    }

    parent.add(node);
    this.added.set(step, node);

    // This used to recurse -- that's not safe, because it might create nodes in the
    // wrong graph (it would create a dependency node, that might need to be created in
    // a different graph, in the current one). Instead, use DependencyBuilders.
    for (const dep of step.dependencies) {
      this.nodeDependencies.for(dep).dependBy(node);
    }
    this.nodeDependencies.for(step).dependOn(node);

    // Add stack dependencies (by use of the dependency builder this also works
    // if we encounter the Step before the Stack has been properly added yet)
    for (const output of step.consumedStackOutputs) {
      const stack = this.queries.producingStack(output);
      this.stackOutputDependencies.for(stack).dependBy(node);
    }

    return node;
  }

  /**
   * Add dependencies that aren't in the pipeline yet
   *
   * Build steps reference as many sources (or other builds) as they want, which will be added
   * automatically. Do that here. We couldn't do it earlier, because if there were dependencies
   * between steps we didn't want to reparent those unnecessarily.
   */
  private addMissingDependencyNodes() {
    // May need to do this more than once to recursively add all missing producers
    let attempts = 20;
    while (attempts-- > 0) {
      const unsatisfied = this.nodeDependencies.unsatisfiedBuilders().filter(([s]) => s !== PipelineGraph.NO_STEP);
      if (unsatisfied.length === 0) { return; }

      for (const [step, builder] of unsatisfied) {
        // Add a new node for this step to the parent of the "leftmost" consumer.
        const leftMostConsumer = new GraphNodeCollection(builder.consumers).first();
        const parent = leftMostConsumer.parentGraph;
        if (!parent) {
          throw new Error(`Consumer doesn't have a parent graph: ${leftMostConsumer}`);
        }
        this.addStepNode(step, parent);
      }
    }

    const unsatisfied = this.nodeDependencies.unsatisfiedBuilders();
    throw new Error([
      'Recursion depth too large while adding dependency nodes:',
      unsatisfied.map(([step, builder]) => `${builder.consumersAsString()} awaiting ${step}.`),
    ].join(' '));
  }

  private publishAsset(stackAsset: StackAsset): AGraphNode {
    const assetsGraph = this.topLevelGraph('Assets');

    let assetNode = this.assetNodes.get(stackAsset.assetId);
    if (assetNode) {
      // If there's already a node publishing this asset, add as a new publishing
      // destination to the same node.
    } else if (this.singlePublisher && this.assetNodesByType.has(stackAsset.assetType)) {
      // If we're doing a single node per type, lookup by that
      assetNode = this.assetNodesByType.get(stackAsset.assetType)!;
    } else {
      // Otherwise add a new one
      const id = stackAsset.assetType === AssetType.FILE
        ? (this.singlePublisher ? 'FileAsset' : `FileAsset${++this._fileAssetCtr}`)
        : (this.singlePublisher ? 'DockerAsset' : `DockerAsset${++this._dockerAssetCtr}`);

      assetNode = aGraphNode(id, { type: 'publish-assets', assets: [] });
      assetsGraph.add(assetNode);
      assetNode.dependOn(this.lastPreparationNode);

      this.assetNodesByType.set(stackAsset.assetType, assetNode);
      this.assetNodes.set(stackAsset.assetId, assetNode);
    }

    const data = assetNode.data;
    if (data?.type !== 'publish-assets') {
      throw new Error(`${assetNode} has the wrong data.type: ${data?.type}`);
    }

    if (!data.assets.some(a => a.assetSelector === stackAsset.assetSelector)) {
      data.assets.push(stackAsset);
    }

    return assetNode;
  }

  /**
   * Simplify the stack name by removing the `Stage-` prefix if it exists.
   */
  private simpleStackName(stackName: string, stageName: string) {
    return stripPrefix(stackName, `${stageName}-`);
  }
}

type GraphAnnotation =
  | { readonly type: 'group' }
  | { readonly type: 'stack-group'; readonly stack: StackDeployment }
  | { readonly type: 'publish-assets'; readonly assets: StackAsset[] }
  | { readonly type: 'step'; readonly step: Step; isBuildStep?: boolean }
  | { readonly type: 'self-update' }
  | { readonly type: 'prepare'; readonly stack: StackDeployment }
  | ExecuteAnnotation
  // Explicitly disable exhaustiveness checking on GraphAnnotation.  This forces all consumers to adding
  // a 'default' clause which allows us to extend this list in the future.
  // The code below looks weird, 'type' must be a non-enumerable type that is not assignable to 'string'.
  | { readonly type: { error: 'you must add a default case to your switch' } }
  ;

interface ExecuteAnnotation {
  readonly type: 'execute';
  /**
   * The stack to deploy
   */
  readonly stack: StackDeployment;

  /**
   * Whether or not outputs should be captured
   */
  readonly captureOutputs: boolean;

  /**
   * If this is executing a change set, or should do a direct deployment
   *
   * @default false
   */
  readonly withoutChangeSet?: boolean;
}

// Type aliases for the graph nodes tagged with our specific annotation type
// (to save on generics in the code above).
export type AGraphNode = GraphNode<GraphAnnotation>;
export type AGraph = Graph<GraphAnnotation>;

function aGraphNode(id: string, x: GraphAnnotation): AGraphNode {
  return GraphNode.of(id, x);
}

function stripPrefix(s: string, prefix: string) {
  return s.startsWith(prefix) ? s.slice(prefix.length) : s;
}