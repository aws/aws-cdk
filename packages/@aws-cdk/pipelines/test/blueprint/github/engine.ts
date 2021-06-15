import { writeFileSync } from 'fs';
import * as YAML from 'yaml';
import { BuildDeploymentOptions, IDeploymentEngine, ScriptStep, Step, Wave } from '../../../lib';
import { PipelineStructure } from '../../../lib/codepipeline/_pipeline-structure';
import { flatten } from '../../../lib/private/javascript';
import * as github from './workflows-model';

const CDKOUT_ARTIFACT = 'cdk.out';
const BUILD_JOBID = 'build';
const RUNS_ON = 'ubuntu-20.0';

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
   * @default - by default, workflow is triggered on push to the `main` branch
   * and can also be triggered manually (`workflow_dispatch`).
   */
  readonly workflowTriggers?: any;
}

/**
 * GitHub backend for CDK Pipelines.
 */
export class GitHubEngine implements IDeploymentEngine {
  public readonly workflowPath: string;
  public readonly workflowName: string;
  public readonly workflowTriggers: any;

  constructor(props: GitHubEngineProps = {}) {
    this.workflowPath = props.workflowPath ?? '.github/workflows/deploy.yml';
    if (!this.workflowPath.endsWith('.yml') && !this.workflowPath.endsWith('.yaml')) {
      throw new Error('workflow file is expected to be a yaml file');
    }

    this.workflowName = props.workflowName ?? 'deploy';
    this.workflowTriggers = props.workflowTriggers ?? {
      push: { branches: ['main'] },
      workflow_dispatch: {},
    };
  }

  public buildDeployment(options: BuildDeploymentOptions): void {
    const bp = options.blueprint;

    const structure = new PipelineStructure(bp, {
      selfMutation: false,
    });

    const children = flatten(structure.graph.sortedChildren());
    for (const child of children) {
      // eslint-disable-next-line no-console
      console.log(child.id, child.data);
    }


    const jobs = new Array<Job>();

    // render a job which checks out the sources, runs build and produces cdk.out
    jobs.push(this.renderBuildJob(bp.synthStep));

    for (let i = 0; i < bp.waves.length; ++i) {
      const wave = bp.waves[i];
      jobs.push(...this.renderWave(`wave-${i}`, wave));
    }

    // convert jobs to a map and make sure there are no duplicates

    const jobmap: Record<string, github.Job> = {};
    for (const job of jobs) {
      if (job.id in jobmap) {
        throw new Error(`duplicate job id ${job.id}`);
      }
      jobmap[job.id] = job.definition;
    }

    const workflow = {
      name: this.workflowName,
      on: this.workflowTriggers,
      jobs: jobmap,
    };

    // write as a yaml file
    const yaml = YAML.stringify(workflow, {
      indent: 2,
    });

    writeFileSync(this.workflowPath, yaml);
  }

  private renderWave(waveid: string, wave: Wave): Job[] {
    const jobs = new Array<Job>();

    jobs.push(...this.renderSteps(`${waveid}-pre-`, wave.pre));

    for (const stage of wave.stages) {

    }

    jobs.push(...this.renderSteps(`${waveid}-post-`, wave.post));

    return jobs;
  }

  private renderSteps(idprefix: string, steps: Step[]) {
    const jobs = new Array<Job>();
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      jobs.push(this.renderStep(`${idprefix}-${i}`, step));
    }
    return jobs;
  }

  private renderStep(stepid: string, step: Step): Job {
    if (!(step instanceof ScriptStep)) {
      throw new Error(`only ScriptSteps are supported. got ${step.constructor.name}`);
    }

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

    return {
      id: stepid,
      definition: {
        name: step.id,
        permissions: {
          contents: github.JobPermission.READ,
        },
        runsOn: RUNS_ON,
        needs: step.dependencySteps.map(x => x.id),
        env: step.env,
        steps: [
          ...downloadInputs,
          {
            name: 'Install',
            run: step.installCommands.join('\n'),
          },
          {
            name: 'Build',
            run: step.commands.join('\n'),
          },
          ...uploadOutputs,
        ],
      },
    };
  }

  private renderBuildJob(step: Step): Job {
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

    return {
      id: BUILD_JOBID,
      definition: {
        name: 'Synthesize',
        permissions: {
          contents: github.JobPermission.READ,
        },
        runsOn: RUNS_ON,
        env: step.env,
        steps: [
          {
            name: 'Checkout',
            uses: 'actions/checkout@v2',
          },
          {
            name: 'Install',
            run: step.installCommands.join('\n'),
          },
          {
            name: 'Build',
            run: step.commands.join('\n'),
          },
          {
            name: `Upload ${CDKOUT_ARTIFACT}`,
            uses: 'actions/upload-artifact@v2.1.1',
            with: {
              name: CDKOUT_ARTIFACT,
              path: cdkOut.directory,
            },
          },
        ],
      },
    };
  }
}


interface Job {
  readonly id: string;
  readonly definition: github.Job;
}