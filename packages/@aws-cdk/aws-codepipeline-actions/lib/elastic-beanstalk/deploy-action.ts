import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

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
export class ElasticBeanstalkDeployAction extends Action {
  private readonly applicationName: string;
  private readonly environmentName: string;

  constructor(props: ElasticBeanstalkDeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'ElasticBeanstalk',
      artifactBounds: deployArtifactBounds(),
      inputs: [props.input],
    });

    this.applicationName = props.applicationName;
    this.environmentName = props.environmentName;
  }

  protected bound(
    _scope: Construct,
    _stage: codepipeline.IStage,
    options: codepipeline.ActionBindOptions,
  ): codepipeline.ActionConfig {

    // Per https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.iam.managed-policies.html
    // it doesn't seem we can scope this down further for the codepipeline action.
    options.role.addManagedPolicy({ managedPolicyArn: 'arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk' });

    // the Action's Role needs to read from the Bucket to get artifacts
    options.bucket.grantRead(options.role);

    return {
      configuration: {
        ApplicationName: this.applicationName,
        EnvironmentName: this.environmentName,
      },
    };
  }
}
