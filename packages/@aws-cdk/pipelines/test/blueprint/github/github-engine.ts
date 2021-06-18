import { writeFileSync } from 'fs';
import * as path from 'path';
import { EnvironmentPlaceholders } from '@aws-cdk/cx-api';
import * as decamelize from 'decamelize';
import * as YAML from 'yaml';
import { BuildDeploymentOptions, IDeploymentEngine, ScriptStep, StackAsset, StackDeployment, Step } from '../../../lib';
import { AGraphNode, PipelineStructure } from '../../../lib/codepipeline/_pipeline-structure';
import { appOf, assemblyBuilderOf } from '../../../lib/private/construct-internals';
import { Graph, isGraph } from '../../../lib/private/graph';
import { flatten } from '../../../lib/private/javascript';
import * as github from './workflows-model';

const CDKOUT_ARTIFACT = 'cdk.out';
const RUNS_ON = 'ubuntu-latest';

/**
 * Props for `GitHubEngine`.
 */
export interface GitHubEngineProps {
  /**
   * File path for the GitHub workflow.
   *
   * @default ".github/workflows/deploy.yml"
   */
  readonly workflowPath?: string;

  /**
   * Name of the workflow.
   *
   * @default "deploy"
   */
  readonly workflowName?: string;

  /**
   * GitHub workflow triggers.
   *
   * @default - By default, workflow is triggered on push to the `main` branch
   * and can also be triggered manually (`workflow_dispatch`).
   */
  readonly workflowTriggers?: github.Triggers;

  /**
   * Version of the CDK CLI to use.
   * @default - automatic
   */
  readonly cdkCliVersion?: string;

  /**
   * Indicates if the repository already contains a synthesized `cdk.out` directory, in which
   * case we will simply checkout the repo in jobs that require `cdk.out`.
   *
   * @default false
   */
  readonly preSynthed?: boolean;

  /**
   * Names of GitHub repository secrets that include AWS credentials for
   * deployment.
   *
   * @default - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
   */
  readonly awsCredentials?: AwsCredentialsSecertNames;
}

/**
 * GitHub backend for CDK Pipelines.
 */
export class GitHubEngine implements IDeploymentEngine {
  public readonly workflowPath: string;
  public readonly workflowName: string;

  private readonly workflowTriggers: github.Triggers;
  private readonly preSynthed: boolean;
  private readonly awsCredentials: AwsCredentialsSecertNames;

  constructor(private readonly props: GitHubEngineProps = {}) {
    this.preSynthed = props.preSynthed ?? false;
    this.awsCredentials = props.awsCredentials ?? {
      accessKeyId: 'AWS_ACCESS_KEY_ID',
      secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    };

    this.workflowPath = props.workflowPath ?? '.github/workflows/deploy.yml';
    if (!this.workflowPath.endsWith('.yml') && !this.workflowPath.endsWith('.yaml')) {
      throw new Error('workflow file is expected to be a yaml file');
    }

    this.workflowName = props.workflowName ?? 'deploy';
    this.workflowTriggers = props.workflowTriggers ?? {
      push: { branches: ['main'] },
      workflowDispatch: {},
    };
  }

  public buildDeployment(options: BuildDeploymentOptions): void {
    const cdkoutPath = path.resolve(assemblyBuilderOf(appOf(options.scope)).outdir);

    const jobs = new Array<Job>();

    const structure = new PipelineStructure(options.blueprint, {
      selfMutation: false,
      publishTemplate: true,
      prepareStep: false, // we create and execute the changeset in a single job
    });

    for (const stageNode of flatten(structure.graph.sortedChildren())) {
      if (!isGraph(stageNode)) {
        throw new Error(`Top-level children must be graphs, got '${stageNode}'`);
      }

      const tranches = stageNode.sortedLeaves();

      for (const tranche of tranches) {
        for (const node of tranche) {
          const job = this.jobForNode(node, {
            assemblyPath: cdkoutPath,
            structure,
          });

          if (job) {
            jobs.push(job);
          }
        }
      }
    }

    // convert jobs to a map and make sure there are no duplicates

    const jobmap: Record<string, github.Job> = {};
    for (const job of jobs) {
      if (job.id in jobmap) {
        throw new Error(`duplicate job id ${job.id}`);
      }
      jobmap[job.id] = snakeCaseKeys(job.definition);
    }

    const workflow = {
      name: this.workflowName,
      on: snakeCaseKeys(this.workflowTriggers),
      jobs: jobmap,
    };

    // write as a yaml file
    const yaml = YAML.stringify(workflow, {
      indent: 2,
    });

    // eslint-disable-next-line no-console
    console.error(`writing ${this.workflowPath}`);
    writeFileSync(this.workflowPath, yaml);
  }

