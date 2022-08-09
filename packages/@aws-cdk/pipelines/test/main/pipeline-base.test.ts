import { Construct } from "constructs";
import * as cdk from '@aws-cdk/core';
import { App } from "../../../core/lib";
import { PipelineBase } from "../../lib";

describe('pipeline base', () => {

  test('PipelineBase.isPipeline indicates that a construct extends PipelineBase', () => {

    class TestPipeline extends PipelineBase {

      constructor(scope: Construct, id: string) {
        super(scope, id, { synth: {} });
      }

      protected doBuildPipeline(): void { }
    }

    const app = new App();
    const stack = new cdk.Stack(app, "test-app");
    const pipeline = new TestPipeline(app, "test-pipeline");
    const construct = new Construct(stack, 'Construct');

    expect(PipelineBase.isPipeline(stack)).toBeUndefined();
    expect(PipelineBase.isPipeline(pipeline)).toBeDefined();
    expect(PipelineBase.isPipeline(construct)).toBeUndefined();
  });

});