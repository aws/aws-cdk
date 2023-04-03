import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Construction properties of the `AlexaSkillDeployAction Alexa deploy Action`.
 */
export interface AlexaSkillDeployActionProps extends codepipeline.CommonActionProps {
    /**
     * The client id of the developer console token
     */
    readonly clientId: string;
    /**
     * The client secret of the developer console token
     */
    readonly clientSecret: SecretValue;
    /**
     * The refresh token of the developer console token
     */
    readonly refreshToken: SecretValue;
    /**
     * The Alexa skill id
     */
    readonly skillId: string;
    /**
     * The source artifact containing the voice model and skill manifest
     */
    readonly input: codepipeline.Artifact;
    /**
     * An optional artifact containing overrides for the skill manifest
     */
    readonly parameterOverridesArtifact?: codepipeline.Artifact;
}
/**
 * Deploys the skill to Alexa
 */
export declare class AlexaSkillDeployAction extends Action {
    private readonly props;
    constructor(props: AlexaSkillDeployActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
