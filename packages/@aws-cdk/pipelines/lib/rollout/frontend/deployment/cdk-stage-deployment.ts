import * as fs from 'fs';
import * as path from 'path';
import { Stack, Stage } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { AssetManifestReader, DockerImageManifestEntry, FileManifestEntry } from '../../../private/asset-manifest';
import { appOf, assemblyBuilderOf } from '../../../private/construct-internals';
import { toPosixPath } from '../../../private/fs';
import { AssetType } from '../../../types/asset-type';
import { CreateChangeSetAction, ExecuteChangeSetAction, ExecutionGraph } from '../../graph';
import { Approver } from '../approver';
import { AddDeploymentToGraphOptions, Deployment } from './index';

export interface CdkStageDeploymentProps {
  /**
   * Approver for the app
   *
   * Run after the app is deployed
   */
  readonly approvers?: Approver[];
}

export class CdkStageDeployment extends Deployment {
  private readonly assembly: cxapi.CloudAssembly;

  constructor(private readonly stage: Stage, private readonly options: CdkStageDeploymentProps = {}) {
    super();

    this.assembly = this.stage.synth();
    if (this.assembly.stacks.length === 0) {
      // If we don't check here, a more puzzling "stage contains no actions"
      // error will be thrown come deployment time.
      throw new Error(`The given Stage construct ('${this.stage.node.path}') should contain at least one Stack`);
    }
  }

  public produceExecutionGraph(options: AddDeploymentToGraphOptions): ExecutionGraph {
    const graph = new ExecutionGraph(this.stage.stageName);

    const stackGraphs = new Map<cxapi.CloudFormationStackArtifact, ExecutionGraph>();

    for (const stackArtifact of this.assembly.stacks) {
      const stackGraph = new ExecutionGraph(this.simplifyStackName(stackArtifact.stackName));
      stackGraphs.set(stackArtifact, stackGraph);
      graph.add(stackGraph);

      // We need the path of the template relative to the root Cloud Assembly
      // It should be easier to get this, but for now it is what it is.
      const appAsmRoot = assemblyBuilderOf(appOf(options.scope)).outdir;
      const fullTemplatePath = path.join(stackArtifact.assembly.directory, stackArtifact.templateFile);

      let fullConfigPath;
      if (Object.keys(stackArtifact.tags).length > 0) {
        fullConfigPath = `${fullTemplatePath}.config.json`;

        // Write the template configuration file (for parameters into CreateChangeSet call that
        // cannot be configured any other way). They must come from a file, and there's unfortunately
        // no better hook to write this file (`construct.onSynthesize()` would have been the prime candidate
        // but that is being deprecated--and DeployCdkStackAction isn't even a construct).
        writeTemplateConfiguration(fullConfigPath, {
          Tags: stackArtifact.tags,
        });
      }

      const artRegion = stackArtifact.environment.region;
      const region = artRegion === Stack.of(options.scope).region || artRegion === cxapi.UNKNOWN_REGION ? undefined : artRegion;
      const artAccount = stackArtifact.environment.account;
      const account = artAccount === Stack.of(options.scope).account || artAccount === cxapi.UNKNOWN_ACCOUNT ? undefined : artAccount;

      const prepareAction = new CreateChangeSetAction('Prepare', {
        stackName: stackArtifact.stackName,
        templateArtifact: options.pipelineGraph.cloudAssemblyArtifact,
        templatePath: toPosixPath(path.relative(appAsmRoot, fullTemplatePath)),
        templateConfigurationPath: fullConfigPath ? toPosixPath(path.relative(appAsmRoot, fullConfigPath)) : undefined,
        region,
        account,
        assumeRoleArn: stackArtifact.assumeRoleArn,
        executionRoleArn: stackArtifact.cloudFormationExecutionRoleArn,
      });

      const executeAction = new ExecuteChangeSetAction('Deploy', {
        stackName: stackArtifact.stackName,
        region,
        account,
        assumeRoleArn: stackArtifact.assumeRoleArn,
      });

      stackGraph.add(prepareAction, executeAction);
      executeAction.dependOn(prepareAction);

      this.publishAssetDependencies(stackArtifact, graph, options);
    }

    // Translate stack dependencies into graph dependencies
    for (const stackArtifact of this.assembly.stacks) {
      for (const dep of stackArtifact.dependencies.filter(isCloudFormationStack)) {
        const depGraph = stackGraphs.get(dep);
        if (depGraph) {
          stackGraphs.get(stackArtifact)?.dependOn(depGraph);
        }
      }
    }

    for (const approver of this.options.approvers ?? []) {
      approver.addToExecutionGraph({ pipelineGraph: options.pipelineGraph, deploymentGraph: graph });
    }

    return graph;
  }

  /**
   * Simplify the stack name by removing the `Stage-` prefix if it exists.
   */
  private simplifyStackName(s: string) {
    return stripPrefix(s, `${this.stage.stageName}-`);
  }

  private publishAssetDependencies(
    stackArtifact: cxapi.CloudFormationStackArtifact,
    deploymentGraph: ExecutionGraph,
    options: AddDeploymentToGraphOptions) {
    const assetManifests = stackArtifact.dependencies.filter(isAssetManifest);

    for (const manifestArtifact of assetManifests) {
      const manifest = AssetManifestReader.fromFile(manifestArtifact.file);

      for (const entry of manifest.entries) {
        let assetType: AssetType;
        if (entry instanceof DockerImageManifestEntry) {
          assetType = AssetType.DOCKER_IMAGE;
        } else if (entry instanceof FileManifestEntry) {
          // Don't publishg the template for this stack
          if (entry.source.packaging === 'file' && entry.source.path === stackArtifact.templateFile) {
            continue;
          }

          assetType = AssetType.FILE;
        } else {
          throw new Error(`Unrecognized asset type: ${entry.type}`);
        }

        options.assetPublishing.publishAsset({
          pipelineGraph: options.pipelineGraph,
          deploymentGraph,
          assetManifestPath: manifestArtifact.file,
          assetId: entry.id.assetId,
          assetSelector: entry.id.toString(),
          assetType,
        });
      }
    }
  }
}

function stripPrefix(s: string, prefix: string) {
  return s.startsWith(prefix) ? s.substr(prefix.length) : s;
}

function isAssetManifest(s: cxapi.CloudArtifact): s is cxapi.AssetManifestArtifact {
  // instanceof is too risky, and we're at a too late stage to properly fix.
  // return s instanceof cxapi.AssetManifestArtifact;
  return s.constructor.name === 'AssetManifestArtifact';
}

function isCloudFormationStack(s: cxapi.CloudArtifact): s is cxapi.CloudFormationStackArtifact {
  // instanceof is too risky, and we're at a too late stage to properly fix.
  // return s instanceof cxapi.CloudFormationStackArtifact;
  return s.constructor.name === 'CloudFormationStackArtifact';
}

/**
 * Template configuration in a CodePipeline
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-cfn-artifacts.html#w2ab1c13c17c15
 */
interface TemplateConfiguration {
  readonly Parameters?: Record<string, string>;
  readonly Tags?: Record<string, string>;
  readonly StackPolicy?: {
    readonly Statements: Array<Record<string, string>>;
  };
}

/**
 * Write template configuration to the given file
 */
function writeTemplateConfiguration(filename: string, config: TemplateConfiguration) {
  fs.writeFileSync(filename, JSON.stringify(config, undefined, 2), { encoding: 'utf-8' });
}