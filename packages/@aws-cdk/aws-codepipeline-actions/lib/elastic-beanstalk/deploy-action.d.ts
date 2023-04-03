import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * Construction properties of the `ElasticBeanstalkDeployAction Elastic Beanstalk deploy CodePipeline Action`.
 */
export interface ElasticBeanstalkDeployActionProps extends codepipeline.CommonAwsActionProps {
    /**
     * The source to use as input for deployment.
     */
    readonly input: codepipeline.Artifact;
    /**
     * The name of the AWS Elastic Beanstalk application to deploy.
     */
    readonly applicationName: string;
    /**
     * The name of the AWS Elastic Beanstalk environment to deploy to.
     */
    readonly environmentName: string;
}
/**
 * CodePipeline action to deploy an AWS ElasticBeanstalk Application.
 */
export declare class ElasticBeanstalkDeployAction extends Action {
    private readonly applicationName;
    private readonly environmentName;
    constructor(props: ElasticBeanstalkDeployActionProps);
    protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
