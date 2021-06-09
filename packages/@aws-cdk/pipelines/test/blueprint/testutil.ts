/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'fs';
import * as path from 'path';
import * as s3 from '@aws-cdk/aws-s3';
import { App, AppProps, Environment, Stack, StackProps, Stage } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cdkp from '../../lib';
import { assemblyBuilderOf } from '../../lib/private/construct-internals';

export const PIPELINE_ENV: Environment = {
  account: '123pipeline',
  region: 'us-pipeline',
};

export class TestApp extends App {
  constructor(props?: Partial<AppProps>) {
    super({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': '1',
      },
      stackTraces: false,
      autoSynth: false,
      treeMetadata: false,
      ...props,
    });
  }

  public cleanup() {
    rimraf(assemblyBuilderOf(this).outdir);
  }
}

export type TestGitHubNpmPipelineProps = Partial<cdkp.SynthStepProps> & { synthStep?: cdkp.Step, engine?: cdkp.IDeploymentEngine };
export class TestGitHubNpmPipeline extends cdkp.Pipeline {
  constructor(scope: Construct, id: string, props?: TestGitHubNpmPipelineProps) {
    super(scope, id, {
      synthStep: new cdkp.SynthStep('Synth', {
        input: cdkp.CodePipelineSource.gitHub('test/test'),
        installCommands: ['npm ci'],
        commands: ['npx cdk synth'],
        ...props,
      }),
      engine: props?.engine ?? new cdkp.CodePipelineEngine(scope, 'Engine'),
      ...props?.synthStep ? { buildStep: props.synthStep } : undefined,
    });
  }
}

/**
 * A test stack
 *
 * It contains a single Bucket. Such robust. Much uptime.
 */
export class BucketStack extends Stack {
  public readonly bucket: s3.IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.bucket = new s3.Bucket(this, 'Bucket');
  }
}

/**
 * rm -rf reimplementation, don't want to depend on an NPM package for this
 */
export function rimraf(fsPath: string) {
  try {
    const isDir = fs.lstatSync(fsPath).isDirectory();

    if (isDir) {
      for (const file of fs.readdirSync(fsPath)) {
        rimraf(path.join(fsPath, file));
      }
      fs.rmdirSync(fsPath);
    } else {
      fs.unlinkSync(fsPath);
    }
  } catch (e) {
    // We will survive ENOENT
    if (e.code !== 'ENOENT') { throw e; }
  }
}

/**
 * Because 'expect(stack)' doesn't work correctly for stacks in nested assemblies
 */
export function stackTemplate(stack: Stack) {
  const stage = Stage.of(stack);
  if (!stage) { throw new Error('stack not in a Stage'); }
  return stage.synth().getStackArtifact(stack.artifactId);
}