  /**
   * Make an action from the given node and/or step
   */
  private jobForNode(node: AGraphNode, options: MakeActionOptions): Job | undefined {
    switch (node.data?.type) {
      // Nothing for these, they are groupings (shouldn't even have popped up here)
      case 'group':
      case 'stack-group':
      case undefined:
        throw new Error(`jobForNode: did not expect to get group nodes: ${node.data?.type}`);

      case 'self-update':
        throw new Error('github workflows does not support self mutation');

      case 'publish-assets':
        return this.jobForAssetPublish(node, node.data.assets, options);

      case 'prepare':
        throw new Error('"prepare" is not supported by GitHub worflows');

      case 'execute':
        return this.jobForDeploy(node, node.data.stack, node.data.captureOutputs);

      case 'step':
        if (node.data.isBuildStep) {
          return this.jobForBuildStep(node, node.data.step);
        } else if (node.data.step instanceof ScriptStep) {
          return this.jobForScriptStep(node, node.data.step);
        } else {
          throw new Error(`unsupported step type: ${node.data.step.constructor.name}`);
        }
    }
  }

  private jobForAssetPublish(node: AGraphNode, assets: StackAsset[], options: MakeActionOptions): Job {
    const installSuffix = this.props.cdkCliVersion ? `@${this.props.cdkCliVersion}` : '';
    const relativeToAssembly = (p: string) => path.posix.join(cdkoutDir, path.relative(options.assemblyPath, p));

    const cdkoutDir = 'cdk.out';
    const publishSteps: github.JobStep[] = assets.map(asset => ({
      name: `Publish ${asset.assetId} ${asset.isTemplate ? '(template)' : ''}`,
      run: `npx cdk-assets --path "${relativeToAssembly(asset.assetManifestPath)}" --verbose publish "${asset.assetSelector}"`,
    }));

    return {
      id: node.uniqueId,
      definition: {
        name: `Publish Assets ${node.uniqueId}`,
        needs: this.renderDependencies(node),
        permissions: {
          contents: github.JobPermission.READ,
        },
        runsOn: RUNS_ON,
        steps: [
          ...this.stepsToDownloadAssembly(cdkoutDir),
          {
            name: 'Install',
            run: `npm install --no-save cdk-assets${installSuffix}`,
          },
          ...this.stepsToConfigureAws({ region: 'us-west-2' }),
          ...publishSteps,
        ],
      },
    };
  }

  private jobForDeploy(node: AGraphNode, stack: StackDeployment, _captureOutputs: boolean): Job {
    const region = stack.region;
    const account = stack.account;
    if (!region || !account) {
      throw new Error('"account" and "region" are required');
    }

    if (!stack.templateUrl) {
      throw new Error(`unable to determine template URL for stack ${stack.stackArtifactId}`);
    }

    const resolve = (s: string): string => {
      return EnvironmentPlaceholders.replace(s, {
        accountId: account,
        region: region,
        partition: 'aws',
      });
    };

    const params: Record<string, any> = {
      'name': stack.stackName,
      'template': resolve(stack.templateUrl),
      'no-fail-on-empty-changeset': '1',
    };

    if (stack.executionRoleArn) {
      params['role-arn'] = resolve(stack.executionRoleArn);
    }

    const assumeRoleArn = stack.assumeRoleArn ? resolve(stack.assumeRoleArn) : undefined;

    return {
      id: node.uniqueId,
      definition: {
        name: `Deploy ${stack.stackArtifactId}`,
        permissions: { contents: github.JobPermission.NONE },
        needs: this.renderDependencies(node),
        runsOn: RUNS_ON,
        steps: [
          ...this.stepsToConfigureAws({ region, assumeRoleArn }),
          {
            uses: 'aws-actions/aws-cloudformation-github-deploy@v1',
            with: params,
          },
        ],
      },
    };
  }

  private jobForBuildStep(node: AGraphNode, step: Step): Job {
    if (!(step instanceof ScriptStep)) {
      throw new Error('synthStep must be a ScriptStep');
    }

    if (step.inputs.length > 0) {
      throw new Error('synthStep cannot have inputs');
    }

    if (step.outputs.length > 1) {
      throw new Error('synthStep must have a single output');
    }

    if (!step.primaryOutput) {
      throw new Error('synthStep requires a primaryOutput which contains cdk.out');
    }

    const cdkOut = step.outputs[0];

    const installSteps = step.installCommands.length > 0 ? [{
      name: 'Install',
      run: step.installCommands.join('\n'),
    }] : [];

    return {
      id: node.uniqueId,
      definition: {
        name: 'Synthesize',
        permissions: {
          contents: github.JobPermission.READ,
        },
        runsOn: RUNS_ON,
        needs: this.renderDependencies(node),
        env: step.env,
        steps: [
          ...this.stepsToCheckout(),
          ...installSteps,
          {
            name: 'Build',
            run: step.commands.join('\n'),
          },
          ...this.stepsToUploadAssembly(cdkOut.directory),
        ],
      },
    };
  }

