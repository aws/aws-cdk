import * as iam from '@aws-cdk/aws-iam';
import { IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as codepipeline from '../lib';
export interface FakeBuildActionProps extends codepipeline.CommonActionProps {
    input: codepipeline.Artifact;
    output?: codepipeline.Artifact;
    extraInputs?: codepipeline.Artifact[];
    owner?: string;
    role?: iam.IRole;
    account?: string;
    region?: string;
    customConfigKey?: string;
    resource?: IResource;
}
export declare class FakeBuildAction extends codepipeline.Action {
    protected readonly providedActionProperties: codepipeline.ActionProperties;
    private readonly customConfigKey;
    constructor(props: FakeBuildActionProps);
    bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
