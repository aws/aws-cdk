import { Construct } from 'constructs';
import * as codepipeline from '../lib';
export interface IFakeSourceActionVariables {
    readonly firstVariable: string;
}
export interface FakeSourceActionProps extends codepipeline.CommonActionProps {
    readonly output: codepipeline.Artifact;
    readonly extraOutputs?: codepipeline.Artifact[];
    readonly region?: string;
}
export declare class FakeSourceAction extends codepipeline.Action {
    readonly inputs?: codepipeline.Artifact[];
    readonly outputs?: codepipeline.Artifact[];
    readonly variables: IFakeSourceActionVariables;
    protected readonly providedActionProperties: codepipeline.ActionProperties;
    constructor(props: FakeSourceActionProps);
    bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