  private jobForScriptStep(node: AGraphNode, step: ScriptStep): Job {

    if (Object.keys(step.envFromOutputs).length > 0) {
      throw new Error('"envFromOutputs" is not supported');
    }

    const downloadInputs = new Array<github.JobStep>();
    const uploadOutputs = new Array<github.JobStep>();

    for (const input of step.inputs) {
      downloadInputs.push({
        uses: 'actions/download-artifact@v2',
        with: {
          name: input.fileSet.id,
          path: input.directory,
        },
      });
    }

    for (const output of step.outputs) {
      uploadOutputs.push({
        uses: 'actions/upload-artifact@v2.1.1',
        with: {
          name: output.fileSet.id,
          path: output.directory,
        },
      });
    }

    const installSteps = step.installCommands.length > 0 ? [{
      name: 'Install',
      run: step.installCommands.join('\n'),
    }] : [];

    return {
      id: node.uniqueId,
      definition: {
        name: step.id,
        permissions: {
          contents: github.JobPermission.READ,
        },
        runsOn: RUNS_ON,
        needs: this.renderDependencies(node),
        env: step.env,
        steps: [
          ...downloadInputs,
          ...installSteps,
          { run: step.commands.join('\n') },
          ...uploadOutputs,
        ],
      },
    };
  }

  private stepsToConfigureAws({ region, assumeRoleArn }: { region: string, assumeRoleArn?: string }): github.JobStep[] {
    const params: Record<string, any> = {
      'aws-access-key-id': `\${{ secrets.${this.awsCredentials.accessKeyId} }}`,
      'aws-secret-access-key': `\${{ secrets.${this.awsCredentials.secretAccessKey} }}`,
      'aws-region': region,
      'role-skip-session-tagging': true,
      'role-duration-seconds': 30 * 60,
    };

    if (this.awsCredentials.sessionToken) {
      params['aws-session-token'] = `\${{ secrets.${this.awsCredentials.sessionToken} }}`;
    }

    if (assumeRoleArn) {
      params['role-to-assume'] = assumeRoleArn;
      params['role-external-id'] = 'Pipeline';
    }

    return [
      {
        uses: 'aws-actions/configure-aws-credentials@v1',
        with: params,
      },
    ];
  }

  private stepsToDownloadAssembly(targetDir: string): github.JobStep[] {
    if (this.preSynthed) {
      return this.stepsToCheckout();
    }

    return [{
      name: `Download ${CDKOUT_ARTIFACT}`,
      uses: 'actions/download-artifact@v2',
      with: {
        name: CDKOUT_ARTIFACT,
        path: targetDir,
      },
    }];
  }

  private stepsToCheckout(): github.JobStep[] {
    return [{
      name: 'Checkout',
      uses: 'actions/checkout@v2',
    }];
  }

  private stepsToUploadAssembly(dir: string): github.JobStep[] {
    if (this.preSynthed) {
      return [];
    }

    return [{
      name: `Upload ${CDKOUT_ARTIFACT}`,
      uses: 'actions/upload-artifact@v2.1.1',
      with: {
        name: CDKOUT_ARTIFACT,
        path: dir,
      },
    }];
  }

  private renderDependencies(node: AGraphNode) {
    const deps = new Array<AGraphNode>();

    for (const d of node.allDeps) {
      if (d instanceof Graph) {
        deps.push(...d.allLeaves().nodes);
      } else {
        deps.push(d);
      }
    }

    return deps.map(x => x.uniqueId);
  }
}

interface MakeActionOptions {
  /**
   * The pipeline graph.
   */
  readonly structure: PipelineStructure;

  /**
   * Full path to `cdk.out` directory.
   */
  readonly assemblyPath: string;
}

interface Job {
  readonly id: string;
  readonly definition: github.Job;
}

function snakeCaseKeys<T = unknown>(obj: T): T {
  if (typeof obj !== 'object' || obj == null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeCaseKeys) as any;
  }

  const result: Record<string, unknown> = {};
  for (let [k, v] of Object.entries(obj)) {
    if (typeof v === 'object' && v != null) {
      v = snakeCaseKeys(v);
    }
    result[decamelize(k, { separator: '-' })] = v;
  }
  return result as any;
}

export interface AwsCredentialsSecertNames {
  /**
   * @default "AWS_ACCESS_KEY_ID"
   */
  readonly accessKeyId?: string;

  /**
   * @default "AWS_SECRET_ACCESS_KEY"
   */
  readonly secretAccessKey?: string;

  /**
   * @default - no session token is used
   */
  readonly sessionToken?: string;
}