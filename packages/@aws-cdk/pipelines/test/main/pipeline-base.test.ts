import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { App } from '../../../core/lib';
import { PipelineBase, IFileSetProducer, FileSet } from '../../lib';
import { PIPELINE_ENV } from '../testhelpers';

describe('pipeline base', () => {

  test('PipelineBase.isPipeline indicates that a construct extends PipelineBase', () => {
    const app = new App();
    const pipelineStack = new cdk.Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
    const construct = new Construct(pipelineStack, 'Construct');
    const pipeline = new class extends PipelineBase {
      constructor() {
        super(pipelineStack, 'Pipeline', {
          synth: new class implements IFileSetProducer {
            public readonly primaryOutput = new FileSet('PrimaryOutput');
          }(),
        });
      }
      protected doBuildPipeline(): void { }
    }();

    expect(PipelineBase.isPipeline(pipelineStack)).toStrictEqual(false);
    expect(PipelineBase.isPipeline(construct)).toStrictEqual(false);
    expect(PipelineBase.isPipeline(pipeline)).toStrictEqual(true);
  });

});