import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cdk from '@aws-cdk/core';
/**
 * A test stack with a half-prepared pipeline ready to add CloudFormation actions to
 */
export declare class TestFixture extends cdk.Stack {
    readonly pipeline: codepipeline.Pipeline;
    readonly sourceStage: codepipeline.IStage;
    readonly deployStage: codepipeline.IStage;
    readonly repo: codecommit.Repository;
    readonly sourceOutput: codepipeline.Artifact;
    constructor(props?: cdk.StackProps);
}
